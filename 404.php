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
			<div id="paginas" class="span10">
				<div class="row">

					<?php
					if ($page == 'home') {
						include 'pages/home.php';
					}
					if ($page == 'mapa') {
						include 'pages/mapa.php';
					}
					if ($page == 'institucional'  ){
						include 'pages/institucional.php';
					}
					if ($page == 'locacoes'  ){
						include 'pages/locacoes.php';
					}
					if ($page == 'vendas'  ){
						include 'pages/vendas.php';
					}
					if ($page == 'contato'  ){
						include 'pages/contato.php';
					}
					if ($page == 'servico'  ){
						include 'pages/servico.php';
					}
					if (page == 'servico' || $subpage == 'servico-cartorios' ){
						include 'pages/servico-cartorios.php';
					}
					if (page == 'servico' || $subpage == 'servico-links-uteis' ){
						include 'pages/servico-links-uteis.php';
					}
					if (page == 'servico' || $subpage == 'servico-trabalhe' ){
						include 'pages/servico-trabalhe.php';
					}
					?>
				</div>
			</div>
			<div id="laterais" class="span2">
				<?php include'sidebar.php' ?>
			</div>
		</div>
	</div>
</section>
<!-- Conteudo de 2 colunas -->
<?php include 'footer.php' ?>



