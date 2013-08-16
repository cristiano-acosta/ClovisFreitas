<?php
// Verifica se existe dados!
if ( $_POST == ''){
	echo 'Socorrro!';
	} else {
		// Imprime o resultado
		//print_r( $_POST );// ==  Array (    [setor] =>    [nome] =>    [email] =>   [telefone] =>     [mensagem] =>    [formulario] => cadastro    [enviar] => Enviar )
		if ( $_POST['formulario'] == 'cadastro' ) {
			//echo ( $_POST['formulario'] ); == cadastro
			//$destino = "atendimento@clovisfreitas.com.br";
			$destino = "suporte@ezcomunicacao.com.br";
			$assunto = 'ENVIO DE CURRICULO PELO SITE';
			$setor = $_POST['setor'];
			$nome = $_POST['nome'];
			$email = $_POST['email'];
			$telefone = $_POST['telefone'];
			$mensagem = $_POST['mensagem'];
			$origem = $_REQUEST[''];
			$emailCadastro = '

			';
			$headers = "From: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Content-type: text/plain; charset=iso-8859-1\r\n";
			//$headers .= "Bcc: atendimento@ezcomunicacao.com.br\r\n";
			$headers .= "Reply-To: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Return-Path: $origem\r\n";
			if (mail($destino, $assunto, utf8_decode($emailCadastro), $headers)) {
				mail('atendimento@ezcomunicacao.com.br', $assunto, utf8_decode($msg), $headers);
				$erro = 'E-mail enviado com sucesso!';
			}else {
				$erro = 'Erro ao enviar e-mail!';
			}
		if ($_POST['formulario'] == 'contato'){
		 //echo ( $_POST['formulario'] ); == cadastro
			$destino = "atendimento@clovisfreitas.com.br";
			$assunto = 'SOLICITAÇÃO DE CONTATO DE CLIENTE PELO WEBSITE';
			$setor = $_POST['setor'];
			$nome = $_POST['nome'];
			$email = $_POST['email'];
			$telefone = $_POST['telefone'];
			$mensagem = $_POST['mensagem'];
			$emailContato = '

			';
			$headers = "From: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Content-type: text/plain; charset=iso-8859-1\r\n";
			//$headers .= "Bcc: atendimento@ezcomunicacao.com.br\r\n";
			$headers .= "Reply-To: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Return-Path: $origem\r\n";
			if (mail($destino, $assunto, utf8_decode($emailContato), $headers)) {
				mail('atendimento@ezcomunicacao.com.br', $assunto, utf8_decode($msg), $headers);
				$erro = 'E-mail enviado com sucesso!';
			}else {
				$erro = 'Erro ao enviar e-mail!';
			}
		}
		if ($_POST['formulario'] == 'conversao'){
		 //echo ( $_POST['formulario'] ); == cadastro
			$destino = "atendimento@clovisfreitas.com.br";
			$assunto = 'SOLICITAÇÃO DE CONTATO DE CLIENTE PELO WEBSITE';
			$setor = $_POST['setor'];
			$nome = $_POST['nome'];
			$email = $_POST['email'];
			$telefone = $_POST['telefone'];
			$mensagem = $_POST['mensagem'];
			$emailContato = '

			';
			$headers = "From: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Content-type: text/plain; charset=iso-8859-1\r\n";
			//$headers .= "Bcc: atendimento@ezcomunicacao.com.br\r\n";
			$headers .= "Reply-To: " . $_POST['nome'] . " <" . $_POST['email'] . ">\r\n";
			$headers .= "Return-Path: $origem\r\n";
			if (mail($destino, $assunto, utf8_decode($emailContato), $headers)) {
				mail('atendimento@ezcomunicacao.com.br', $assunto, utf8_decode($msg), $headers);
				$erro = 'E-mail enviado com sucesso!';
			}else {
				$erro = 'Erro ao enviar e-mail!';
			}
		}

	}
}
?>
