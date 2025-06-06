FROM php:8.3-apache

# Installer les extensions PHP nécessaires pour Symfony
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    curl \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        zip \
        pdo \
        pdo_mysql \
        intl \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configuration OPcache pour la production
RUN echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache-recommended.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache-recommended.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache-recommended.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache-recommended.ini \
    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache-recommended.ini

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurer Apache
RUN a2enmod rewrite headers
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
COPY <<EOF /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/html/public

    <Directory /var/www/html/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        DirectoryIndex index.php
        <IfModule mod_negotiation.c>
            Options -MultiViews
        </IfModule>

        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteCond %{REQUEST_URI}::$0 ^(/.+)/(.*)::\2$
            RewriteRule .* - [E=BASE:%1]
            RewriteCond %{HTTP:Authorization} .+
            RewriteRule ^ - [E=HTTP_AUTHORIZATION:%0]
            RewriteCond %{ENV:REDIRECT_STATUS} =""
            RewriteRule ^index\.php(?:/(.*)|$) %{ENV:BASE}/$1 [R=301,L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteRule ^ %{ENV:BASE}/index.php [L]
        </IfModule>
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined

    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
EOF

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers de dépendances
COPY composer.json composer.lock symfony.lock ./

# Installer les dépendances PHP
RUN composer install --no-dev --no-scripts --no-autoloader --optimize-autoloader

# Copier le reste du projet
COPY . .

# Finaliser l'installation Composer
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

# Variables d'environnement
ENV APP_ENV=prod
ENV APP_DEBUG=0
ENV APP_SECRET=change-me-in-railway

# Vider et réchauffer le cache
RUN php bin/console cache:clear --env=prod --no-debug
RUN php bin/console cache:warmup --env=prod --no-debug

# Compilation des assets (sans masquer les erreurs)
RUN php bin/console importmap:install --env=prod --no-debug
RUN php bin/console asset-map:compile --env=prod --no-debug

# Vérification que les fichiers sont bien générés
RUN ls -la /var/www/html/public/assets || echo "Dossier assets manquant"

# Permissions
RUN chown -R www-data:www-data /var/www/html/var /var/www/html/public/assets
RUN chmod -R 775 /var/www/html/var /var/www/html/public/assets

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["apache2-foreground"]
