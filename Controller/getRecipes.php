<?php

    include "../Model/recipesFunctions.php";

    //Inicializamos la variable $response como un array que contiene como claves
    //active_session y rol_user y, como valores, false y un string vacío respectivamente e inicialmente
    $response = array();

    //Llamamos al método session_start porque vamos a recuperar el user_id de la variable global $_SESSION
    session_start();

    //Rescatamos los ingredientes con la función getRecipes() que está en recipesFunctions pasándole el user_id como parámetro
    $result = getRecipes($_SESSION['user_id']);

    //Recorremos el resultado con fetch_array y por cada $row (fila) del resultado, guárdamos el ingrediente en $response
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }

    //Comprobamos si se ha rescatado algún valor y en caso positivo, devolvemos un 200 y un 400 en caso negativo
    if(isset($response)) {
        http_response_code(200);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"Ha habido un problema con las recetas"));
    }

    //Enviamos un encabezado con la función header y le decimos que el resultado va a ser un json
    //para más información, saqué esto del siguiente enlace:
    //https://stackoverflow.com/questions/44378222/when-to-use-headercontent-type-application-json-in-php
    header('Content-Type: application/json');

    //Devolvemos el resultado en formato json de vuelta a JavaScript
    echo json_encode($response);

?>