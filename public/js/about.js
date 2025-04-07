document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector(".about-container");
    
    function fadeInOnScroll() {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            aboutSection.classList.add("fade-in");
        }
    }

    window.addEventListener("scroll", fadeInOnScroll);
    fadeInOnScroll();
});
