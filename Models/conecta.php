<?php

if ($_SERVER['SERVER_NAME'] == 'ezcomunicacao.servehttp.com'){
	//especifica os dados para conexão local
  $nomedoservidor = 'localhost';
	$usuariodobanco = 'root';
	$senhadobanco   = '';
	$basededados    = 'clovisfreitas';

} else {
	//especifica os dados para conexão remota
	$nomedoservidor = 'localhost';
	$usuariodobanco = 'clovisfreitas';
	$senhadobanco   = '105benno102';
	$basededados    = 'CFreitas';
}
$conex = mysql_connect($nomedoservidor, $usuariodobanco, $senhadobanco);
$db = mysql_select_db($basededados);

?>