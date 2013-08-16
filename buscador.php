<section id="search">
  <div class="container">
    <div class="row">
      <div id="buscador" class="span12">
        <div class="shadow-top"></div>
        <div class="border row-fluid">
          <div class="lupa space span1" >
            <img src="img/ico.search.png">
          </div>
          <div id="" class="span11">
            <div id="forms"  class="row-fluid">
              <h4 class="span3">Busque seu imóvel</h4>
              <ul class=" span6 nav-tabs">
                  <li class="active"><a href="#Comercial" data-toggle="tab">Comercial</a></li>
                  <li><a href="#Industrial" data-toggle="tab">Industrial</a></li>
                  <li><a href="#Residencial" data-toggle="tab">Residencial</a></li>
              </ul>
              <ul class=" nav-tabs span3">
                  <li><a href="#Vendas" >Venda</a></li>
                  <li><a href="#Alugel" >Alugel</a></li>
              </ul>
              <?php
                /*= Consultas  =*/
                
              ?>
              <div class="clearfix"></div>
                <div id="form" class="tab-content">
                  <form class="tab-pane active" id="Comercial">
                    <fieldset class="span2">
                      <label for="select_tipo">Tipo </label>
                      <select id="select_tipo" class="textfield_busca2" name="select_tipo">
                        <option value="nn">Selecione</option>
                        <option value="nn">Indiferente</option>
                        <?php
                        
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_bairro">Região/Bairro </label>
                      <select id="select_bairro" class="textfield_busca2" name="select_bairro">
                        <option value="0">Escolha o Bairro</option>
                        <?php
                        while ($bai = mysql_fetch_array($baiSQL)){
                          $bai_id = $bai["bai_id"];
                          $bai_nome = $bai["bai_nome"];
                          if($bai_id == $b_bairro){
                            echo "<option selected=\"selected\" value=\"$bai_id\">$bai_nome</option>";
                          }  else{
                            echo "<option value=\"$bai_id\">$bai_nome</option>";
                          }
                        }
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_suite">Suites </label>
                      <select name="select_suite" class="textfield_busca2" id="select_suite">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_suite == 1){echo "selected=\"selected\"";}?> value="1">1 suite</option>
                        <option <?php if($b_suite == 2){echo "selected=\"selected\"";}?> value="2">2 suites</option>
                        <option <?php if($b_suite == 3){echo "selected=\"selected\"";}?> value="3">3 suites</option>
                        <option <?php if($b_suite == 4){echo "selected=\"selected\"";}?> value="4">4 suites</option>
                        <option <?php if($b_suite == 5){echo "selected=\"selected\"";}?> value="5">5 suites</option>
                        <option <?php if($b_suite == 6){echo "selected=\"selected\"";}?> value="6">Mais de 5 suites</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_garagem">Garagem </label>
                      <select name="select_garagem" class="textfield_busca2" id="select_garagem">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_garagem == 2){echo "selected=\"selected\"";}?> value="2">Não</option>
                        <option <?php if($b_garagem == 1){echo "selected=\"selected\"";}?> value="1">Sim</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_valor">Preço </label>
                      <select id="select_valor" class="textfield_busca2" name="select_valor">
                        <option value="357">Indiferente</option>
                        <option <?php if($b_valor == 1){echo "selected=\"selected\"";}?> value="1">At&eacute; 300</option>
                        <option <?php if($b_valor == 2){echo "selected=\"selected\"";}?> value="2">De 301 at&eacute; 700</option>
                        <option <?php if($b_valor == 3){echo "selected=\"selected\"";}?> value="3">De 701 at&eacute; 1.000</option>
                        <option <?php if($b_valor == 4){echo "selected=\"selected\"";}?> value="4">De 1.001 at&eacute; 2.000</option>
                        <option <?php if($b_valor == 5){echo "selected=\"selected\"";}?> value="5">De 2.001 at&eacute; 5.000</option>
                        <option <?php if($b_valor == 6){echo "selected=\"selected\"";}?> value="6">De 5.001 at&eacute; 10.000</option>
                        <option <?php if($b_valor == 7){echo "selected=\"selected\"";}?> value="7">De 10.001 at&eacute; 50.000</option>
                        <option <?php if($b_valor == 8){echo "selected=\"selected\"";}?> value="8">De 50.001 at&eacute; 100.000</option>
                        <option <?php if($b_valor == 9){echo "selected=\"selected\"";}?> value="9">De 100.001 at&eacute; 200.000</option>
                        <option <?php if($b_valor == 10){echo "selected=\"selected\"";}?> value="10">De 200.001 at&eacute; 500.000</option>
                        <option <?php if($b_valor == 11){echo "selected=\"selected\"";}?> value="11">Acima de 500.000</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label>&nbsp;<!-- margin-top? --></label>
                      <button type="submit"></button>
                    </fieldset>
                  </form>
                  <form class="tab-pane" id="Industrial">
                    <fieldset class="span2">
                      <label for="select_tipo">Tipo </label>
                      <select id="select_tipo" class="textfield_busca2" name="select_tipo">
                        <option value="nn">Selecione</option>
                        <option value="nn">Indiferente</option>
                        <?php
                        $tipSQL = mysql_query("SELECT * FROM cf_busca_tipo ORDER BY busti_nome ASC");
                        while ($tip = mysql_fetch_array($tipSQL)){
                          $busti_id = $tip["busti_id"];
                          $busti_nome = utf8_encode($tip["busti_nome"]);
                          if($busti_id == $b_tipo){
                            echo "<option selected=\"selected\" value=\"$busti_id\">$busti_nome</option>";
                          }	else{
                            echo "<option value=\"$busti_id\">$busti_nome</option>";
                          }
                        }
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_bairro">Região/Bairro </label>
                      <select id="select_bairro" class="textfield_busca2" name="select_bairro">
                        <option value="0">Escolha o Bairro</option>
                        <?php
                        $baiSQL = mysql_query("SELECT * FROM cf_bairros ORDER BY bai_nome ASC");
                        while ($bai = mysql_fetch_array($baiSQL)){
                          $bai_id = $bai["bai_id"];
                          $bai_nome = $bai["bai_nome"];
                          if($bai_id == $b_bairro){
                            echo "<option selected=\"selected\" value=\"$bai_id\">$bai_nome</option>";
                          }  else{
                            echo "<option value=\"$bai_id\">$bai_nome</option>";
                          }
                        }
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_suite">Suites </label>
                      <select name="select_suite" class="textfield_busca2" id="select_suite">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_suite == 1){echo "selected=\"selected\"";}?> value="1">1 suite</option>
                        <option <?php if($b_suite == 2){echo "selected=\"selected\"";}?> value="2">2 suites</option>
                        <option <?php if($b_suite == 3){echo "selected=\"selected\"";}?> value="3">3 suites</option>
                        <option <?php if($b_suite == 4){echo "selected=\"selected\"";}?> value="4">4 suites</option>
                        <option <?php if($b_suite == 5){echo "selected=\"selected\"";}?> value="5">5 suites</option>
                        <option <?php if($b_suite == 6){echo "selected=\"selected\"";}?> value="6">Mais de 5 suites</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_garagem">Garagem </label>
                      <select name="select_garagem" class="textfield_busca2" id="select_garagem">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_garagem == 2){echo "selected=\"selected\"";}?> value="2">Não</option>
                        <option <?php if($b_garagem == 1){echo "selected=\"selected\"";}?> value="1">Sim</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_valor">Preço </label>
                      <select id="select_valor" class="textfield_busca2" name="select_valor">
                        <option value="357">Indiferente</option>
                        <option <?php if($b_valor == 1){echo "selected=\"selected\"";}?> value="1">At&eacute; 300</option>
                        <option <?php if($b_valor == 2){echo "selected=\"selected\"";}?> value="2">De 301 at&eacute; 700</option>
                        <option <?php if($b_valor == 3){echo "selected=\"selected\"";}?> value="3">De 701 at&eacute; 1.000</option>
                        <option <?php if($b_valor == 4){echo "selected=\"selected\"";}?> value="4">De 1.001 at&eacute; 2.000</option>
                        <option <?php if($b_valor == 5){echo "selected=\"selected\"";}?> value="5">De 2.001 at&eacute; 5.000</option>
                        <option <?php if($b_valor == 6){echo "selected=\"selected\"";}?> value="6">De 5.001 at&eacute; 10.000</option>
                        <option <?php if($b_valor == 7){echo "selected=\"selected\"";}?> value="7">De 10.001 at&eacute; 50.000</option>
                        <option <?php if($b_valor == 8){echo "selected=\"selected\"";}?> value="8">De 50.001 at&eacute; 100.000</option>
                        <option <?php if($b_valor == 9){echo "selected=\"selected\"";}?> value="9">De 100.001 at&eacute; 200.000</option>
                        <option <?php if($b_valor == 10){echo "selected=\"selected\"";}?> value="10">De 200.001 at&eacute; 500.000</option>
                        <option <?php if($b_valor == 11){echo "selected=\"selected\"";}?> value="11">Acima de 500.000</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label>&nbsp;<!-- margin-top? --></label>
                      <button type="submit"></button>
                    </fieldset>
                  </form>
                  <form class="tab-pane" id="Residencial">
                    <fieldset class="span2">
                      <label for="select_tipo">Tipo </label>
                      <select id="select_tipo" class="textfield_busca2" name="select_tipo">
                        <option value="nn">Selecione</option>
                        <option value="nn">Indiferente</option>
                        <?php
                        $tipSQL = mysql_query("SELECT * FROM cf_busca_tipo ORDER BY busti_nome ASC");
                        while ($tip = mysql_fetch_array($tipSQL)){
                          $busti_id = $tip["busti_id"];
                          $busti_nome = utf8_encode($tip["busti_nome"]);
                          if($busti_id == $b_tipo){
                            echo "<option selected=\"selected\" value=\"$busti_id\">$busti_nome</option>";
                          }	else{
                            echo "<option value=\"$busti_id\">$busti_nome</option>";
                          }
                        }
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_bairro">Região/Bairro </label>
                      <select id="select_bairro" class="textfield_busca2" name="select_bairro">
                        <option value="0">Escolha o Bairro</option>
                        <?php
                        $baiSQL = mysql_query("SELECT * FROM cf_bairros ORDER BY bai_nome ASC");
                        while ($bai = mysql_fetch_array($baiSQL)){
                          $bai_id = $bai["bai_id"];
                          $bai_nome = $bai["bai_nome"];
                          if($bai_id == $b_bairro){
                            echo "<option selected=\"selected\" value=\"$bai_id\">$bai_nome</option>";
                          }  else{
                            echo "<option value=\"$bai_id\">$bai_nome</option>";
                          }
                        }
                        ?>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_suite">Suites </label>
                      <select name="select_suite" class="textfield_busca2" id="select_suite">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_suite == 1){echo "selected=\"selected\"";}?> value="1">1 suite</option>
                        <option <?php if($b_suite == 2){echo "selected=\"selected\"";}?> value="2">2 suites</option>
                        <option <?php if($b_suite == 3){echo "selected=\"selected\"";}?> value="3">3 suites</option>
                        <option <?php if($b_suite == 4){echo "selected=\"selected\"";}?> value="4">4 suites</option>
                        <option <?php if($b_suite == 5){echo "selected=\"selected\"";}?> value="5">5 suites</option>
                        <option <?php if($b_suite == 6){echo "selected=\"selected\"";}?> value="6">Mais de 5 suites</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_garagem">Garagem </label>
                      <select name="select_garagem" class="textfield_busca2" id="select_garagem">
                        <option value="nn">Indiferente</option>
                        <option <?php if($b_garagem == 2){echo "selected=\"selected\"";}?> value="2">Não</option>
                        <option <?php if($b_garagem == 1){echo "selected=\"selected\"";}?> value="1">Sim</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label for="select_valor">Preço </label>
                      <select id="select_valor" class="textfield_busca2" name="select_valor">
                        <option value="357">Indiferente</option>
                        <option <?php if($b_valor == 1){echo "selected=\"selected\"";}?> value="1">At&eacute; 300</option>
                        <option <?php if($b_valor == 2){echo "selected=\"selected\"";}?> value="2">De 301 at&eacute; 700</option>
                        <option <?php if($b_valor == 3){echo "selected=\"selected\"";}?> value="3">De 701 at&eacute; 1.000</option>
                        <option <?php if($b_valor == 4){echo "selected=\"selected\"";}?> value="4">De 1.001 at&eacute; 2.000</option>
                        <option <?php if($b_valor == 5){echo "selected=\"selected\"";}?> value="5">De 2.001 at&eacute; 5.000</option>
                        <option <?php if($b_valor == 6){echo "selected=\"selected\"";}?> value="6">De 5.001 at&eacute; 10.000</option>
                        <option <?php if($b_valor == 7){echo "selected=\"selected\"";}?> value="7">De 10.001 at&eacute; 50.000</option>
                        <option <?php if($b_valor == 8){echo "selected=\"selected\"";}?> value="8">De 50.001 at&eacute; 100.000</option>
                        <option <?php if($b_valor == 9){echo "selected=\"selected\"";}?> value="9">De 100.001 at&eacute; 200.000</option>
                        <option <?php if($b_valor == 10){echo "selected=\"selected\"";}?> value="10">De 200.001 at&eacute; 500.000</option>
                        <option <?php if($b_valor == 11){echo "selected=\"selected\"";}?> value="11">Acima de 500.000</option>
                      </select>
                    </fieldset>
                    <fieldset class="span2">
                      <label>&nbsp;<!-- margin-top? --></label>
                      <button type="submit"></button>
                    </fieldset>
                  </form>
                </div>
            </div><!-- fim#forms  -->
          </div>
        </div><!-- fim.borda -->
        <div class="shadow-bottom"></div>

      </div><!-- fim#buscador -->
    </div>
  </div>
</section>