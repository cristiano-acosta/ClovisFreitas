

$(document).ready(function() {

	

	/*  */
	$('#slideshow').cycle({
    fx: 'scrollLeft',
	  speed:  'fast',
	  timeout: 4000,
	  next:   '#next',
	  prev:   '#prev',
		slideResize: true,
    containerResize: false,
    width: '100%',
    fit: 1
	});


  //$('form span.alert').animate({opacity:0});
  //$('#myTab a:first').tab('show');
  var hash = window.location.hash;
	// do some validation on the hash here
  hash && $('#imoveis-detalhes a[href="' + hash + '"]').tab('show');
  $('#imoveis-detalhes a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

	/*= Validar Formulários  =*/
	jQuery.validator.addMethod("phoneBR", function(phone_number, element) {
		phone_number = phone_number.replace(/\s+/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			//phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
			phone_number.match(/^\([1-9]{2}\)\d{4}\d{4}$/);
	}, "Informe DD. Ex. (xx)xxxxxxxx.");

	$('#contato').each(function(){
		$('#contato').validate({
			errorPlacement: function(label, element){
				real_label = label.clone();
				real_label.insertAfter(element);
				element.blur(function(){
					$(this).next('label.error').fadeOut(200);
				});
				element.focus(function(){
					$(this).next('label.error').fadeIn(200);
				});
				element.next('label.error').mouseover(function () {
					$(this).animate({  opacity:0, top:'100%' }, 1500).css('display','none');
				}).mouseout(function () {
						$(this).animate({ opacity:0, top:'100%' }, 1500).css('display','none');
					})
			},
			rules:{
				nome:{ required:true, minlength:2 },
				empresa:{ required:true },
				email:{ required:true, email:true },
				estado:{ required:true },
				telefone:{ required:true, phoneBR: true },
				mensagem: { required:true }
			},
			messages:{
				nome:{ required:'Preencha o campo nome.', minlength:'No mínimo 2 letras' },
				empresa:{ required:'Qual a sua empresa?'  },
				email:{ required:'Informe o seu email.', email:'Ops, informe um email válido' },
				estado:{ required:'Informe o seu estado.' },
				telefone:{ required:'Nos diga seu telefone.', phoneBR:'Informe DD. Ex. (xx)xxxxxxxx' },
				mensagem:{ required:'Envie uma mensagem.' }
			},
			submitHandler:function ( form ) {
				var dados = $( '#contact' ).serialize();
				//alert (dados);
				$.ajax({
					type:"POST",
					url:"Controllers/enviar.php",
					data:dados,
					dataType:'html',
					success:function (data) {
						//alert(data);//$('#resposta').html(data).addClass('alert-success');
						$('#validacao').html(data).addClass('alert-success').animate({opacity:1}, 1000).mouseover(function (){
							$(this).animate({ opacity:0 }, 1000);
						});
						$('#contact')[0].reset();
					}

				});

				return false;
			}
		});
		//$(this).validate();
	});
	$('#contact input[type="reset"]').click(function(){
		if ($("input.error")[0]) {
			$('#contact input, textarea').removeClass('error');
		}
	});

	$('form').each(function(){
		$('form#trabalheConosco').validate({
			rules:{
				trabalheArea:{ required:true, minlength:2 },
				trabalheNome:{ required:true, minlength:2 },
				trabalheEmail:{ required:true, email:true },
				trabalheTelefone:{ required:true, phoneBR: true },
				trabalheArquivo:{ required:true },
				trabalheMensagem: { required:true, minlength:2 }
			},
			messages:{
				trabalheArea:{ required:'Preencha qual a vaga pretendida.', minlength:'No mínimo 2 letras' },
				trabalheNome:{ required:'Preencha o seu nome.', minlength:'No mínimo 2 letras'  },
				trabalheEmail:{ required:'Informe o seu email.', email:'Ops, informe um email válido' },
				trabalheTelefone:{ required:'Nos diga seu telefone.', phoneBR:'Informe DD. Ex. (xx)xxxxxxxx'},
				trabalheArquivo:{ required:'Anexe um curriculo.' },
				trabalheMensagem:{ required:'Não deve ficar vazio.', minlength:'No mínimo 2 letras' }
			},
			submitHandler:function ( form ) {
				//var dados = $( '#orcamento' ).serialize();
				var dados2 = $( 'form#orcamento' ).serialize();
				//alert (dados);
				$.ajax({
					type:"POST",
					url:"Controllers/enviar.php",
					data:dados2,
					dataType:'html',
					success:function (data) {
						//alert(data);//$('#resposta').html(data).addClass('alert-success');
						$('#validacao2').html(data).addClass('alert-success').animate({opacity:1}, 1000).mouseover(function (){
							$(this).animate({ opacity:0 }, 1000);
						});
						$('form#orcamento')[0].reset();
					}
				});
				return false;
				console.log(dados2);
				console.log(dados);
			}
		});
		//$(this).validate();
	});


	// Efeito fancy para imagens
  $(".fancybox-thumb").fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 50,
				height	: 50
			}
		}
	});

});