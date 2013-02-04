<?php
/* Verifica qual é o sistema operacional do servidor para ajustar o cabeçalho de forma correta. Não alterar */
if(PHP_OS == "Linux") $quebra_linha = "\n"; //Se for Linux
elseif(PHP_OS == "WINNT") $quebra_linha = "\r\n"; // Se for Windows
else die("Este script nao esta preparado para funcionar com o sistema operacional de seu servidor");

// Clean up the input values
foreach($_POST as $key => $value) {
	if(ini_get('magic_quotes_gpc'))
		$_POST[$key] = stripslashes($_POST[$key]);
	$_POST[$key] = htmlspecialchars(strip_tags($_POST[$key]));
}
// get what form is
if ($_POST["formID"] == 'trabalhe') {
	// Assign the input values to variables for easy reference
	$area = $_POST["trabalheArea"];
	$nome = $_POST["trabalheNome"];
	$email = $_POST['trabalheEmail'];
	$telefone = $_POST["trabalheTelefone"];
	$mensagem = $_POST["trabalheMensagem"];
	//$to = "nncaixas@nncaixas.com.br";
	$to = "suporte@ezcomunicacao.com.br";
	$subject = "Contato de: $nome";
	$message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	    <html xmlns="http://www.w3.org/1999/xhtml">
	    <head>
	    <title>Clovis Freitas - Trabalhe Conosco Cadastro</title>
	    </head>
	    <body>
	    <table>
	        <tr><td>Nome</td><td>' . $nome . '</td></tr>
	        <tr><td>Email</td><td>' . $email . '</td></tr>
	        <tr><td>Área/Setor</td><td>' . $area . '</td></tr>
	        <tr><td>Telefone</td><td>' . $telefone . '</td></tr>
	        <tr><td>Mensagem</td><td>' . nl2br($mensagem) . '</td></tr>
	        <tr><td><br></td></tr>
	        <tr><td><img width="211" height="94" border="0" src="http://clovisfreitas.com.br/2013/img/clovis.brand.png"></td></tr>
	    </table>
	    </body>
	    </html>';
	/* Montando o cabeçalho da mensagem */
	$headers = "MIME-Version: 1.1".$quebra_linha;
	$headers .= "Content-type: text/html; charset=iso-8859-1".$quebra_linha;
	// Perceba que a linha acima contém "text/html", sem essa linha, a mensagem não chegará formatada.
	$headers .= "From: ".$_POST['nome']." <".$_POST['email'].">".$quebra_linha;
	$headers .= "Return-Path:  ".$_POST['email'].$quebra_linha;
	// Esses dois "if's" abaixo são porque o Postfix obriga que se um cabeçalho for especificado, deverá haver um valor.
	$headers .= "Reply-To: ".$_POST['nome']."<".$_POST['email'].">".$quebra_linha;
	// Note que o e-mail do remetente será usado no campo Reply-To (Responder Para)
		if(mail($to, $subject, utf8_decode($message), $headers ,"-r ".$_POST['email']."")){ // Se for Postfix
			die("<span class='success'>Sua mensagem foi enviada.</span>");
		}else {
			die("<span class='success'>Sua mensagem não foi enviada.</span>");
		}
	}
	if ($_POST["formID"] == 'contato') {
		// Assign the input values to variables for easy reference
		$nome = $_POST["nome"];
		$cidade = $_POST["cidade"];
		$email = $_POST["email"];
		$origem = $_POST['email'];
		$estado = $_POST["estado"];
		$telefone = $_POST["telefone"];
		$empresa = $_POST["empresa"];
		$comentario = $_POST["mensagem"];
		//$to = "nncaixas@nncaixas.com.br";
		$to = "suporte@ezcomunicacao.com.br";
		$subject = "Contato de: $nome";
		$message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	    <html xmlns="http://www.w3.org/1999/xhtml">
	    <head>
	    <title>NN Caixas</title>
	    </head>
	    <body>
	    <table>
	        <tr><td>Nome</td><td>' . $nome . '</td></tr>
	        <tr><td>Email</td><td>' . $email . '</td></tr>
	        <tr><td>Cidade</td><td>' . $cidade . '</td></tr>
	        <tr><td>Cidade</td><td>' . $estado . '</td></tr>
	        <tr><td>Telefone</td><td>' . $telefone . '</td></tr>
	        <tr><td>Empresa</td><td>' . $empresa . '</td></tr>
	        <tr><td>Mensagem</td><td>' . nl2br($comentario) . '</td></tr>
	        <tr><td><br></td></tr>
	        <tr><td><img width="211" height="94" border="0" src="http://nncaixas.com.br/img/logo.email.png"></td></tr>
	    </table>
	    </body>
	    </html>';
		/* Montando o cabeçalho da mensagem */
		$headers = "MIME-Version: 1.1".$quebra_linha;
		$headers .= "Content-type: text/html; charset=iso-8859-1".$quebra_linha;
		// Perceba que a linha acima contém "text/html", sem essa linha, a mensagem não chegará formatada.
		$headers .= "From: ".$_POST['nome']." <".$_POST['email'].">".$quebra_linha;
		$headers .= "Return-Path:  ".$_POST['email'].$quebra_linha;
		// Esses dois "if's" abaixo são porque o Postfix obriga que se um cabeçalho for especificado, deverá haver um valor.
		$headers .= "Reply-To: ".$_POST['nome']."<".$_POST['email'].">".$quebra_linha;
		// Note que o e-mail do remetente será usado no campo Reply-To (Responder Para)
		if(mail($to, $subject, utf8_decode($message), $headers ,"-r ".$_POST['email']."")){ // Se for Postfix
			die("<span class='success'>Sua mensagem foi enviada.</span>");
		}else {
			die("<span class='success'>Sua mensagem não foi enviada.</span>");
		}
	}
	if ($_POST["formID"] == 'conversao') {
		// Assign the input values to variables for easy reference
		$nome = $_POST["nome"];
		$cidade = $_POST["cidade"];
		$email = $_POST["email"];
		$origem = $_POST['email'];
		$estado = $_POST["estado"];
		$telefone = $_POST["telefone"];
		$empresa = $_POST["empresa"];
		$comentario = $_POST["mensagem"];
		//$to = "nncaixas@nncaixas.com.br";
		$to = "suporte@ezcomunicacao.com.br";
		$subject = "Contato de: $nome";
		$message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	    <html xmlns="http://www.w3.org/1999/xhtml">
	    <head>
	    <title>NN Caixas</title>
	    </head>
	    <body>
	    <table>
	        <tr><td>Nome</td><td>' . $nome . '</td></tr>
	        <tr><td>Email</td><td>' . $email . '</td></tr>
	        <tr><td>Cidade</td><td>' . $cidade . '</td></tr>
	        <tr><td>Cidade</td><td>' . $estado . '</td></tr>
	        <tr><td>Telefone</td><td>' . $telefone . '</td></tr>
	        <tr><td>Empresa</td><td>' . $empresa . '</td></tr>
	        <tr><td>Mensagem</td><td>' . nl2br($comentario) . '</td></tr>
	        <tr><td><br></td></tr>
	        <tr><td><img width="211" height="94" border="0" src="http://nncaixas.com.br/img/logo.email.png"></td></tr>
	    </table>
	    </body>
	    </html>';
		/* Montando o cabeçalho da mensagem */
		$headers = "MIME-Version: 1.1".$quebra_linha;
		$headers .= "Content-type: text/html; charset=iso-8859-1".$quebra_linha;
		// Perceba que a linha acima contém "text/html", sem essa linha, a mensagem não chegará formatada.
		$headers .= "From: ".$_POST['nome']." <".$_POST['email'].">".$quebra_linha;
		$headers .= "Return-Path:  ".$_POST['email'].$quebra_linha;
		// Esses dois "if's" abaixo são porque o Postfix obriga que se um cabeçalho for especificado, deverá haver um valor.
		$headers .= "Reply-To: ".$_POST['nome']."<".$_POST['email'].">".$quebra_linha;
		// Note que o e-mail do remetente será usado no campo Reply-To (Responder Para)
		if(mail($to, $subject, utf8_decode($message), $headers ,"-r ".$_POST['email']."")){ // Se for Postfix
			die("<span class='success'>Sua mensagem foi enviada.</span>");
		}else {
			die("<span class='success'>Sua mensagem não foi enviada.</span>");
		}
	}


?>