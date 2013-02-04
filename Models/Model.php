<?php



	class Model {
		/*== usando dentro e quando é extendida ==*/
		protected $db;
		/*== Padrão para gerar menos repetição, DATEDATA GRiD sugere trabalhar model por tabela!  ==*/
		//public $_tabela;
		/*== para instanciar minha classe e fazer um construtor ==*/
		public function __construct() {
			//$this->db = new PDO('mysql:host=$host;dbname=$nomebancodedados','$usuario','$senha');
			$this->db = new PDO('mysql:host=localhost;dbname=clovisfreitas', 'root', '');
		}
		/*== CRUD ==*/
		/*== CREATE  ==*/
		public function insert( $tabela, Array $dados ) {
			//$sql = "INSERT INTO $nomedatabela ('$campos') VALUES ('$valor1')";
			$campos = implode(", ", array_keys($dados));
			/*== contatenação dos valores saparando por virulas e aspas simples, necessario concatenar aspas simples antes para não dar erro aonde fique $campo','$campo ==*/
			$valores = "'" . implode("','", array_values($campos)) . "'";
			/*== trabalhando com PDO ==*/
			$q = $this->db->query("INSERT INTO ".$tabela." ($campos) VALUES ($valores)");
		}
		/*== READ  ==*/
		public function read( $tabela, $where = null, $order  = null, $limit = null  ) {
			//$sql = "SELECT * FROM tabela where id = 1";
			// se o user digitar acrescenta se não fica vazio!
			$where = ($where != null ? "WHERE ".$where : "");

			$order = ($order != null ? "ORDER BY ".$order : "");

			$limit = ($limit != null ? "LIMIT ".$limit : "");

			$q = $this->db->query("SELECT * ".$tabela." ".$where." ".$order." ".$limit);
			print_r($q = $this->db->query("SELECT * ".$tabela." ".$where." ".$order." ".$limit));
			/*== PARA ACOCIAR OS VALOERES E NÃO RETORNAR O NUMERO QUE RETORNA A COLUNA ==*/
			//$q->setFetchMode(PDO::FETCH_ASSOC);
			//return $q->fetchAll();
			return $q;
		}
		/*== select  ==*/
		public function select(  $query ) {
			//$sql = "SELECT * FROM tabela where id = 1";

			$q = $this->db->query($query);
			/*== PARA ACOCIAR OS VALOERES E NÃO RETORNAR O NUMERO QUE RETORNA A COLUNA ==*/
			//$q->setFetchMode(PDO::FETCH_ASSOC);
			//return $q->fetchAll();
			return $q;
		}


		/*== UPDATE  ==*/
		public function update($tabela, Array $dados) {
			// $sql = " UPDATE {$this->_tabela} SET $indice = '$valores' $valor WHERE $where ";
			foreach ($dados as $ind => $val) {
				$campos = "{$ind} = '{$val}'";
			}
			//separa para mim por virgulas os retornos
			$campos = implode(', ', $campos);
			$this->db->query("UPDATE ".$tabela." SET (".$campos.")");
		}



	}
?>