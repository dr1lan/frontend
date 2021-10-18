<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ReportService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ReportController extends AbstractController
{
    public function __construct(private ReportService $scannerService)
    {
    }

    #[Route(path: '/make_report', name: 'make_report', methods: 'POST')]
    public function scan(Request $request): JsonResponse
    {
        $domain = $request->get('url');

        $report = $this->scannerService->runScan($domain);

        return new JsonResponse(['report' => $report]);
    }
}