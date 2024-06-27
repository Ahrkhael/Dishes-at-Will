<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/recipesFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //De los datos recibidos, creamos una nueva variable para cada uno
    $idRecipe = $data->idRecipeSelected;

    //Llamamos a la función editRecipe y, si tiene éxito, devolvemos un 200 y, si no, devolvemos un 400
    if(deleteRecipe($idRecipe)) {
        $data->resultado = "Todo ha ido bien";
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"La receta no se ha podido actualizar"));
    }
?>