<!-- Rodape -->
<footer id="footer">
	<nav class="footer">
    <div class="container">
		  <ul>
				  <li class="<?php if( in_array('home', $page) ) { echo 'active'; } ?>">
						  <a href="index.php">HOME</a>
				  </li>
					<li  class="<?php if( in_array('institucional', $page) ) { echo 'active'; } ?>">
							<a href="institucional">INSTITUCIONAL</a>
					</li>
					<li class="<?php if( in_array('vendas', $page)  ) { echo 'active'; } ?>">
							<a href="vendas">VENDAS</a>
					</li>
					<li class="<?php if( in_array('locacoes', $page) ) { echo 'active'; } ?>">
							<a href="locacoes">LOCAÇÕES</a>
					</li>
					<li class="<?php if( in_array('servico', $page) || in_array('cartorios', $page) ||  in_array('indices', $page) || in_array('links-uteis', $page) || in_array('trabalhe', $page) ) { echo 'active'; } ?>">
							<a href="servico">SERVIÇOS</a>
					</li>
					<li class="<?php if( in_array('contato', $page) ) { echo 'active'; } ?>">
							<a href="contato">CONTATOS</a>
					</li>
		  </ul>
    </div>
	</nav>
	<div id="site-map">
		<div class="container">
			<div class="row">
				<div class="span2">
					<a href="#">HOME</a>
						<ul>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum</a></li>
						</ul>
					<a href="#">INSTITUCIONAL</a>
						<ul>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
							<li><a href="#">Lorem ipsum </a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
					</ul>
				</div>
				<div class="span2">
					<a href="#">LOCAÇÕES</a>
						<ul>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
						</ul>
						<a href="#">VENDAS</a>
						<ul>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
						</ul>
				</div>
				<div class="span2">
					<a href="#">SERVIÇOS</a>
						<ul>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
							<li><a href="#">Lorem ipsum</a></li>
							<li><a href="#">Lorem ipsum dolor</a></li>
						</ul>
				</div>
				<div class="span3">
					<a href="#">CONTATOS</a>
						<ul>
							<li><a href="#">Corretor OnLine</a></li>
							<li><a href="mailto:faleconosco@clovisfreitas.com.br">faleconosco@clovisfreitas.com.br</a></li>
							<li><a href="#">Tel.: 51 3344.0488</a></li>
							<li><a href="#">FAX: 51 3344.8888</a></li>
						</ul>
				</div>
				<div class="span3">
					<a href="#" class="brand"><img src="img/clovis.brand.footer.png" ></a>
					<address>
						Av. Dr. João Simplício de Carvalho, 132
						Vila Ipiranga - Porto Alegre - R.S.
						CEP 91.360-260
					</address>
				</div>

			</div>
		</div>
	</div>
	<div id="copyright">

	</div>
</footer>
<script src="js/vendor/jquery-1.8.3.min.js"></script>
<script src="js/vendor/bootstrap.min.js"></script>
<script src="js/plugins.js"></script>
<!-- Integracao com a API de MApas Cass php de http://clares.com.br/google-maps-gmaps-php-jquery-adicionando-marcadores-customizados/ -->
<script src="js/jquery.gmap.min.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="js/gmap.load.js"></script>
<!-- Integracao com a API de MApas Cass php de http://clares.com.br/google-maps-gmaps-php-jquery-adicionando-marcadores-customizados/ -->
<script src="js/main.js"></script>
<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
  (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
  s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

</body>
</html>