document.addEventListener("DOMContentLoaded", () => {
    const logos = document.querySelectorAll(".logo-floating");
    const container = document.querySelector(".skills-logos");
    
    // Position et état de la souris
    let mouseX = -100;
    let mouseY = -100;
    let mousePresent = false;
    
    // Suivre la position de la souris dans le conteneur
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mousePresent = true;
    });
    
    container.addEventListener('mouseleave', () => {
      mousePresent = false;
    });
    
    // Stocker les données de chaque logo
    const logoData = [];
    
    // Initialiser les données pour chaque logo
    logos.forEach((logo) => {
      // Récupérer les dimensions réelles
      const width = logo.offsetWidth || 60;
      const height = logo.offsetHeight || 60;
      
      // Générer des positions sécurisées pour éviter les chevauchements initiaux
      let posX, posY;
      let validPosition = false;
      
      // Tenter de trouver une position qui ne chevauche aucun logo existant
      while (!validPosition) {
        posX = Math.random() * (container.offsetWidth - width);
        posY = Math.random() * (container.offsetHeight - height);
        
        validPosition = true;
        
        // Vérifier avec tous les logos existants
        for (const existing of logoData) {
          if (
            posX < existing.posX + existing.width + 10 &&
            posX + width + 10 > existing.posX &&
            posY < existing.posY + existing.height + 10 &&
            posY + height + 10 > existing.posY
          ) {
            validPosition = false;
            break;
          }
        }
      }
      
      logoData.push({
        element: logo,
        posX: posX,
        posY: posY,
        speedX: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1),
        speedY: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1),
        width: width,
        height: height,
        lastCollision: {} // Mémoriser les dernières collisions pour éviter les collisions répétées
      });
    });
    
    // Variables pour l'effet de fuite et mouvement
    const detectionRadius = 150; 
    const maxForce = 6;
    const minSpeed = 1;
    const maxSpeed = 10;
    const friction = 0.995;
    const collisionCooldown = 20; // Nombre de frames avant de permettre une nouvelle collision avec le même objet
    
    // Fonction pour vérifier la collision entre deux logos
    function checkCollision(logo1, logo2) {
      // Ajouter une petite marge pour détecter la collision avant le chevauchement
      const margin = 2;
      return (
        logo1.posX < logo2.posX + logo2.width + margin &&
        logo1.posX + logo1.width + margin > logo2.posX &&
        logo1.posY < logo2.posY + logo2.height + margin &&
        logo1.posY + logo1.height + margin > logo2.posY
      );
    }
    
    // Fonction pour gérer la collision entre deux logos
    function handleCollision(logo1, logo2, i, j) {
      // Vérifier si cette collision est trop récente pour être traitée à nouveau
      const now = performance.now();
      const key1 = `logo_${j}`;
      const key2 = `logo_${i}`;
      
      if (logo1.lastCollision[key1] && now - logo1.lastCollision[key1] < collisionCooldown) {
        return false;
      }
      
      // Enregistrer le moment de cette collision
      logo1.lastCollision[key1] = now;
      logo2.lastCollision[key2] = now;
      
      // Calculer les centres des logos
      const center1X = logo1.posX + logo1.width / 2;
      const center1Y = logo1.posY + logo1.height / 2;
      const center2X = logo2.posX + logo2.width / 2;
      const center2Y = logo2.posY + logo2.height / 2;
      
      // Calculer l'angle et la distance
      const dx = center2X - center1X;
      const dy = center2Y - center1Y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Écart minimum pour éviter les chevauchements
      const minDistance = (logo1.width + logo2.width) / 2;
      
      // Force de séparation plus forte pour éviter le collage
      const separationForce = 1.2;
      
      // Appliquer une correction de position forcée pour éviter le chevauchement
      const correction = Math.max(minDistance - distance, 5) * separationForce;
      const correctionX = Math.cos(angle) * correction;
      const correctionY = Math.sin(angle) * correction;
      
      logo1.posX -= correctionX;
      logo1.posY -= correctionY;
      logo2.posX += correctionX;
      logo2.posY += correctionY;
      
      // Rebond avec conservation de la quantité de mouvement
      // Conservation de la quantité de mouvement: m1v1 + m2v2 = m1v1' + m2v2'
      // On suppose que tous les logos ont la même masse
      const v1x = logo1.speedX;
      const v1y = logo1.speedY;
      const v2x = logo2.speedX;
      const v2y = logo2.speedY;
      
      // Projeter les vitesses sur la ligne de collision
      const v1Dot = v1x * Math.cos(angle) + v1y * Math.sin(angle);
      const v2Dot = v2x * Math.cos(angle) + v2y * Math.sin(angle);
      
      // Calculer les nouvelles vitesses après la collision (avec amortissement)
      const dampingFactor = 0.95; // Facteur d'amortissement
      
      // Calculer les composantes des nouvelles vitesses
      const v1DotNew = v2Dot * dampingFactor;
      const v2DotNew = v1Dot * dampingFactor;
      
      // Convertir en vecteurs de vitesse
      logo1.speedX = v1x + (v1DotNew - v1Dot) * Math.cos(angle);
      logo1.speedY = v1y + (v1DotNew - v1Dot) * Math.sin(angle);
      logo2.speedX = v2x + (v2DotNew - v2Dot) * Math.cos(angle);
      logo2.speedY = v2y + (v2DotNew - v2Dot) * Math.sin(angle);
      
      // Ajouter une légère perturbation aléatoire pour éviter le collage
      logo1.speedX += (Math.random() - 0.5) * 0.5;
      logo1.speedY += (Math.random() - 0.5) * 0.5;
      logo2.speedX += (Math.random() - 0.5) * 0.5;
      logo2.speedY += (Math.random() - 0.5) * 0.5;
      
      return true;
    }
    
    // Fonction principale d'animation
    function animate() {
      // Mettre à jour chaque logo
      logoData.forEach((logo) => {
        // Effet de fuite de la souris
        if (mousePresent) {
          const logoX = logo.posX + logo.width / 2;
          const logoY = logo.posY + logo.height / 2;
          
          const dx = logoX - mouseX;
          const dy = logoY - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < detectionRadius) {
            const angle = Math.atan2(dy, dx);
            const force = maxForce * (1 - distance / detectionRadius);
            
            logo.speedX += Math.cos(angle) * force;
            logo.speedY += Math.sin(angle) * force;
          }
        }
        
        // Appliquer friction
        logo.speedX *= friction;
        logo.speedY *= friction;
        
        // Maintenir la vitesse minimale
        if (Math.abs(logo.speedX) < minSpeed) {
          logo.speedX = minSpeed * (logo.speedX < 0 ? -1 : 1);
        }
        
        if (Math.abs(logo.speedY) < minSpeed) {
          logo.speedY = minSpeed * (logo.speedY < 0 ? -1 : 1);
        }
        
        // Limiter la vitesse maximale
        if (Math.abs(logo.speedX) > maxSpeed) {
          logo.speedX = maxSpeed * Math.sign(logo.speedX);
        }
        if (Math.abs(logo.speedY) > maxSpeed) {
          logo.speedY = maxSpeed * Math.sign(logo.speedY);
        }
        
        // Mettre à jour la position
        logo.posX += logo.speedX;
        logo.posY += logo.speedY;
        
        // Rebondir sur les bords du conteneur
        const maxX = container.offsetWidth - logo.width;
        const maxY = container.offsetHeight - logo.height;
        
        if (logo.posX <= 0) {
          logo.posX = 0;
          logo.speedX = Math.abs(logo.speedX);
        } else if (logo.posX >= maxX) {
          logo.posX = maxX;
          logo.speedX = -Math.abs(logo.speedX);
        }
        
        if (logo.posY <= 0) {
          logo.posY = 0;
          logo.speedY = Math.abs(logo.speedY);
        } else if (logo.posY >= maxY) {
          logo.posY = maxY;
          logo.speedY = -Math.abs(logo.speedY);
        }
      });
      
      // Vérifier et gérer les collisions entre logos
      for (let i = 0; i < logoData.length; i++) {
        for (let j = i + 1; j < logoData.length; j++) {
          if (checkCollision(logoData[i], logoData[j])) {
            handleCollision(logoData[i], logoData[j], i, j);
          }
        }
      }
      
      // Appliquer les nouvelles positions
      logoData.forEach((logo) => {
        logo.element.style.transform = `translate(${logo.posX}px, ${logo.posY}px)`;
      });
      
      requestAnimationFrame(animate);
    }
    
    // Démarrer l'animation
    animate();
  });