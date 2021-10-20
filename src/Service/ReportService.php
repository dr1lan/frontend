<?php

declare(strict_types=1);

namespace App\Service;

use Exception;
use Symfony\Component\DomCrawler\Crawler;

class ReportService
{
    public function runScan(string $domain): string
    {
        $urlPattern = '/((http|https)\:\/\/)?[a-zа-яA-ZА-Я0-9\.\/\?\:@\-_=#]+\.([a-zа-яA-ZА-Я0-9\&\.\/\?\:@\-_=#])*/';
        if (preg_match($urlPattern, $domain)) {
            if (!mb_stristr($domain, 'http')) {
                $domain = 'http://' . $domain;
            }
        } else {
            throw new Exception('Невалидный URL.');
        }
        $reportPath = '/var/tmp/reports';
        $command = str_replace(';', '', "wapiti -u $domain --scope url -o $reportPath");

        $result = shell_exec($command);

        $tmp = mb_substr($result, mb_stripos($result, $reportPath . '/'));

        $filename = trim(mb_substr($tmp, 0, mb_stripos($tmp, 'в')));

        $crawler = new Crawler(file_get_contents($filename));

        unlink($filename);

        return $crawler->filter('div#page')->html();
    }

    public function remakeContentForPdf(string $content): string
    {
        $crawler = new Crawler($content);
        $crawler->filter('header')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->parentNode->removeChild($node);
            }
        });

        $crawler->filter('footer')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->parentNode->removeChild($node);
            }
        });

        $crawler->filter('link')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('href', 'http://localhost:8000' . $node->getAttribute('href'));
            }
        });

        $crawler->filter('script')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('src', 'http://localhost:8000' . $node->getAttribute('src'));
            }
        });

        $crawler->filter('#report_table a')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('href', "#");
            }
        });

        $crawler->filter("#pdf_link")->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->parentNode->removeChild($node);
            }
        });

        $crawler->filter('nav')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('style', 'display: none;');
            }
        });
        $crawler->filter('section')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('style', 'display: none;');
            }
        });

        $crawler->filter('table.table_report')->each(function (Crawler $crawler) {
            foreach ($crawler as $node) {
                $node->setAttribute('style', 'display: block;');
            }
        });
        return $crawler->html();
    }
}