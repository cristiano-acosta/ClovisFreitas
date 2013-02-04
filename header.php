
<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8 "> <![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9 ie8"> <![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Clovis Freitas </title>
<meta name="description" content="">
<base href="http://ezcomunicacao.servehttp.com/clovisfreitas/2013/">
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/bootstrap-responsive.min.css">
<link rel="stylesheet" href="css/jquery.fancybox.css">
<link rel="stylesheet" href="css/jquery.fancybox-thumbs.css">
<link rel="stylesheet" href="main.css">
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
<script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
</head>
<body>
<!--[if lt IE 7]><p class="chromeframe">Você está usando um navegador desatualizado. <a href="http://browsehappy.com/">Atualize seu navegador hoje</a> ou <a href="http://www.google.com/chromeframe/?redirect=true">instalar o Google Chrome Frame</a> para melhor utilizar este site.</p><![endif]-->
<header id="header">
  <nav class="header navbar navbar-fixed-top">
    <div class="container">
      <!--<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>-->
      <a class="brand" href="index.php"><img src="img/clovis.brand.png"></a>
      <div class="nav-collapse">

        <ul class="nav">
          <li class="<?php if( in_array('home', $page)  ) { echo 'active'; } ?> dropdown">
		        <a href="index.php">Home</a>
          </li>
          <li class="<?php if( in_array('institucional', $page)  ) { echo 'active'; } ?> dropdown">
            <a class="dropdown-toggle disabled"  href="institucional" >Institucional </a>
					</li>
          <li class="<?php if( in_array('vendas', $page) ) { echo 'active'; } ?> dropdown">
            <a class="dropdown-toggle disabled" href="vendas" >Vendas </a>
					</li>
          <li class="<?php if( in_array('locacoes', $page) ) { echo 'active'; } ?> dropdown">
            <a class="dropdown-toggle disabled" href="locacoes">Locações </a>
					</li>
          <li class="<?php if(  in_array('servico', $page) || in_array('cartorios', $page) ||  in_array('indices', $page) || in_array('links-uteis', $page) || in_array('trabalhe', $page) ) { echo 'active'; } ?> dropdown">
            <a href="servico" class="dropdown-toggle " data-toggle="dropdown">Serviços </a>
            <ul class="dropdown-menu">
              <li class="<?php if(in_array('cartorios', $page)  ) { echo 'active'; } ?>">
		            <a href="servico/cartorios">Cartórios e Tabelionatos</a>
              </li>
              <li class="<?php if( in_array('indices', $page)  ) { echo 'active'; } ?>" >
		            <a href="servico/indices">Índices</a>
              </li>
              <li class="<?php if( in_array('links-uteis', $page)  ) { echo 'active'; } ?>">
		            <a href="servico/links-uteis">Links Úteis</a>
              </li>
              <li class="<?php if( in_array('trabalhe', $page) ) { echo 'active'; } ?>">
		            <a href="servico/trabalhe-conosco">Trabalhe Conosco</a>
              </li>
            </ul>
          </li>
          <li class="<?php if( in_array('contato', $page)   ) { echo 'active'; } ?> dropdown">
            <a href="contato" class="dropdown-toggle disabled" data-toggle="dropdown">Contatos</a>
          </li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  <div id="shadow"><!-- Efeito curvo e sombra --></div>
  </nav>
</header>