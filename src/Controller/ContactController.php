<?php

namespace App\Controller;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ContactController extends AbstractController
{
    #[Route('/contact/submit', name: 'contact_submit', methods: ['POST'])]
    public function submitContact(Request $request, MailerInterface $mailer): JsonResponse
    {
        // Récupération des données du formulaire
        $name = $request->request->get('name');
        $email = $request->request->get('email');
        $message = $request->request->get('message');
        $subject = $request->request->get('subject');

        // Créer l'email
        $emailMessage = (new Email())
            ->from('no-reply@votre-domaine.com') // Adresse fixe pour l'expéditeur
            ->to('tatiana68270wi@gmail.com')
            ->subject('Nouveau message de contact: ' . ($subject ?? 'Sans sujet'))
            ->text("Nom: $name\nEmail: $email\nSujet: $subject\nMessage: $message")
            ->replyTo($email); // Utiliser l'email de l'utilisateur comme adresse de réponse
            
        // Envoi de l'email
        $mailer->send($emailMessage);

        // Retourner une réponse JSON
        return new JsonResponse(['success' => true]);
    }
}