<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ScannerController extends AbstractController
{

    #[Route(path: '', name: 'index', methods: 'GET')]
    public function index() {
        return $this->render('landing/index.html.twig');
    }

}