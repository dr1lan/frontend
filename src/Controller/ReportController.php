<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ReportService;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use TypeError;

class ReportController extends AbstractController
{
    public function __construct(private ReportService $scannerService,
    private LoggerInterface $scannerLogger)
    {
    }

    #[Route(path: '/make_report', name: 'make_report', methods: 'POST')]
    public function scan(Request $request): Response
    {
        try {
            $domain = $request->get('url');

            $report = $this->scannerService->runScan($domain);

            return new JsonResponse(['report' => $report]);
        } catch (TypeError | Exception $exception) {
            $this->scannerLogger->error($exception);
            return new Response('Сайт не удалось просканировать. Повторите позднее.');
        }
    }
}