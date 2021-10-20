<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ReportService;
use Exception;
use Knp\Bundle\SnappyBundle\Snappy\Response\PdfResponse;
use Knp\Snappy\Pdf;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use TypeError;

class ReportController extends AbstractController
{
    public function __construct(private ReportService   $scannerService,
                                private LoggerInterface $scannerLogger,
                                private Pdf             $pdf
    )
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

    #[Route(path: '/pdf', name: 'make_pdf', methods: 'GET')]
    public function makePdf(Request $request): PdfResponse
    {
        $domain = $request->query->get('domain');
        $report = $this->scannerService->runScan($domain);

        $view = $this->scannerService->remakeContentForPdf($request->getSchemeAndHttpHost(),
            $this->renderView('landing/report/report.html.twig', [
                'report' => $report,
                'year' => date('Y'),
            ]));
        return new PdfResponse(
            $this->pdf->getOutputFromHtml($view),
            'report.pdf');
    }
}