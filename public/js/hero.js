document.addEventListener("DOMContentLoaded", function() {
    const texts = [
        "une Alternance dans le Développement Web",
        "un maximum d'opportunités pour évoluer",
        "une équipe avec qui évoluer",
        "un projet innovant à développer"
    ];
    let index = 0;
    let charIndex = 0;
    let typingSpeed = 80;
    let backSpeed = 30;
    let isDeleting = false;
    const typedText = document.getElementById("typed-text");

    function type() {
        if (!isDeleting && charIndex <= texts[index].length) {
            typedText.innerHTML = texts[index].substring(0, charIndex++);
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex >= 0) {
            typedText.innerHTML = texts[index].substring(0, charIndex--);
            setTimeout(type, backSpeed);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) index = (index + 1) % texts.length;
            setTimeout(type, 1000);
        }
    }

    type();
});
