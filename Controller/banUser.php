<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/usersFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Separamos los datos recibidos en tres variables que son las que nos interesan
    $idUser = $data->idUser;

    //Llamamos a la función editRecipe y, si tiene éxito, devolvemos un 200 y, si no, devolvemos un 400
    if(banUser($idUser)) {
        $data->resultado = "Todo ha ido bien";
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"El usuario no se ha podido banear"));
    }

?>