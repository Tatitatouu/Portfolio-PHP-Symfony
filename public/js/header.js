document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM chargé, initialisation du script...");
    
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = document.getElementById("menu-icon");
    const header = document.querySelector(".header");
    
    console.log("Éléments trouvés:", { 
        menuToggle: !!menuToggle, 
        navMenu: !!navMenu, 
        menuIcon: !!menuIcon 
    });

    // Toggle menu sur mobile
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            console.log("Menu toggle cliqué");
            navMenu.classList.toggle("show");
            
            // Change l'icône selon l'état du menu
            if (navMenu.classList.contains("show")) {
                menuIcon.classList.remove("fa-bars");
                menuIcon.classList.add("fa-times");
                console.log("Menu ouvert");
            } else {
                menuIcon.classList.remove("fa-times");
                menuIcon.classList.add("fa-bars");
                console.log("Menu fermé");
            }
        });
    }

    // Ferme le menu quand on clique sur un lien
    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
        });
    });

    // Ajoute la classe 'scrolled' lors du défilement
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Ferme le menu quand on clique en dehors
    document.addEventListener("click", function(event) {
        if (!header.contains(event.target) && navMenu.classList.contains("show")) {
            navMenu.classList.remove("show");
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
        }
    });
});