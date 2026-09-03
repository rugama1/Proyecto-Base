<?php

$configuracion = require __DIR__ . '/config.php';
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $configuracion['host'],
    $configuracion['port'],
    $configuracion['database'],
    $configuracion['charset']
);

try {
    $pdo = new PDO($dsn, $configuracion['username'], $configuracion['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $error) {
    http_response_code(500);
    die('No se pudo conectar con MySQL. Revisa config.php.');
}
