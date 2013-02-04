<div id=" <?php echo $page[1]; ?> ">
  <div id="title" class="span10">
    <h1> VENDAS</h1>
  </div>
  <!-- Loop para buscar dos itens
  <article id="institucional" class="span9">
    <p>A Clovis Freitas Negócios Imobiliários atua na intermediação de compra, venda ou permuta imobiliária. Possui uma equipe de profissionais qualificados, com atendimento personalizado na busca de alternativas de investimento no ramo imobiliário.</p>
    <p>A Clovis Freitas Negócios Imobiliários atua de forma transparente e com atendimento personalizado, primando pela dedicação de seus colaboradores e satisfação de seus clientes.</p>
    <img src="assets/vendas.png"> </article> -->
	<?php
	$cmdSQL = mysql_query("SELECT * FROM cf_imoveis WHERE imo_destaque= '1' AND imo_website = '1' AND imo_transacao = '1'  ORDER BY RAND() LIMIT 6");
	$registros = mysql_num_rows($cmdSQL);
	//echo $registros; exit;
	for ($number = 1; $number <= $registros; $number++) {
		$rs = mysql_fetch_array($cmdSQL);
		$ids[$number] = $rs["imo_id"];
		$bairros[$number] = $rs["imo_bairro"];
		$tipos[$number] = $rs["imo_tipo"];
		$valore[$number] = "R$ " . number_format((double)$rs["imo_valore"], 2, ',', '.');
		#Foto
		$cmdSQLfoto = mysql_query("SELECT * FROM cf_fotos WHERE fot_imovel= '" . $ids[$number] . "' ORDER BY fot_id ASC");
		$rsFoto = mysql_fetch_array($cmdSQLfoto);
		$foto[$number] = $rsFoto["fot_arquivo"];
		#Bairro
		$cmdSQLbairro = mysql_query("SELECT * FROM cf_bairros WHERE bai_id = '" . $bairros[$number] . "'");
		$rsBairro = mysql_fetch_array($cmdSQLbairro);
		$bairro[$number] = $rsBairro["bai_nome"];
		#Tipo de imóvel
		$cmdSQLtipo = mysql_query("SELECT * FROM cf_busca_tipo WHERE busti_id= '" . $tipos[$number] . "'");
		$rsTipo = mysql_fetch_array($cmdSQLtipo);
		$tipo[$number] = utf8_encode($rsTipo["busti_nome"]);
		?>
		<!-- Loop para buscar dos itens -->
		<article id="destaques" class="span3">
			<div class="bairro">
				<h2><a href="imoveis.php?cod=<?php echo $ids[$number]; ?>"><?php echo $tipo[$number];?></a></h2>
			</div>
			<figure><img src="http://www.clovisfreitas.com.br/arqup/<?php echo $foto[$number]; ?>"></figure>
			<div class="resumo">
				<h3><?php echo $bairro[$number];?></h3>
				<ul>
					<li><a href="#"><?php echo $rs["imo_qtd_doca"];?> Quartos - <?php echo $rs["imo_suite"];?> suíte</a></li>
					<li><a href="#"><?php echo $rs["imo_qtd_garagem"];?> vagas garagem</a></li>
					<li><a href="#"><?php echo $rs["imo_area_util"];?>m² de área de construida</a></li>
				</ul>
				<div class="clearfix"></div>
			</div>
		</article>
		<?php } ?>
</div>
