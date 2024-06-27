<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/usersFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Separamos los datos recibidos en dos variables que son las que nos interesan
    $username = $data->username;
    $pass = $data->pass;

    //Comprobamos en el servidor que los datos de username y pass proporcionados no están vacíos
    if($username !== "" && $pass !== "") {

        //Llamamos a la función login que está en el documento connection.php y
        //si devuelve true, es que la sentencia SQL se ha ejecutado con éxito y devolvemos un 200 y el valor
        //de la variable global sesión con clave rol_user para luego mostrar una vista u otra en función del valor 
        //y, si devuelve false, quiere decir que ha habido un error a la hora de ejecutar el SQL y devolvemos un 400
        if(login($username, $pass)) {
            $data->resultado = [$_SESSION['user_id'], $_SESSION['rol_user']];
            http_response_code(200);
            echo json_encode($data);
        } else {
            http_response_code(400);
            echo json_encode(array("mensaje"=>"Los datos introducidos no son correctos"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"Los datos introducidos no pueden estar vacíos"));
    }

?>