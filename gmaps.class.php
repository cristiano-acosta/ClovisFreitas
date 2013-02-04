<?php
/*
 *  Clase Gmaps
 *  author: Rafael Clares <rafadinix@gmail> 
 */
class gMaps
{

    public $markers = array( );
    public $icons = array( );

    public function __construct()
    {
        //
    }

    public function addMarker( $lat, $lon, $html = null, $icon = null )
    {
        $latlon = array( 'latitude' => $lat, 'longitude' => $lon );
        if( $html != null )
        {
            $latlon['html'] = utf8_encode( "$html" );
        }
        if( $icon != null )
        {
            $latlon['icon'] = $this->icons["$icon"];
        }
        $this->markers[] = $latlon;
    }

    public function addMarkerCep( $cep, $num = null, $html = null, $icon = null )
    {
        $address = $this->getAddressCep( $cep, $num );
        if( $address )
        {
            $latlon = $this->getLatLon( $address );
            if( $html != null )
            {
                $latlon['html'] = utf8_encode( "$html" );
            }
            if( $icon != null )
            {
                $latlon['icon'] = $this->icons["$icon"];
            }
            $latlon['endereco'] = $address;
            $this->markers[] = $latlon;
        }
    }

    public function addMarkerAddress( $address, $html = null, $icon = null )
    {
        $latlon = $this->getLatLon( $address );
        if( is_array( $latlon ) )
        {
            if( $html != null )
            {
                $latlon['html'] = utf8_encode( "$html" );
            }
            if( $icon != null )
            {
                $latlon['icon'] = $this->icons["$icon"];
            }
            $latlon['endereco'] = $address;
            $this->markers[] = $latlon;
        }
    }

    public function addIcon( $name, $icon, $w, $h )
    {
        $this->icons["$name"] = "{image: '$icon',iconsize: [$w, $h],iconanchor: [12, 46],infowindowanchor: [12, 0]}";
    }

    public function loadFromXML( $url )
    {
        $xml = simplexml_load_file( $url, 'SimpleXMLAttribute' );
        $count = 0;

        foreach( $xml->marker as $marker )
        {
            $latlon = $this->getLatLon( $marker->attr( 'endereco' ) );
            //$latlon = array( 'latitude' => $marker->attr( 'lat' ), 'longitude' => $marker->attr( 'lon' ) );
            if( $marker->html != "" )
            {
                $latlon['html'] = preg_replace( '/\s+/', ' ', trim( $marker->html ) );
            }
            /*
              if( $marker->endereco != "" )
              {
              $latlon['endereco'] = preg_replace( '/\s+/', ' ', trim( $marker->endereco ) );
              }
             */
            if( $marker->icon )
            {
                $this->addIcon( $marker->icon->attr( 'name' ), $marker->icon->attr( 'url' ), $marker->icon->attr( 'width' ), $marker->icon->attr( 'height' ) );
                $latlon['icon'] = $this->icons[$marker->icon->attr( 'name' )];
            }
            $this->markers[$count] = $latlon;
            $count++;
        }
    }

    public function getMarkers()
    {
        $markers = "[";
        foreach( $this->markers as $marker )
        {
            $marker = (object) $marker;
            $markers .= "{latitude:$marker->latitude,longitude:$marker->longitude,";
            $html = "";

            if( isset( $marker->html ) )
            {
                $html = "$marker->html";
            }

            if( isset( $marker->endereco ) )
            {
                $html .= "<p><span>$marker->endereco</span></p>";
            }

            if( $html != "" )
            {
                $markers .= "html:'$html',";
            }

            if( isset( $marker->icon ) )
            {
                $markers .= "icon:$marker->icon";
            }
            //$markers .= "{latitude:$marker->latitude,longitude:$marker->longitude,html:$marker->html,icon:$marker->icon},";
            $markers .= "},";
        }
        $markers .= "]";
        echo trim($markers);
        //echo stripslashes ( preg_replace(array('/\"/'),array(''),json_encode($this->markers)) );
    }

    public function getAddress( $url )
    {
        if( function_exists( 'curl_init' ) )
        {
            $cURL = curl_init( $url );
            curl_setopt( $cURL, CURLOPT_RETURNTRANSFER, true );
            curl_setopt( $cURL, CURLOPT_FOLLOWLOCATION, true );
            $address = curl_exec( $cURL );
            curl_close( $cURL );
        }
        else
        {
            $address = file_get_contents( $url );
        }
        if( !$address )
        {
            return false;
        }
        else
        {
            return trim($address);
        }
    }

    public function getLatLon( $address )
    {
        $url = 'http://maps.google.com/maps/geo?output=csv&key=&q=' . urlencode( $address );
        $latlon = $this->getAddress( $url );
        list($status, $zoom, $latitude, $longitude) = explode( ',', $latlon );
        if( $status != 200 )
        {
            return false;
        }
        return array( 'latitude' => $latitude, 'longitude' => $longitude, 'endereco' => $address );
    }

    public function getAddressCep( $cep, $num = null )
    {
        $resultado = @file_get_contents( 'http://republicavirtual.com.br/web_cep.php?cep=' . urlencode( $cep ) . '&formato=query_string' );
        if( $resultado )
        {
            parse_str( $resultado, $retorno );
            $pattern = array( "á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í", "ì", "î", "ï", "ó", "ò", "ô",
                    "õ", "ö", "ú", "ù", "û", "ü", "ç", "Á", "À", "Â", "Ã", "Ä", "É", "È", "Ê", "Ë", "Í",
                    "Ì", "Î", "Ï", "Ó", "Ò", "Ô", "Õ", "Ö", "Ú", "Ù", "Û", "Ü", "Ç" );

            $replace = array( "a", "a", "a", "a", "a", "e", "e", "e", "e", "i", "i", "i", "i", "o", "o", "o",
                    "o", "o", "u", "u", "u", "u", "c", "A", "A", "A", "A", "A", "E", "E", "E", "E", "I",
                    "I", "I", "I", "O", "O", "O", "O", "O", "U", "U", "U", "U", "C" );

            if( $num == null )
            {
                $str = trim($retorno['tipo_logradouro'] . " " . $retorno['logradouro'] . ", " . $retorno['cidade'] . ", " . $retorno['uf']);
            }
            else
            {
                $str = trim($retorno['tipo_logradouro'] . " " . $retorno['logradouro'] . ", $num, " . $retorno['cidade'] . ", " . $retorno['uf']);
            }
            return str_replace( $pattern, $replace, $str );
        }
        else
        {
            return false;
        }
    }
}
class SimpleXMLAttribute extends SimpleXMLElement
{

    public function attr( $name )
    {
        foreach( $this->Attributes() as $key => $val )
        {
            if( $key == $name )
            {
                return (string) $val;
            }
        }
    }
}
