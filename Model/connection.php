<?php 

	function crearConexion() {
		// Cambiar en el caso en que se monte la base de datos en otro lugar
		$host = "localhost";
		$user = "root";
		$pass = "";
		$baseDatos = "proyecto";
		
		//Establecemos la conexión creándonos un objeto de tipo mysqli y pasándole al constructor
		//los parámetros de nuestra base de datos
		$connection = new mysqli($host, $user, $pass, $baseDatos);
		
		//Si no hemos podido conectar, mostraremos un error
		if(!$connection) {
			die("<br>Error de conexión con la base de datos: " . mysqli_connect_error());
		}
		
		//En caso de que sí se ha podido conectar, devolvemos la conexión
		return $connection;
	}

	function cerrarConexion($connection) {
		//Cerramos la conexión con la sentencia mysqli_close
		mysqli_close($connection);
	}

?>