<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class MailService
{

    public function __construct(private MailerInterface $mailer,
                                private LoggerInterface $mailerLogger,
                                private string          $from,
                                private string          $to)
    {
    }

    public function sendMail(string $name, string $phone, string $host, string $ip): void
    {
        $ipInfo = $this->getIPInfo($ip);

        $email = (new TemplatedEmail())
            ->from($this->from)
            ->to($this->to)
            ->subject('Заявка на обратный звонок')
            ->htmlTemplate('mail/call.html.twig')
            ->context([
                'host' => $host,
                'name' => $name,
                'phone' => $phone,
                'country' => $ipInfo['country'] ?? '',
                'region' => $ipInfo['region'] ?? '',
                'city' => $ipInfo['city'] ?? '',
            ]);

        $this->mailer->send($email);
    }

    private function getIPInfo(string $ip): array
    {
        $ip = '176.194.230.88';
        $ch = curl_init('http://ip-api.com/json/' . $ip . '?lang=ru');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $result = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);
        $result = json_decode($result, true);

        if ($info['http_code'] !== 200 || $result['status'] === 'fail') {
            $this->mailerLogger->info(sprintf('Не удалось получить информацию по ip %s (%s)',
                $ip, json_encode($result)));

            return [];
        }
        return [
            'country' => $result['country'],
            'region' => $result['regionName'],
            'city' => $result['city'],
        ];
    }
}