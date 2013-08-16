<div id="<?php echo $page[0]; ?>-<?php echo $page[1]; ?>">
	<div id="title" class="span10">
		<h2>trabalhe- CONOSCO</h2>
	</div>
	<article id="servicos" class="span10">
			<form action="" method="post" name="trabalheConosco" id="trabalheConosco" class="row-fluid form">
			<input type="hidden" id="formID" name="formID" value="trabalhe-">
			<fieldset class="coluna1 span6">
        <p class="span6">
					<label for="trabalheArea">Área*:</label>
					<input name="trabalheArea" type="text" id="trabalheArea" />
				</p>
				<p class="mensage span6">
					<label for="trabalheNome">Nome*:</label>
					<input name="trabalheNome" type="text"  id="trabalheNome" />
				</p>

				<p class="mensage span6">
					<label for="trabalheEmail">E-mail*:</label>
					<input name="trabalheEmail" type="text"  id="trabalheEmail" />
				</p>

				<p class="mensage span6">
					<label for="trabalheTelefone">Telefone*:</label>
					<input name="trabalheTelefone" type="text"  id="trabalheTelefone" />
				</p>

				<p class="mensage span12">
					<label for="trabalheArquivo">Anexar Curriculo*:</label>
					<input name="trabalheArquivo" type="file" id="trabalheArquivo"/>
				</p>
	    </fieldset>
      <fieldset class="coluna2 span6">
	      <p class="mensage span12">
					<label for="trabalheMensagem">Mensagem:</label>
					<textarea name="trabalheMensagem" id="trabalheMensagem"></textarea>
				</p>
	      <p class="span12">
		      <label class="enviar" for="enviar">* Campos necessários.</label>
		      <input name="enviar" type="submit" class="campoForm btn btn-danger" id="enviar" value="Enviar"/>
				</p>

      </fieldset>
		</form>
	</article>
</div>
