document.addEventListener("DOMContentLoaded", function() {    
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = document.getElementById("menu-icon");
    const header = document.querySelector(".header");

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

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Décalage pour coller un peu avant la section
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});