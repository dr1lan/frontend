<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportService
{
    public function runScan(string $domain): string
    {
        if (!mb_stristr($domain, 'http')) {
            $domain = 'http://' . $domain;
        }

        $reportPath = '/var/tmp/reports';
        $command = "wapiti -u $domain --scope url -o $reportPath";

        $result = shell_exec($command);

        $tmp = mb_substr($result, mb_stripos($result, $reportPath . '/'));

        $filename = trim(mb_substr($tmp, 0, mb_stripos($tmp, 'в')));

        $crawler = new Crawler(file_get_contents($filename));

        unlink($filename);

        return $crawler->filter('div#page')->html();
    }
}