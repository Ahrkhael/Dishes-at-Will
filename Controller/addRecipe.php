<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/recipesFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Separamos los datos recibidos en dos variables que son las que nos interesan
    $nameRecipe = $data->nameRecipe;
    $ingredients = $data->listIngredients;

    if(addRecipe($nameRecipe, $ingredients)) {
        $data->resultado = "La receta ha sido creada con éxito";
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"La receta no se ha podido crear"));
    }

?>