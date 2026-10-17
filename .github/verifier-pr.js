// Contrôle d'une Pull Request du dépôt des pages. Aide à la relecture, ne la remplace pas :
// c'est le gardien qui décide de fusionner.
// Variables : BASE_SHA, HEAD_SHA, PR_AUTEUR (pseudo GitHub de la personne qui ouvre la PR).
const { execSync } = require('child_process');

const base = process.env.BASE_SHA, head = process.env.HEAD_SHA, auteur = (process.env.PR_AUTEUR || '').toLowerCase();
if (!base || !head || !auteur) { console.error('Variables manquantes : BASE_SHA, HEAD_SHA, PR_AUTEUR'); process.exit(2); }

const EXT = new Set(['html', 'css', 'js', 'mjs', 'json', 'txt', 'md', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'woff', 'woff2', 'mp3', 'wav', 'ogg', 'mp4', 'webm']);
const MAX_OCTETS = 25 * 1024 * 1024;
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 1 << 26 }).trim();
const erreurs = [];
const err = (m) => { if (!erreurs.includes(m)) erreurs.push(m); };

// Fichiers modifiés : « A\tchemin », « M\tchemin », « D\tchemin », « R100\tancien\tnouveau »
const lignes = sh(`git diff --name-status --no-renames ${base} ${head}`).split('\n').filter(Boolean);
const touches = lignes.map((l) => { const [statut, ...chemins] = l.split('\t'); return { statut, chemin: chemins[0] }; });
if (touches.length === 0) { console.log('Aucun fichier modifié.'); process.exit(0); }

const RE = /^pages\/([a-z0-9-]{1,39})\/([a-z0-9-]{1,60})\/(.+)$/;
const dossiers = new Map(); // "login/slug" -> supprimé en entier ?

function ouverte(login, slug) {
  try { return JSON.parse(sh(`git show ${base}:pages/${login}/${slug}/meta.json`)).ouverte === true; } catch { return false; }
}

for (const { statut, chemin } of touches) {
  const m = RE.exec(chemin);
  if (!m) { err(`« ${chemin} » est hors de pages/ton-pseudo/nom-de-ta-page/. Seul ce dossier est accepté.`); continue; }
  const [, login, slug, reste] = m;
  if (login !== auteur && !ouverte(login, slug)) {
    err(`« ${chemin} » est dans le dossier de ${login}. Tu ne peux modifier que pages/${auteur}/, ou une page que son auteur a ouverte (meta.json avec "ouverte": true).`);
  }
  const segments = reste.split('/');
  if (segments.length > 5) err(`« ${chemin} » est trop profond (5 sous-dossiers au maximum).`);
  for (const s of segments) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(s)) err(`Le nom « ${s} » (dans ${chemin}) n'est pas valide : lettres, chiffres, point, tiret et soulignement, sans commencer par un point.`);
    if (s.includes('..')) err(`Le nom « ${s} » contient « .. ».`);
  }
  const nom = segments.at(-1), ext = (nom.split('.').pop() || '').toLowerCase();
  if (statut !== 'D') {
    if (!EXT.has(ext)) err(`Le fichier « ${chemin} » n'est pas d'un type accepté (${[...EXT].join(', ')}).`);
    const info = sh(`git ls-tree ${head} -- "${chemin}"`); // « mode type sha\tchemin »
    const mode = info.split(' ')[0];
    if (mode === '120000') err(`« ${chemin} » est un lien symbolique : ils sont interdits.`);
    else if (info) {
      const taille = Number(sh(`git cat-file -s ${info.split(' ')[2].split('\t')[0]}`));
      if (taille > MAX_OCTETS) err(`« ${chemin} » pèse ${(taille / 1048576).toFixed(1)} Mo : 25 Mo au maximum.`);
    }
  }
  const cle = `${login}/${slug}`; dossiers.set(cle, (dossiers.get(cle) ?? true) && statut === 'D');
}

// Chaque page touchée doit garder son index.html, sauf si elle est supprimée en entier.
for (const [cle, supprime] of dossiers) {
  if (supprime) continue;
  try { sh(`git cat-file -e ${head}:pages/${cle}/index.html`); } catch { err(`La page ${cle} n'a pas de fichier index.html : c'est sa page d'accueil, il est obligatoire.`); }
  try { const meta = sh(`git show ${head}:pages/${cle}/meta.json`); JSON.parse(meta); } catch (e) { if (!/exists on disk|does not exist|fatal/.test(String(e.message))) err(`Le fichier meta.json de ${cle} n'est pas un JSON valide.`); }
}

if (erreurs.length) {
  console.error(`\nLe contrôle a trouvé ${erreurs.length} problème${erreurs.length > 1 ? 's' : ''} :\n`);
  erreurs.forEach((e) => console.error(`  - ${e}`));
  console.error('\nCorrige-les dans ta copie du dépôt : la PR se met à jour toute seule.');
  process.exit(1);
}
console.log(`Contrôle réussi : ${touches.length} fichier(s) dans ${dossiers.size} page(s).`);
