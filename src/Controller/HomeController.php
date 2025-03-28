<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'heroTitle' => 'Tatiana FUHRER - Développeuse Web',
            'heroSubtitle' => 'Création de sites web modernes et performants',
            'aboutText' => 'Passionnée par le développement web, je crée des solutions adaptées à vos besoins.',
            'skills' => ['HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Symfony'],
            'projects' => [
                ['title' => 'Projet 1', 'description' => 'Description du projet 1', 'image' => 'projet1.jpg'],
                ['title' => 'Projet 2', 'description' => 'Description du projet 2', 'image' => 'projet2.jpg'],
                ['title' => 'Projet 3', 'description' => 'Description du projet 3', 'image' => 'projet3.jpg'],
            ],
        ]);
    }
}