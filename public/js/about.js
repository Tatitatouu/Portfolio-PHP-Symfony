document.addEventListener("DOMContentLoaded", function () {
    // Animation au défilement pour les éléments principaux
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer la section about et les feature cards
    const aboutSection = document.querySelector(".about-section");
    const featureCards = document.querySelectorAll(".feature-card");
    
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    // Animation séquentielle des cartes avec délai
    featureCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        card.style.transitionDelay = `${index * 0.15}s`;
        
        observer.observe(card);
    });
    
    // Ajouter des styles quand les éléments deviennent visibles
    document.addEventListener('scroll', function() {
        document.querySelectorAll('.visible').forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });
    });
    
    // Animation des highlights au survol
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', () => {
            highlight.style.color = '#a57b99';
        });
        
        highlight.addEventListener('mouseleave', () => {
            highlight.style.color = '#d1a6c6';
        });
    });
    
    // Animation parallaxe légère sur l'image
    const aboutImage = document.querySelector('.about-image-container');
    
    if (aboutImage) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            aboutImage.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px)`;
        });
    }
});