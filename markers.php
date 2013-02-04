<?php
require_once 'gmaps.class.php';
$gmaps = new gMaps;

# Carregar de  XML
//$gmaps->loadFromXML("markers.xml");
//$gmaps->getMarkers();exit;

# Adicionar pin/icons 
//$gmaps->addIcon("NOME ICON","IMAGEM.EXT","LARGURA","ALTURA");
$gmaps->addIcon( "Comercial", "img/icons/Comercial.png", "48", "48" );
$gmaps->addIcon( "Industrial", "img/icons/Industrial.png", "48", "48" );
$gmaps->addIcon( "Residencial", "img/icons/Residencial.png", "48", "48" );

# Adicionar marcador por latitude e longitute
//$gmaps->addMarker("LATITUDE","LONGITUDE","TEXTO HTML","ICON");
//$gmaps->addMarker("LATITUDE","LONGITUDE");
//$gmaps->addMarker("-23.5462057","-46.3022458","<p>Lanchonete Jo�o</p><p><img src=http://tinyurl.com/897xozw /></p><p>R$ 4,50</p>","pizza");
//$gmaps->addMarker("-23.5462057","-46.3022458","<p>Lanchonete Jo�o</p>","pizza");

# Adicionar marcador por CEP e Numero
//$gmaps->addMarkerCep("CEP","NUMERO");
//$gmaps->addMarkerCep("08615000","555","<p>Mercado do Jos�</p>","kart");
//$gmaps->addMarkerCep("08665060","110","<p>Imobili�ria do Chico</p>","imovel");
//$gmaps->addMarkerCep("08664580","81","<p>Alguma Coisa Verde</p>","green");

# Adicionar marcador por endereco
//$gmaps->addMarkerAddress("RUA, NUMERO, CIDADE, SIGLA UF");
	// Define a consulta MySQL
	include_once 'Models/conecta.php';
	$busca = "SELECT * FROM cf_imoveis WHERE imo_destaque= '1' AND imo_website = '1' ORDER BY RAND() LIMIT 6";
	// Executa a consulta (query)
	$query =  mysql_query($busca);
	// Inicia um loop para cada resultado encontrado
	while ($Imovel = mysql_fetch_array($query)) {
		//numero
		$numero = $Imovel['imo_numero'];
		//tipo
		$tipologradouro = $Imovel['imo_tipo_logradouro'];
		//logradouro
		$logradouro = utf8_decode($Imovel['imo_endereco'] );
		//$logradouro = $Imovel['imo_endereco'];
		//$logradouro = removerCaracter($logradouro);
		//Cidade
		$Querycidade = mysql_fetch_array(mysql_query("SELECT * FROM cf_cidade WHERE cid_id = '".$Imovel['imo_cidade'] . "'"));
		$cidade = $Querycidade["cid_nome"];// Exibe o nome da cidade
		$cidade = str_replace(" - RS", "", $cidade);
		$cidade = utf8_decode($cidade);
		$estado = substr($Querycidade["cid_nome"], -2);
		//bairro
		$Querybairro = mysql_fetch_array(mysql_query("SELECT * FROM cf_bairros WHERE bai_id = '".$Imovel['imo_bairro'] . "'")); //Exibe o ID do Bairro
		$bairro = $Querybairro["bai_nome"]; // Exibe o nome do Bairro
		$bairro = utf8_decode($bairro);
		//Foto
		$Queryfoto = mysql_fetch_array(mysql_query("SELECT * FROM cf_fotos WHERE fot_imovel= '" . $Imovel['imo_id'] . "' ORDER BY fot_id ASC"));
		$foto = $Queryfoto["fot_arquivo"];
		//$gmaps->addMarkerAddress("RUA, NUMERO, CIDADE, SIGLA UF");
		//$endereco =  $numero." ".$tipologradouro." ".$logradouro.", ".$cidade;
		$endereco =  $tipologradouro." ".$logradouro.", ".$numero.", ".$cidade.", ".$estado;
		//Tipo do Imovel
		if ( $Imovel['imo_transacao'] = "0" ) {
			$tipodeimovel = "Comercial";
		}
		if ( $Imovel['imo_transacao'] = "1" ) {
			$tipodeimovel = "Residencial";
		}
		if ( $Imovel['imo_transacao'] = "2" ) {
			$tipodeimovel = "Industrial";
		}
		$artigo = '<div class="bairro"><h2><a href="imoveis.php?cod='. $Imovel["imo_id"].'">'.$bairro.'</a></h2></div><figure><img src="http://www.clovisfreitas.com.br/arqup/'.$foto.'"></figure><div class="resumo"><h3>'.$bairro.'</h3><ul><li>'.$Imovel["imo_area_util"].'m² de área de construida</li></ul><div class="clearfix"></div></div>';

		//$gmaps->addMarkerAddress( "Rua da Consolacao, 1200, Sao Paulo, SP","<h1>Boteco Allegro</h1><p><img src=http://tinyurl.com/897xozw /></p>","pizza");
		$gmaps->addMarkerAddress("$endereco","$artigo","$tipodeimovel");
	}

	/*$gmaps->addMarkerAddress( "Rua da Consolacao, 1200, Sao Paulo, SP","<h1>Boteco Allegro</h1><p><img src=http://tinyurl.com/897xozw /></p>","pizza");
	$gmaps->addMarkerAddress( "Av Paulista, 1000, Sao Paulo, SP","<h1>Hipermercado Allegro</h1>","kart");
	$gmaps->addMarkerAddress( "Av Paulista, 10, Sao Paulo, SP","<h1>Imobili?ria Allegro</h1>","imovel");
	$gmaps->addMarkerAddress( "Av Dr Arnaldo, 10, Sao Paulo, SP","<h1>Coisa Verde</h1>","green");*/

# Retorna array latitude e longitude por endereco
//print_r( $gmaps->getLatLon("Rua Ipes, 890, Suzano, SP") );

# Retorna endereco enviando CEP e num
//echo $gmaps->getAddressCep("08615060","890");

# Retornara latitude e longitude do CEP 08615060 numero 890
//print_r( $gmaps->getLatLon( $gmaps->getAddressCep("08615060","890") ) );

# Retornar todos os markers adicionados em JSon
$gmaps->getMarkers();
?>