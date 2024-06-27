<?php
    
    session_start();

    //Inicializamos la variable $response como un array que contiene como claves
    //active_session y rol_user y, como valores, false y un string vacío respectivamente e inicialmente
    $response = array('active_session' => false, 'user_id' => '', 'rol_user' => '');

    //Comprobamos si está activa una sesión ya y qué tipo de usuario inició sesión y lo guardamos en $response
    //devolviendo un 200 si, efectivamente, hay sesión activa o un 400 si no
    if(isset($_SESSION['rol_user']) && $_SESSION['rol_user'] !== '' ) {
        $response['active_session'] = true;
        $response['user_id'] = $_SESSION['user_id'];
        $response['rol_user'] = $_SESSION['rol_user'];
        http_response_code(200);
        //Devolvemos el resultado en formato json de vuelta a JavaScript
        echo json_encode($response);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"La sessión no existe"));
    }

    //Enviamos un encabezado con la función header y le decimos que el resultado va a ser un json
    //para más información, saqué esto del siguiente enlace:
    //https://stackoverflow.com/questions/44378222/when-to-use-headercontent-type-application-json-in-php
    header('Content-Type: application/json');

?>