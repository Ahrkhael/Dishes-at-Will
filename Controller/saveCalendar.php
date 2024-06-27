<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/recipesFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Separamos los datos recibidos en dos variables que son las que nos interesan
    $recipesCalendar = $data->arrayRecipesSelected;

    if(saveCalendar($recipesCalendar)) {
        $data->resultado = "El calendario ha sido guardado con éxito";
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"El calendario no se ha podido guardar"));
    }

?>