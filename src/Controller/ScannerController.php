<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ScannerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ScannerController extends AbstractController
{
    public function __construct(private ScannerService $scannerService)
    {
    }

    #[Route(path: '', name: 'index', methods: 'GET')]
    public function index(): Response
    {
        return $this->render('landing/index.html.twig');
    }

    #[Route(path: '/scan', name: 'scan', methods: 'POST')]
    public function scan(Request $request): JsonResponse
    {
        $domain = $request->get('url');

        $this->scannerService->runScan($domain);

        return new JsonResponse();
    }
}