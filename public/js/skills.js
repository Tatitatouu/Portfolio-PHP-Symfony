document.addEventListener("DOMContentLoaded", () => {
    const logos = document.querySelectorAll(".logo-floating");
    const logoContainers = document.querySelectorAll(".logo-container");
    const container = document.querySelector(".skills-logos");
    const descriptionBox = document.getElementById("description-box");
    const descriptionPrompt = document.getElementById("description-prompt");
    const descriptionContent = document.querySelector(".description-content");
    let activeLogoElement = null;

    // Animation des logos flottants
    const logoData = [];

    logoContainers.forEach((logoContainer, index) => {
        const logo = logoContainer.querySelector(".logo-floating");
        
        // Ajouter l'événement de clic pour afficher la description
        logo.addEventListener("click", () => {
            // Si on clique sur le même logo qui est déjà actif, désactiver
            if (activeLogoElement === logo) {
                logo.classList.remove("active");
                descriptionBox.classList.remove("active");
                setTimeout(() => {
                    descriptionPrompt.classList.remove("hidden");
                }, 300);
                activeLogoElement = null;
            } else {
                // Désactiver l'ancien logo actif s'il existe
                if (activeLogoElement) {
                    activeLogoElement.classList.remove("active");
                }
                
                // Activer le nouveau logo avec effet d'animation
                logo.classList.add("active");
                activeLogoElement = logo;
                
                // Animer la transition de la description
                descriptionPrompt.classList.add("hidden");
                
                setTimeout(() => {
                    // Mettre à jour le contenu avec une animation de remplacement
                    const description = logo.getAttribute("data-description");
                    descriptionContent.textContent = description;
                    
                    // Afficher la zone de description
                    descriptionBox.classList.add("active");
                }, 300);
            }
        });

        const width = logo.offsetWidth;
        const height = logo.offsetHeight;

        let posX, posY;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 50;

        while (!validPosition && attempts < maxAttempts) {
            posX = Math.random() * (container.offsetWidth - width);
            posY = Math.random() * (container.offsetHeight - height);
            validPosition = true;

            for (const existingLogo of logoData) {
                if (
                    posX < existingLogo.posX + existingLogo.width + 5 &&
                    posX + width + 5 > existingLogo.posX &&
                    posY < existingLogo.posY + existingLogo.height + 5 &&
                    posY + height + 5 > existingLogo.posY
                ) {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        if (!validPosition) {
            posX = Math.random() * (container.offsetWidth - width);
            posY = Math.random() * (container.offsetHeight - height);
        }

        logoData.push({
            container: logoContainer,
            element: logo,
            posX,
            posY,
            speedX: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
            speedY: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
            width,
            height
        });

        logoContainer.style.transform = `translate(${posX}px, ${posY}px)`;
    });

    function checkCollision(a, b) {
        return (
            a.posX < b.posX + b.width &&
            a.posX + a.width > b.posX &&
            a.posY < b.posY + b.height &&
            a.posY + a.height > b.posY
        );
    }

    function handleCollision(a, b) {
        const dx = (b.posX + b.width / 2) - (a.posX + a.width / 2);
        const dy = (b.posY + b.height / 2) - (a.posY + a.height / 2);
        const angle = Math.atan2(dy, dx);

        const tempX = a.speedX;
        const tempY = a.speedY;

        a.speedX = b.speedX;
        a.speedY = b.speedY;
        b.speedX = tempX;
        b.speedY = tempY;

        const push = 1;
        a.posX -= Math.cos(angle) * push;
        a.posY -= Math.sin(angle) * push;
        b.posX += Math.cos(angle) * push;
        b.posY += Math.sin(angle) * push;
    }

    window.addEventListener("resize", () => {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        logoData.forEach(logo => {
            if (logo.posX + logo.width > containerWidth) {
                logo.posX = containerWidth - logo.width;
            }
            if (logo.posY + logo.height > containerHeight) {
                logo.posY = containerHeight - logo.height;
            }
        });
    });

    // Cliquer ailleurs pour désactiver le logo sélectionné
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".logo-floating") && activeLogoElement) {
            activeLogoElement.classList.remove("active");
            descriptionBox.classList.remove("active");
            setTimeout(() => {
                descriptionPrompt.classList.remove("hidden");
            }, 300);
            activeLogoElement = null;
        }
    });

    function animate() {
        const maxX = container.offsetWidth;
        const maxY = container.offsetHeight;

        logoData.forEach(logo => {
            // Ne pas déplacer le logo si c'est le logo actif
            if (logo.element === activeLogoElement) {
                return;
            }

            logo.posX += logo.speedX;
            logo.posY += logo.speedY;

            if (logo.posX <= 0) {
                logo.posX = 0;
                logo.speedX *= -1;
            } else if (logo.posX + logo.width >= maxX) {
                logo.posX = maxX - logo.width;
                logo.speedX *= -1;
            }
            
            if (logo.posY <= 0) {
                logo.posY = 0;
                logo.speedY *= -1;
            } else if (logo.posY + logo.height >= maxY) {
                logo.posY = maxY - logo.height;
                logo.speedY *= -1;
            }
        });

        for (let i = 0; i < logoData.length; i++) {
            // Ne pas vérifier les collisions avec le logo actif
            if (logoData[i].element === activeLogoElement) {
                continue;
            }

            for (let j = i + 1; j < logoData.length; j++) {
                // Ne pas vérifier les collisions avec le logo actif
                if (logoData[j].element === activeLogoElement) {
                    continue;
                }

                if (checkCollision(logoData[i], logoData[j])) {
                    handleCollision(logoData[i], logoData[j]);
                }
            }
        }

        logoData.forEach(logo => {
            logo.container.style.transform = `translate(${logo.posX}px, ${logo.posY}px)`;
        });

        requestAnimationFrame(animate);
    }

    // Animation de démarrage : les logos apparaissent progressivement
    logoContainers.forEach((container, index) => {
        container.style.opacity = "0";
        setTimeout(() => {
            container.style.opacity = "1";
            container.style.transition = "opacity 0.5s ease";
        }, index * 100);
    });

    // Démarrer l'animation principale après un délai pour permettre l'animation d'entrée
    setTimeout(() => {
        animate();
    }, 1000);
});