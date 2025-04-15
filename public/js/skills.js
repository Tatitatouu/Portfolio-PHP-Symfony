document.addEventListener("DOMContentLoaded", () => {
    const logos = document.querySelectorAll(".logo-floating");
    const container = document.querySelector(".skills-logos");

    const logoData = [];

    logos.forEach((logo) => {
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
                    posX < existingLogo.posX + existingLogo.width + 2 &&
                    posX + width + 2 > existingLogo.posX &&
                    posY < existingLogo.posY + existingLogo.height + 2 &&
                    posY + height + 2 > existingLogo.posY
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
            element: logo,
            posX,
            posY,
            speedX: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
            speedY: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
            width,
            height
        });

        logo.style.transform = `translate(${posX}px, ${posY}px)`;
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

    function animate() {
        const maxX = container.offsetWidth;
        const maxY = container.offsetHeight;

        logoData.forEach(logo => {
            logo.posX += logo.speedX;
            logo.posY += logo.speedY;

            if (logo.posX <= 0 || logo.posX + logo.width >= maxX) {
                logo.speedX *= -1;
            }
            if (logo.posY <= 0 || logo.posY + logo.height >= maxY) {
                logo.speedY *= -1;
            }
        });

        for (let i = 0; i < logoData.length; i++) {
            for (let j = i + 1; j < logoData.length; j++) {
                if (checkCollision(logoData[i], logoData[j])) {
                    handleCollision(logoData[i], logoData[j]);
                }
            }
        }

        logoData.forEach(logo => {
            logo.element.style.transform = `translate(${logo.posX}px, ${logo.posY}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});
