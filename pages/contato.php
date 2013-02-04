<div id=" <?php echo $page[0]; ?> ">
	<div id="title" class="span10">
		<h1> CONTATO</h1>
	</div>
	<!-- Loop para buscar dos itens -->
	<article id="institucional" class="span9">
		<form id="contato" name="cadastro" method="post" action="" onSubmit="return validaForm()" class="row-fluid form">
			<input type="hidden" id="formID" name="formID" value="contato">
			<p class="mensage span6">
				<label for="nome">Nome:</label> <input name="nome" type="text" class="campoForm" id="nome" placeholder="Nome:"/>
			</p>

			<p class="mensage span6">
				<label for="email">Email:</label>
				<input name="email" type="text" class="campoForm" id="email" placeholder="Email:"/>
			</p>

			<p class="mensage span6">
				<label for="cidade">Cidade:</label>
				<input name="cidade" type="text" class="campoForm" id="cidade" placeholder="Cidade:"/>
			</p>

			<p class="mensage span6">
				<label for="estado">Estado:</label> <select name="estado" class="campoForm">
				<option value="AC">Acre</option>
				<option value="AL">Alagoas</option>
				<option value="AP">Amapá</option>
				<option value="AM">Amazonas</option>
				<option value="BA">Bahia</option>
				<option value="CE">Ceará</option>
				<option value="DF">Distrito Federal</option>
				<option value="ES">Espírito Santo</option>
				<option value="GO">Goiás</option>
				<option value="MA">Maranhão</option>
				<option value="MT">Mato Grosso</option>
				<option value="MS">Mato Grosso do Sul</option>
				<option value="MG">Minas Gerais</option>
				<option value="PA">Pará</option>
				<option value="PB">Paraíba</option>
				<option value="PR">Paraná</option>
				<option value="PE">Pernambuco</option>
				<option value="PI">Piauí</option>
				<option value="RJ">Rio de Janeiro</option>
				<option value="RG">Rio Grande do Norte</option>
				<option value="RS" selected="selected">Rio Grande do Sul</option>
				<option value="RO">Rondônia</option>
				<option value="RR">Roraima</option>
				<option value="SC">Santa Catarina</option>
				<option value="SP">São Paulo</option>
				<option value="SE">Sergipe</option>
				<option value="TO">Tocantins</option>
			</select>
			</p>
			<p class="mensage span6">
				<label for="email">Empresa:</label>
				<input name="empresa" type="text" class="campoForm" id="empresa" placeholder="Empresa:"/>

			</p>

			<p class="mensage span6">
				<label for="cidade">Telefone:</label>
				<input name="telefone" type="text" class="campoForm" id="telefone" placeholder="Telefone:"/>

			</p>

			<p class="mensage span12">
				<label for="mensagem">Mensagem:</label>
				<textarea name="mensagem" class="campoForm required" id="mensagem"></textarea>
			</p>

			<p class="span12">
				<input name="enviar" type="submit" class="campoForm btn btn-danger" id="enviar" value="Enviar"/>
			</p>
		</form>
	</article>
</div>
