<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\DomCrawler\Crawler;

class ReportService
{

    public function __construct()
    {
    }

    // todo delete report
    public function runScan(string $domain): string
    {
        $reportPath = '/home/sveta/output';
        $command = "wapiti -u $domain --scope url -o $reportPath";

        $result = shell_exec($command);

        $tmp = mb_substr($result, mb_stripos($result, $reportPath . '/'));

        $filename = trim(mb_substr($tmp, 0, mb_stripos($tmp, 'в')));

        $crawler = new Crawler(file_get_contents($filename));

        unlink($filename);

        return $crawler->filter('div#page')->html();
    }
}