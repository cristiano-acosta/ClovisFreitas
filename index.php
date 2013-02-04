<!-- GET -->
<?php
	/*== Variaveis Globais ==*/
	/* Condição ternaria se existe get page ele é get page se não é home */
	$_GET["page"] = ( isset($_GET["page"]) ? $_GET["page"]  :  'home' );

	$page = explode( '/',$_GET["page"] );

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
		  <div id="paginas" class="span10">
        <div class="row">
					<?php
	          $controller =  new Controller();
	           $controller->view( $page );
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



