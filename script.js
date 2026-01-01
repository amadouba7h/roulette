document.addEventListener("DOMContentLoaded", () => {
  // Variables du jeu
  let portefeuilleJoueur = 100;
  let portefeuilleMaison = 0;

  // Récupération des éléments du DOM
  const selectTypePari = document.getElementById("betType");
  const inputMise = document.getElementById("betAmount");
  const btnJouer = document.getElementById("playBtn");
  const affichageResultat = document.getElementById("resultDisplay");
  const soldeJoueur = document.getElementById("playerBalance");
  const soldeMaison = document.getElementById("computerBalance");
  const zoneMessage = document.getElementById("messageArea");

  // Si on n'est pas sur la page de jeu, on arrête ici
  if (!selectTypePari) return;

  // On remplit le select avec les nombres de 1 à 36
  for (let i = 1; i <= 36; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectTypePari.appendChild(option);
  }

  // Fonction pour mettre à jour l'affichage des portefeuilles
  function mettreAJourSoldes() {
    soldeJoueur.textContent = portefeuilleJoueur;
    soldeMaison.textContent = portefeuilleMaison;
  }

  // Affiche un message (succès ou erreur)
  function afficherMessage(texte, type) {
    zoneMessage.textContent = texte;
    zoneMessage.className = "message-area"; // reset des classes
    if (type) {
      zoneMessage.classList.add(`message-${type}`);
    }
  }

  // Fonction principale du jeu
  function demarrerPartie() {
    const choixPari = selectTypePari.value;
    const montantMise = parseInt(inputMise.value);

    // Vérifications de base
    if (isNaN(montantMise) || montantMise <= 0) {
      afficherMessage("Veuillez entrer une mise valide.", "error");
      return;
    }

    if (montantMise > portefeuilleJoueur) {
      afficherMessage("Vous n'avez pas assez d'argent !", "error");
      return;
    }

    // On désactive le bouton pendant que ça tourne
    btnJouer.disabled = true;
    affichageResultat.textContent = "...";
    afficherMessage("Rien ne va plus...", "");

    // Simulation du temps de la roulette (1 seconde)
    setTimeout(() => {
      // Tirage aléatoire entre 0 et 36
      const numeroTire = Math.floor(Math.random() * 37);
      affichageResultat.textContent = numeroTire;

      let aGagne = false;
      let multiplicateur = 0;

      // Logique de gain
      if (numeroTire === 0) {
        // Le 0 fait perdre tout le monde
        aGagne = false;
      } else if (choixPari === "pair") {
        if (numeroTire % 2 === 0) {
          aGagne = true;
          multiplicateur = 1;
        }
      } else if (choixPari === "impair") {
        if (numeroTire % 2 !== 0) {
          aGagne = true;
          multiplicateur = 1;
        }
      } else {
        // Pari sur un nombre spécifique
        if (parseInt(choixPari) === numeroTire) {
          aGagne = true;
          multiplicateur = 35;
        }
      }

      // Gestion des gains et pertes
      if (aGagne) {
        const gain = montantMise * multiplicateur;
        // Le casino paie le gain
        portefeuilleJoueur += gain;
        portefeuilleMaison -= gain;

        afficherMessage(
          `C'est gagné ! Le numéro était ${numeroTire}. Vous remportez ${gain}.`,
          "success"
        );
      } else {
        // Le joueur perd sa mise
        portefeuilleJoueur -= montantMise;
        portefeuilleMaison += montantMise;
        afficherMessage(`Perdu ! Le numéro était ${numeroTire}.`, "error");
      }

      mettreAJourSoldes();
      btnJouer.disabled = false;
    }, 1000);
  }

  btnJouer.addEventListener("click", demarrerPartie);
});
