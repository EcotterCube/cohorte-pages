# Cohorte Pages

Les pages libres de la cohorte : un jeu, un portfolio, une expérience, une démo. Chaque page est un dossier de fichiers web (HTML, CSS, JavaScript, images...). Le site de la cohorte les affiche toutes : https://cowork-cohorte.lovable.app/pages

Ce dépôt est **public** : tout ce qui y est publié est visible de tous et peut être copié. Ne mets jamais d'information privée, de clé ou de mot de passe.

## Participer avec GitHub : fork et Pull Request

C'est le chemin pour s'entraîner à Git en vrai, et le seul pour publier une page de **plusieurs fichiers**.

1. **Fork** : clique sur « Fork » en haut de cette page. GitHub crée ta propre copie du dépôt.
2. **Ajoute ton dossier** dans ta copie, à cet endroit précis : `pages/ton-pseudo-github/nom-de-ta-page/`
   - Le plus simple : « Add file », puis « Upload files », et glisse ton dossier.
   - Un fichier `index.html` est obligatoire : c'est la page d'accueil de ta page.
   - Pour un point de départ, copie le dossier [`modeles/page-multi-fichiers`](modeles/page-multi-fichiers).
3. **Commit** : écris une phrase qui dit ce que tu as fait, par exemple « Ajoute ma page de quiz ».
4. **Pull Request** : sur ta copie, clique sur « Contribute », puis « Open pull request ». Donne un titre et une description.
5. **Attends la relecture**. Un contrôle automatique vérifie ta PR (bon dossier, types de fichiers, poids). Ensuite un gardien relit et fusionne. Ta page apparaît sur le site.

Tu peux aussi créer une page d'un seul fichier directement sur le site, avec son éditeur : https://cowork-cohorte.lovable.app/pages/nouvelle

## Ce qui est accepté

- **Où** : uniquement dans `pages/ton-pseudo-github/nom-de-ta-page/`. Les noms de dossiers sont en minuscules, avec des chiffres et des tirets.
- **Fichiers** : pages et scripts (`.html`, `.css`, `.js`, `.json`, `.txt`, `.md`), images (`.png`, `.jpg`, `.gif`, `.webp`, `.svg`, `.ico`), polices (`.woff`, `.woff2`), sons et vidéos (`.mp3`, `.wav`, `.ogg`, `.mp4`, `.webm`).
- **Poids** : 25 Mo maximum par fichier. Compresse tes images et tes vidéos.
- **Pas de lien symbolique**, pas de fichier caché (nom qui commence par un point), pas de programme à exécuter.
- Une page vit dans une **zone isolée** : elle ne peut pas lire les données du site, ni le stockage du navigateur. Pour garder des données, prévois l'export et l'import d'un fichier.

## Les informations de ta page (facultatif)

Tu peux ajouter un fichier `meta.json` dans ton dossier. Sans lui, le site prend le titre de la balise `<title>` de ta page.

```json
{
  "titre": "Mon quiz",
  "description": "Dix questions pour réviser le vocabulaire.",
  "ouverte": false
}
```

- `ouverte: true` autorise les autres membres à modifier ta page par PR. Tout reste dans l'historique, tu peux revenir en arrière.
- Un fichier `brand.md` décrit ton design (couleurs, polices, arrondi) : voir le tuto « Donner un design à ma page » sur le site.

## Les règles

La [charte de la plateforme](https://cowork-cohorte.lovable.app/regles) s'applique à tout ce que tu publies ici : respect, pas de contenu violent, vulgaire ou inapproprié, pas de plagiat, pas de code malveillant. En ouvrant une PR, tu confirmes l'avoir lue et acceptée. Les gardiens peuvent refuser ou retirer une page.

## Pour les gardiens

Avant de fusionner une PR : le contrôle automatique est vert, le membre a signé la charte (voir la page Membres du site), tu as regardé la page (aperçu depuis la liste des pages en attente du site), et elle respecte la charte. Fusionne avec une fusion classique, sans squash.
