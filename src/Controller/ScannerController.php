<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ScannerController extends AbstractController
{

    #[Route(path: '', name: 'index', methods: 'GET')]
    public function index(): Response
    {
        return $this->render('landing/index.html.twig', [
            'year' => date('Y'),
        ]);
    }

    #[Route(path: '/report', name: 'report', methods: 'POST')]
    public function report(Request $request): Response
    {
        $report = $request->get('report');

        return $this->render('landing/report/report.html.twig', ['report' => $report, 'year' => date('Y')]);
    }

    #[Route(path: '/about', name: 'about', methods: 'GET')]
    public function about(): Response
    {
        return $this->render('landing/pages/about.html.twig', [
            'year' => date('Y'),
        ]);
    }

    #[Route(path: '/contacts', name: 'contacts', methods: 'GET')]
    public function contacts(): Response
    {
        return $this->render('landing/pages/contacts.html.twig', [
            'year' => date('Y'),
        ]);
    }

    #[Route(path: '/cookie', name: 'cookie', methods: 'GET')]
    public function cookie(): Response
    {
        return $this->render('landing/pages/cookie.html.twig', [
            'year' => date('Y'),
        ]);
    }

    #[Route(path: '/privacy-policy', name: 'privacy-policy', methods: 'GET')]
    public function privacyPolicy(): Response
    {
        return $this->render('landing/pages/privacy-policy.html.twig', [
            'year' => date('Y'),
        ]);
    }
}