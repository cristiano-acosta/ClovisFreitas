<!-- GET -->
<?php
/*== Variaveis Globais ==*/
/* Condição ternaria se existe get page ele é get page se não é home */
$_GET["page"] = ( isset($_GET["page"]) ? $_GET["page"] : "home" );
$page = $_GET["page"];
echo $page;
include 'system.php';
?>
<!-- Cabeçario -->
<?php include 'header.php';?>
<!-- banners com carroseu -->
<?php include 'banners.php' ?>
<!-- Area de Busca -->
<?php include 'buscador.php' ?>
<!-- Conteudo de 2 colunas -->
<section id="conteudo">
	<div class="container">
		<div class="row">
			<div id="col-1" class="span10">
				<div class="row-fluid">
					<?php
					$cmdSQL = mysql_query("SELECT * FROM cf_imoveis WHERE imo_id = " . $_GET['cod']);
					$registros = mysql_num_rows($cmdSQL);
					//echo $registros; exit;
					for ($number = 1; $number <= $registros; $number++) {
						$rs = mysql_fetch_array($cmdSQL);
						$ids[$number] = $rs["imo_id"];
						$bairros[$number] = $rs["imo_bairro"];
						$tipos[$number] = $rs["imo_tipo"];
						#Mapa
						$endereco[$number] = $rs["imo_endereco"];
						$cidade[$number] = $rs["imo_cidade"];
						$valore[$number] = "R$ " . number_format($rs["imo_valore"], 2, ',', '.');
						#Cidade
						$cmdSQLCidade = mysql_query("SELECT * FROM cf_cidade WHERE cid_id = " . $rs["imo_cidade"]);
						$rsCidade = mysql_fetch_array($cmdSQLCidade);
						$cidade[$number] = $rsCidade["cidade"];
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
						<article id="imoveis" class="span12">
							<div class="bg row-fluid">
								<h1 class="span12"><?php echo $tipo[$number]; ?></h1>
								<figure class="span5">
									<img src="arqup/<?php echo $foto[$number]; ?>">
								</figure>
								<div id="resumo" class="span7">
									<h2><?php echo $bairro[$number];?></h2>
									<ul>
										<li>
											<a href="#"><?php echo $rs["imo_qtd_doca"];?> Quartos - <?php echo $rs["imo_suite"];?>   suíte</a>
										</li>
										<li>
											<a href="#"><?php echo $rs["imo_qtd_garagem"];?> vagas garagem</a>
										</li>
										<li>
											<a href="#"><?php echo $rs["imo_area_util"];?>m² de área de construida</a>
										</li>
									</ul>
									<p><?php // echo preg_replace('/<\/?[a-zA-Z0-9=\s\"\._]+>/', '', $rs["imo_descricao"]); ?></p>
									<p><?php echo $rs["imo_descricao"]; ?></p>
								</div>
								<nav id="menu-detalhes" class="span12">
									<ul class="nav nav-tabs" id="imoveis-detalhes">
										<li class="active"><a href="#fotos"><i class="icon-picture icon-white"></i> Fotos do Imóvel</a></li>
										<li><a href="#localizacao"><i class="icon-map-marker icon-white"></i> Localização</a></li>
										<!--<li><a href="#videos"><i class=" icon-facetime-video icon-white"></i> Vídeos</a></li>-->
										<li><a href="#tab-conversao"><i class="icon-comment icon-white"></i> Contate o Corretor</a></li>
									</ul>
								</nav>
								<div id="detalhes" class="tab-content span12">
									<div class="tab-pane active" id="fotos">
										<?php
										#Fotos
										$SQLfoto = mysql_query("SELECT * FROM cf_fotos WHERE fot_imovel= '" . $rs["imo_id"] . "' ORDER BY fot_id ASC");
										$numFotos = mysql_num_rows($SQLfoto);
										while ($rsFotos = mysql_fetch_array($SQLfoto)) {
											//$foto = $rsFotos["fot_arquivo"];
											/*$imgbg = "img.php?arquivo=arqup/".$rsFotos["fot_arquivo"]."?>&largura=150&altura=150;"*/
											/*<img src="img.php?arquivo=arqup/<?php echo $rsFotos["fot_arquivo"];
											?>&largura=150&altura=150"*/
											?>
											<a class="fancybox-thumb" rel="fancybox-thumb" href="arqup/<?php echo $rsFotos["fot_arquivo"]; ?>" title="<?php echo $rsFotos["fot_nome"]; ?>" style='background-image:url(arqup/<?php echo $rsFotos["fot_arquivo"]; ?>);'>
											<img style="display: none" src="Controllers/img.php?arquivo=arqup/<?php echo $rsFotos["fot_arquivo"];?>&largura=150&altura=150">
											</a>
											<?php }?>
									</div>
									<div class="tab-pane" id="localizacao">
										<?php
											$mapa = urlencode($endereco[$number] . ',' . $bairro[$number] . ',' . $cidade[$number]);
											print_r($mapa);
										?>
										<iframe width="100%" height="300" frameborder="0" scrolling="No" marginheight="0" marginwidth="0" src="http://maps.google.com.br/maps?f=q&amp;source=s_q&amp;hl=pt-BR&amp;geocode=&amp;q=<?php echo $mapa; ?>+Brasil&amp;ie=UTF8&amp;output=embed"></iframe>
									</div>
									<!--<div class="tab-pane" id="videos"></div>-->
									<div class="tab-pane" id="tab-conversao">
										<form id="conversao" action="" method="post" class="row-fluid">
											<input type="hidden" id="formID" name="formID" value="conversao">
											<fieldset class="coluna-1 span4">
												<p class="">
													<label > Como deseja ser contatado no 1&ordm; atendimento?</label>
													<small><input name="conversao-portelefone" type="radio" value="conversao-portelefone" />Por Telefone</small>
													<small><input name="conversao-porcelular" type="radio" value="conversao-porcelular" />Por Celular</small>
												</p>
												<p class="">
													<label for="horario" class="span6"> Qual o hor&aacute;rio de sua prefer&ecirc;ncia?</label>
													<select name="horario" id="horario">
														<option>Manh&atilde; - Primeira hora</option>
														<option>Manh&atilde; - Ap&oacute;s 10h</option>
														<option>Tarde - Primeira hora</option>
														<option>Tarde - Ap&oacute;s 15h</option>
														<option>Noite - A partir das 18h</option>
													</select>
												</p>
											</fieldset>
											<fieldset class="coluna-2 span4">
												<p class="">
													<label for="nome">Nome:</label>
													<input name="nome" type="text" id="nome" />
												</p>
												<p class="">
													<label for="email">E-mail:</label>
													<input name="email" type="text" id="email" />
												</p>
												<p class="">
													<label for="telefone">Telefone:</label>
													<input name="telefone" type="text" id="telefone" />
												</p>
												<p class="">
													<label for="celular">Celular:</label>
													<input name="celular" type="text" id="celular" />
												</p>
											</fieldset>
											<fieldset class="coluna-3 span4">
												<p  class="">
													<label for="msg">Mensagem:</label>
													<textarea name="msg" id="msg"></textarea>
												</p>
												<p>
													<label class="enviar" for="enviar">* Campos necessários.</label>
													<input class="span12" name="codigo" type="hidden" id="codigo" value="<?php echo $rs["imo_id"];	?>" />
													<input type="hidden" name="formulario" value="conversao" >
													<input class="btn btn-inverse" type="submit" name="Enviar" id="Enviar" value="  Enviar  " />
												</p>
											</fieldset>
										</form>
									</div>
								</div>
								<div class="clearfix"></div>
							</div>
							<div class="shadow-bottom"></div>
						</article>
						<?php } ?>
				</div>
			</div>
			<div id="col-2" class="span2">
				<?php include'sidebar.php' ?>
			</div>
		</div>
	</div>
</section>
<!-- Conteudo de 2 colunas -->
<?php include 'footer.php' ?>

