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

        // Créer l'email
        $emailMessage = (new Email())
            ->from('ton.email@example.com')
            ->to('destinataire@example.com')
            ->subject('Nouveau message de contact')
            ->text("Nom: $name\nEmail: $email\nMessage: $message");

        // Envoi de l'email
        $mailer->send($emailMessage);

        // Retourner une réponse JSON
        return new JsonResponse(['success' => true]);
    }
}
