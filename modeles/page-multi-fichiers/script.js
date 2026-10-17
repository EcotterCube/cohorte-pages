// Un compteur tout simple. Une page ne peut pas enregistrer dans le navigateur (elle vit dans une zone isolée) :
// le total repart à zéro à chaque visite. Pour garder des données, propose un export et un import de fichier.
let total = 0;
const bouton = document.getElementById('clic');
const sortie = document.getElementById('total');

bouton.addEventListener('click', () => {
  total += 1;
  sortie.textContent = total + (total > 1 ? ' données envoyées' : ' donnée envoyée') + ' pour l’instant.';
});
