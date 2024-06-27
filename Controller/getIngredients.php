<?php

    include "../Model/recipesFunctions.php";

    //Inicializamos la variable $response como un array
    $response = array();

    //Rescatamos los ingredientes con la función getIngredients() que está en recipesFunctions
    $result = getIngredients();

    //Recorremos el resultado con fetch_array y por cada $row (fila) del resultado, guárdamos el ingrediente en $response
    while ($row = mysqli_fetch_array($result)) {
        $response[] = $row['ingredient'];
    }

    //Comprobamos si se ha rescatado algún valor y en caso positivo, devolvemos un 200 y un 400 en caso negativo
    if($response[0] != '') {
        http_response_code(200);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"Ha habido un problema con la tabla Ingredientes. Cóntacte con el superadmin."));
    }

    //Enviamos un encabezado con la función header y le decimos que el resultado va a ser un json
    //para más información, saqué esto del siguiente enlace:
    //https://stackoverflow.com/questions/44378222/when-to-use-headercontent-type-application-json-in-php
    header('Content-Type: application/json');

    //Devolvemos el resultado en formato json de vuelta a JavaScript
    echo json_encode($response);

?>