<?php

    //Incluimos el archivo conexion.php que es donde tenemos guardadas nuestras funciones php
    include "../Model/usersFunctions.php";

    //Recuperamos los datos recibidos y lo decodificamos y almacenamos en la variable $data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    //Separamos los datos recibidos en las variables que son las que nos interesan
    $username = $data->username;
    $email = $data->email;
    $pass = $data->pass;
    $confirmPass = $data->confirmPass;
    //Hasheamos la contraseña con el método password_hash de php
    $passHashed = password_hash($pass, PASSWORD_BCRYPT);

    //Comprobamos en el servidor que los datos proporcionados son correctos
    //en el caso del email usaremos la función filter_var() del manual php
    if($username !== "" && filter_var($email, FILTER_VALIDATE_EMAIL) && $pass !== "" && $pass === $confirmPass) {
        
        //Llamamos a la función registerUser que está en el documento connection.php y
        //si devuelve true, es que la sentencia SQL se ha ejecutado con éxito y devolvemos un 200 y
        //si devuelve false, quiere decir que ha habido un error a la hora de ejecutar el SQL y devolvemos un 400
        if(registerUser($username, $email, $passHashed)) {
            $data->resultado = "Todo ha ido bien";
            http_response_code(200);
            echo json_encode($data);
        } else {
            http_response_code(400);
            echo json_encode(array("mensaje"=>"El correo introducido ya existe"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("mensaje"=>"Los datos introducidos no son correctos"));
    }

?>