/* Variables */

    const inputs = document.querySelectorAll('input');
    const btns = document.querySelectorAll('button');
    const infos = document.querySelector('.infos');
    const liste = document.querySelector('.liste');
    let nomExisteDeja = false;

/* Date d'expiration */

    const aujourdhui = new Date();
    const semaineSuivante = new Date(aujourdhui.getUTCDate() + 7 * 24 * 60 * 60 * 1000);
    let jour = ('0' + semaineSuivante).slice(9,11);
    let mois = ('0' + (aujourdhui.getMonth() + 1)).slice(-2);
    let annee = aujourdhui.getFullYear();
    document.querySelector('input[type="date"]').value = `${annee}-${mois}-${jour}`

/* Boutons */

    btns.forEach(btn => 
    {
        btn.addEventListener('click', btnAction);
    });

    function btnAction(e)
    {
        e.preventDefault();

        let nouveauObjet = {};

        inputs.forEach(input => 
        {
            let attributName = input.getAttribute('name');
            let attributValeur = attributName !== "date" ? input.value : input.valueAsDate;
            nouveauObjet[attributName] = attributValeur; 
        });

        let description = e.target.getAttribute('data-cookie');

        if(description === "creer")
        {
            creerCookie(nouveauObjet.nom, nouveauObjet.valeur, nouveauObjet.date);
        }
        else if(description === "afficher")
        {
            afficherListeCookie();
        }
    }
    
/* Créer un cookie */

    function creerCookie(nom, valeur, date)
    {

        infos.innerText = "";
        liste.innerHTML = "";

        // Si le cookie a le même nom
        let cookies = document.cookie.split(';');
        cookies.forEach(cookie =>
        {
            cookie = cookie.trim();
            let formatCookie = cookie.split('=');

            if(formatCookie[0] === encodeURIComponent(nom))
            {
                nomExisteDeja = true;
            }

        });

        if(nomExisteDeja)
        {
            infos.innerText = `Un cookie possède déjà ce nom`;
            nomExisteDeja = false;
            return; 
        }

        // Si le cookie n'a pas de nom
        if(nom.length === 0)
        {
            infos.innerText = `Impossible de créer un cookie sans nom`;
            return;
        }

        console.log(document.cookie);

        document.cookie = `${encodeURIComponent(nom)} = ${encodeURIComponent(valeur)}; expires=${date.toUTCString()}`;

        let info = document.createElement('li');
        info.innerText = `Cookie ${nom} créé.`;
        liste.appendChild(info);

        setTimeout(() => 
        {
            info.remove();
        }, 1500);
    }

/* Afficher et supprimer les cookies */

function afficherListeCookie()
{
    let cookies = document.cookie.split(';');
    
    if(cookies.join() === "")
    {
        infos.innerText = 'Pas de cookies à afficher';
        return;
    }

    cookies.forEach(cookie =>
    {
        cookie = cookie.trim();
        let formatCookie = cookie.split('=');

        let li = document.createElement('li');

        infos.innerText = `Cliquez sur un cookie dans la liste pour le supprimer.`
        li.innerText = `Nom : ${decodeURIComponent(formatCookie[0])}, Valeur : ${decodeURIComponent(formatCookie[1])}`;

        liste.appendChild(li);

        //Supprimer un cookie
        li.addEventListener('click', () => 
        {
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
            li.innertext = `Cookie ${formatCookie[0]} supprimé`;

            setTimeout(() => 
            {
                li.remove();
            }, 1000);
        });
    });
}