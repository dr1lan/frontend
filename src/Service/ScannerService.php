<?php

declare(strict_types=1);

namespace App\Service;

class ScannerService
{

    public function __construct()
    {
    }

    public function runScan(string $domain) {
        $command = "wapiti -u $domain --scope page -o /home/sveta/output";

        $result = shell_exec($command);
    }
}