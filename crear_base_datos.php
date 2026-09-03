<?php

require __DIR__ . '/conexion.php';

$datos = json_decode(file_get_contents(__DIR__ . '/data-1.json'), true, 512, JSON_THROW_ON_ERROR);
$pdo->beginTransaction();

$consulta = $pdo->prepare(
    'INSERT INTO inmuebles
      (id, direccion, ciudad, telefono, codigo_postal, tipo, precio)
     VALUES (:id, :direccion, :ciudad, :telefono, :codigo_postal, :tipo, :precio)
     ON DUPLICATE KEY UPDATE
      direccion = VALUES(direccion), ciudad = VALUES(ciudad), telefono = VALUES(telefono),
      codigo_postal = VALUES(codigo_postal), tipo = VALUES(tipo), precio = VALUES(precio)'
);

foreach ($datos as $inmueble) {
    $consulta->execute([
        ':id' => $inmueble['Id'],
        ':direccion' => $inmueble['Direccion'],
        ':ciudad' => $inmueble['Ciudad'],
        ':telefono' => $inmueble['Telefono'],
        ':codigo_postal' => $inmueble['Codigo_Postal'],
        ':tipo' => $inmueble['Tipo'],
        ':precio' => (float) str_replace(',', '', ltrim($inmueble['Precio'], '$')),
    ]);
}

$pdo->commit();
header('Content-Type: text/plain; charset=utf-8');
echo sprintf("Base de datos actualizada: %d inmuebles importados.\n", count($datos));
