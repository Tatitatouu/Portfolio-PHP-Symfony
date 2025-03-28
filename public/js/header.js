document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle"); 
    const navMenu = document.getElementById("nav-menu"); 
    const menuIcon = document.getElementById("menu-icon"); 

    if (!menuToggle || !navMenu || !menuIcon) {
        return;
    }

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("show");

        if (navMenu.classList.contains("show")) {
            menuIcon.classList.replace("fa-bars", "fa-times");
        } else {
            menuIcon.classList.replace("fa-times", "fa-bars");
        }
    });
});
