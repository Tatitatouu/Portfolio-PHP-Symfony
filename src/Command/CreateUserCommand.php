<?php

// src/Command/CreateUserCommand.php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CreateUserCommand extends Command
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    protected function configure()
{
    $this
        ->setName('app:create-user')  // Définit le nom de la commande
        ->setDescription('Creates a new user in the database.')
        ->addArgument('email', InputArgument::REQUIRED, 'The email of the user')
        ->addArgument('password', InputArgument::REQUIRED, 'The password of the user');
}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        // Vérifier si un utilisateur avec cet email existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            $output->writeln('User with this email already exists.');
            return Command::FAILURE;
        }

        // Création de l'utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_USER']);  // Par défaut, rôle utilisateur (tu peux modifier si nécessaire)
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Sauvegarde dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $output->writeln('User successfully created.');

        return Command::SUCCESS;
    }
}
