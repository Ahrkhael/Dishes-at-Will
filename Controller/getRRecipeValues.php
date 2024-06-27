<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/recipesFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Guardamos en nuestra variable $nameRecipe el valor recibido desde el frontend
    $nameRecipe = $data->recipeSelected;

    //Recorremos lo que obtenemos al llamar a la función getRecipeValues
    //y guardamos los diferentes valores en response
    $row = getRecipeValues($nameRecipe);
    $data->total_kcal = $row['total_kcal'];
    $data->total_proteins = $row['total_proteins'];
    $data->total_fat = $row['total_fat'];
    $data->total_carbohydrates = $row['total_carbohydrates'];
    
    //Llamamos a la función getRecipeValues y, si tiene éxito, devolvemos un 200 y, si no, devolvemos un 400
    if(!empty($row)) {
        $data->resultado = "Todo ha ido bien";
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"La receta no se ha podido actualizar"));
    }

?>