<!-- Locação  -->
<div id="<?php echo $page[0]; ?>">
	<div id="title" class="span10">
		<h1>LOCAÇÃO</h1>
	</div>
	<!-- Loop para buscar dos itens -->
	<!-- <article id="locacoes" class="span9">
		<p>Para garantir transparência e segurança a proprietários e inquilinos na intermediação da locação, a Clovis Freitas Negócios Imobiliários concede a seus clientes atendimento personalizado feito por profissionais qualificados. Além disso, oferece o serviço de análise e acompanhamento documental, minimizando os riscos inerentes a este processo.</p>
		<p>A Clovis Freitas Negócios Imobiliários atua de forma transparente e com atendimento personalizado, primando pela dedicação de seus colaboradores e satisfação de seus clientes.</p>
		<p><a href="#inquilinato" id="sobre-inquilinato">Saiba mais sobre as garantias de locações</a></p>
	</article>
</div>

<div id="inquilinato">
	<div id="title" class="span10">
		<h1>LEI DO INQUILINATO</h1>
	</div>
	Loop para buscar dos itens
	<article id="locacoes" class="span10">
		<h2>As garantias previstas na lei do inquilinato são:</h2>

		<h3>1 - Fiador</h3>

		<p>É aquele que se responsabiliza pelo pagamento ou obrigação de outra pessoa, no caso de seu descumprimento. Para tanto, é necessária a apresentação de um fiador que possua dois imóveis (retirar vírgula) ou de dois fiadores, cada um com um imóvel. Os imóveis devem estar quitados, livres de ônus e registrados em nome do pretendente a fiador, não podendo haver usufruto.</p>

		<h3>2 - Título de capitalização</h3>

		<p>Consiste na compra de um título de capitalização equivalente a 12 vezes o valor do aluguel mais as taxas do imóvel a ser locado, valor este que deve ser pago a vista e é válido pelo tempo que durar a locação. O título será resgatado pelo locatário ao final da locação, devidamente corrigido, após a entrega das chaves do imóvel (quando não houver débitos).</p>

		<h3>3 - Caução de bem imóvel</h3>

		<p>O candidato a inquilino poderá dar um imóvel seu em garantia, desde que isto seja feito de forma pública (por instrumento público lavrado em tabelionato). A caução de bens imóveis tem que ser registrada à margem da matrícula do bem, no registro de imóveis. O bem deve estar registrado em nome de quem está prestando a caução e as despesas com escritura e registro da caução correm por conta do locatário.</p>

		<h3>4 - Seguro fiança locatícia</h3>

		<p>O seguro tem a finalidade de garantir ao locador a restituição de eventual prejuízo que venha a sofrer, em decorrência do inadimplemento do contrato pelo locatário. O contrato de seguro é celebrado por um ano, mediante pagamento de um prêmio que fica sobre a responsabilidade do locatário, podendo ser sucessivamente renovado, enquanto durar a locação. O locador segurado não pode alterar o contrato sem a autorização da seguradora.</p>

		<p>Observação: A lei do inquilinato proíbe dois tipos de garantias para o mesmo contrato de locação.</p>
	</article>  -->
	<?php
	$cmdSQL = mysql_query("SELECT * FROM cf_imoveis WHERE imo_destaque= '1' AND imo_website = '1' AND imo_transacao = '2'  ORDER BY RAND() LIMIT 6");
	$registros = mysql_num_rows($cmdSQL);
	//echo $registros; exit;
	for ($number = 1; $number <= $registros; $number++) {
		$rs = mysql_fetch_array($cmdSQL);
		$ids[$number] = $rs["imo_id"];
		$bairros[$number] = $rs["imo_bairro"];
		$tipos[$number] = $rs["imo_tipo"];
		$valore[$number] = "R$ " . number_format($rs["imo_valore"], 2, ',', '.');
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
