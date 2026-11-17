<?php
/**
 * Contact form handler for Hostinger (PHP mail()).
 * Sends visitor messages to TO_EMAIL. Returns JSON.
 *
 * Hostinger tip: FROM_EMAIL must be an address on your own domain
 * (create it in hPanel → Emails) or mail may be rejected/spam-filtered.
 */

const TO_EMAIL   = 'contact@mazenfraihat.com';
const FROM_EMAIL = 'noreply@mazenfraihat.com';
const SITE_NAME  = 'mazenfraihat.com';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond($ok, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode($error ? ['ok' => $ok, 'error' => $error] : ['ok' => $ok]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed', 405);
}

// Honeypot: bots fill hidden fields; pretend success
if (!empty($_POST['website'])) {
    respond(true);
}

// Too-fast submissions (< 3s after page load) are almost always bots
$ts = isset($_POST['ts']) ? (int) $_POST['ts'] : 0;
if ($ts > 0 && (round(microtime(true) * 1000) - $ts) < 3000) {
    respond(true);
}

// Simple per-IP rate limit: 5 messages per hour
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = sys_get_temp_dir() . '/mf_contact_' . md5($ip);
$now = time();
$hits = [];
if (is_file($rlFile)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) @file_get_contents($rlFile))),
        fn($t) => $t > $now - 3600
    );
}
if (count($hits) >= 5) {
    respond(false, 'Too many messages. Please try again later.', 429);
}

$clean = fn($v, $max) => mb_substr(trim(str_replace(["\r", "\0"], '', (string) $v)), 0, $max);
$name    = $clean($_POST['name'] ?? '', 100);
$email   = $clean($_POST['email'] ?? '', 150);
$message = $clean($_POST['message'] ?? '', 5000);

// Strip newlines from header-bound fields (prevents header injection)
$name = preg_replace('/[\n\t]+/', ' ', $name);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please provide your name, a valid email, and a message.', 422);
}

$subject = "New message from {$name} — " . SITE_NAME;
$body  = "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "IP: {$ip}\n";
$body .= "Date: " . date('Y-m-d H:i:s T') . "\n\n";
$body .= "Message:\n{$message}\n";

$headers  = 'From: ' . SITE_NAME . ' <' . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

if (@mail(TO_EMAIL, $encodedSubject, $body, $headers, '-f' . FROM_EMAIL)) {
    $hits[] = $now;
    @file_put_contents($rlFile, implode(',', $hits));
    respond(true);
}

respond(false, 'Mail server error', 500);
