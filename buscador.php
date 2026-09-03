<?php

require __DIR__ . '/conexion.php';
header('Content-Type: application/json; charset=utf-8');

if (($_REQUEST['accion'] ?? '') === 'ciudades') {
    $sentencia = $pdo->query('SELECT DISTINCT ciudad FROM inmuebles ORDER BY ciudad');
    echo json_encode($sentencia->fetchAll(PDO::FETCH_COLUMN), JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_REQUEST['accion'] ?? '') === 'tipos') {
    $sentencia = $pdo->query('SELECT DISTINCT tipo FROM inmuebles ORDER BY tipo');
    echo json_encode($sentencia->fetchAll(PDO::FETCH_COLUMN), JSON_UNESCAPED_UNICODE);
    exit;
}

$condiciones = [];
$parametros = [];

if (!empty($_REQUEST['ciudad'])) {
    $condiciones[] = 'ciudad = :ciudad';
    $parametros[':ciudad'] = $_REQUEST['ciudad'];
}

if (!empty($_REQUEST['tipo'])) {
    $condiciones[] = 'tipo = :tipo';
    $parametros[':tipo'] = $_REQUEST['tipo'];
}

$rango = explode(';', $_REQUEST['precio'] ?? '0;100000');
$minimo = filter_var($rango[0] ?? 0, FILTER_VALIDATE_FLOAT);
$maximo = filter_var($rango[1] ?? 100000, FILTER_VALIDATE_FLOAT);

if ($minimo !== false && $maximo !== false) {
    $condiciones[] = 'precio BETWEEN :minimo AND :maximo';
    $parametros[':minimo'] = min($minimo, $maximo);
    $parametros[':maximo'] = max($minimo, $maximo);
}

$consulta = 'SELECT id, direccion, ciudad, telefono, codigo_postal, tipo, precio
             FROM inmuebles';
if ($condiciones) {
    $consulta .= ' WHERE ' . implode(' AND ', $condiciones);
}
$consulta .= ' ORDER BY id';

$sentencia = $pdo->prepare($consulta);
$sentencia->execute($parametros);
echo json_encode($sentencia->fetchAll(), JSON_UNESCAPED_UNICODE);
