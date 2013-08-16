<?php
	class Controller {
		/*== função/action principal, sempre index ==*/
		public function view($page) {
			/*== se array estiver vazio ==*/
			if ( empty($page) ){
				/*= retorna a pagina home =*/
				return  include 'pages/home.php';
			}
			/*== se array não estiver vazio ==*/
			if ( ! empty($page) ) {
				/*= se $page[0] estiver vazio =*/
				if ( empty($page[0]) ) {
					/*= retorna a pagina home =*/
					return  include 'pages/home.php';
				}
				/*= se $page[0] não estiver vazio e $page[1] estiver vazio=*/
				if ( !empty($page[0]) and empty($page[1]) ) {
					/*= retorna a pagina $page[0] =*/
					return  include 'pages/'.$page[0].'.php';
				}
				/*= se $page[0] não estiver vazio e $page[1] nao estiver vazio=*/
				if ( !empty($page[0]) and !empty($page[1]) ) {
					/*= retorna a pagina $page[0] e sua subpagina $page[1]=*/
					return  include 'pages/'.$page[0].'-'.$page[1].'.php';
				}

			}

		}
	}

?>