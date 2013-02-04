<div id="<?php echo $page[0]; ?>-<?php echo $page[1]; ?>">
	<div id="title" class="span10">
		<h2>LINKS ÚTEIS</h2>
	</div>
	<article id="servicos" class="span10">
		<ul class="row-fluid">
			<?php
			$corSQL = mysql_query("SELECT * FROM cf_sites ORDER BY site_nome ASC");
			while ($corr = mysql_fetch_array($corSQL)) {
				$site_nome = $corr["site_nome"];
				$site_texto = $corr["site_texto"];
				$site_foto = $corr["site_foto"];
				$site_link = $corr["site_link"];
				?>
				<li class="span5">
					<a href="<?php echo $site_link; ?>" target="_blank">
						<img src="<?php if ($site_foto !== "0e88d986d08f4783af77bac08b0e9f83.jpg") {
							echo 'http://www.clovisfreitas.com.br/arqup/' . $site_foto;
						} else { /* echo 'assets/'.$site_foto;*/
							echo 'http://hagahguialocal.com.br/icon/hgh-logo.png';
						} ?>">

						<h2><?php echo $site_nome; ?></h2>

						<p><?php echo $site_texto; ?></p>
					</a>
				</li>
				<?php
			}
			?>
		</ul>
	</article>
</div>
