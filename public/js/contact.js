document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.querySelector('.status-message');
    const loader = document.querySelector('.loader');

    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        loader.style.display = 'block';
        statusMessage.textContent = '';

        const formData = new FormData(contactForm);

        fetch("{{ path('contact_submit') }}", {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          loader.style.display = 'none';

          if (data.success) {
            statusMessage.textContent = 'Merci ! Je reviendrai vers toi rapidement. 😊';
            contactForm.reset();

            setTimeout(() => {
              statusMessage.textContent = '';
            }, 4000);
          } else {
            statusMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
          }
        })
        .catch(error => {
          loader.style.display = 'none';
          statusMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        });
      });
    }

    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', function() {
        if (this.value === '') {
          this.parentElement.classList.remove('focused');
        }
      });

      if (input.value !== '') {
        input.parentElement.classList.add('focused');
      }
    });
  });