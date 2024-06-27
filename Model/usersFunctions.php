<?php

    include "../Model/connection.php";

    //Creamos una función para comprobar si el usuario existe en nuestra base de datos
	function checkUser($connection, $email) {
		
		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT COUNT(user_id) FROM users WHERE email = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("s", $email);
		
		//Ejecutamos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Ahora guardamos el resultado en un array al que llamaremos $row
		$row = $result->fetch_row();

		//El primer valor del array $row serña el resultado del select count y lo guardamos en la variable $count
		$count = $row[0];

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Si el resultado que obtenemos es 1, es que el usuario existe ya en la BBDD
		if($count === 1) {
			return true;
		} else {
			return false;
		}
	}

	//Función que devuelve true en caso de que se haya podido registrar el usuario y false en caso contrario
    function registerUser($name, $email, $pass) {
		
		//Creamos la conexión
		$connection = crearConexion();

		//Comprobamos que el usuario no exista ya en nuestra BBDD y, si es el caso, hacemos el insert
		if(!checkUser($connection, $email)) {
			
			//Definimos la consulta para insertar los datos de la tabla
			$sql = $connection->prepare("INSERT INTO users (username, email, password_user) VALUES (?, ?, ?);");

			//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
			$sql->bind_param("sss", $name, $email, $pass);
			
			//Hacemos la consulta y guardamos el resultado
			$result = $sql->execute();

			//Cerramos la sentencia para liberar recursos
			$sql->close();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos true, porque se ha podido registrar el usuario
			return true;

		} else {

			//Cerramos la conexión
			cerrarConexion($connection);
			
			//Devolvemos false porque el usuario ya existe
			return false;

		}
	}

	//Función que devuelve true en caso de que se haya podido loguear o false en caso contrario
	function login($name, $pass) {
		
		//Creamos la conexión
		$connection = crearConexion();
		
		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT user_id, rol_user, password_user FROM users WHERE username = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("s", $name);
		
		//Ejecutamos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Ahora guardamos el resultado en un array al que llamaremos $row
		$row = $result->fetch_assoc();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos también el objeto $result con la sentencia free()
		$result->free();

		//Iniciamos la sesión con el método session_start()
		session_start();

		//Cerramos la conexión con la BBDD
		cerrarConexion($connection);
		
		if(isset($row['rol_user']) && $row['rol_user'] != '') {
			if(password_verify($pass, $row['password_user'])) {
				//En caso de que eexista el usuario introducimos el valor del id del usuario
				//y rol de usuario en la variable global $_SESSION y devolvemos true
				$_SESSION['user_id'] = $row['user_id'];
				$_SESSION['rol_user'] = $row['rol_user'];
				return true;
			}else {
				return false;
			}
		} else {
			$_SESSION['user_id'] = '';
			$_SESSION['rol_user'] = '';
			return false;
		}
	}

	//Función que devuelve la lista de usuarios de la Base de Datos
	function getUsers() {

		//Creamos la conexión
		$connection = crearConexion();

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT user_id, username, email, rol_user FROM users WHERE rol_user = 'user' OR rol_user = 'banned'; ");
		
		//Ejecutamos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos la conexión
        cerrarConexion($connection);

		//Devolvemos el resultado obtenido en $result, que serán todos los usuarios de la tabla users
		return $result;

	}

	//Función que devuelve true en caso de que se haya podido banear el usuario y false en caso contrario
	function banUser($idUser) {

		//Creamos la conexión
		$connection = crearConexion();

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("UPDATE users SET rol_user = 'banned' WHERE user_id = ?; ");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("i", $idUser);
		
		//Ejecutamos la consulta y guardamos el valor en $result
		$result = $sql->execute();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos la conexión
        cerrarConexion($connection);

		//Devolvemos el resultado obtenido en $result, que serán todos los usuarios de la tabla users
		return $result;

	}
?>