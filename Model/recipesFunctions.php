<?php

    include "../Model/connection.php";

	//Función que añade una receta a la Base de Datos
    function addRecipe($nameRecipe, $ingredients) {
		
		//Creamos la conexión
		$connection = crearConexion();

		//Cambiamos la configuración de autocommit a false para que no se ejecuten las sentencias hasta que todo esté listo
		$connection->autocommit(FALSE);

		//Recuperamos el valor del id de usuario que tiene la sesión activa
		session_start();
		$user_id = $_SESSION['user_id'];

		//Definimos la primera consulta para insertar los datos de la tabla
		$sql = $connection->prepare("INSERT INTO recipes (user_id_fk, name_recipe) VALUES (?,?);");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("is", $user_id, $nameRecipe);
		
		//Hacemos la consulta y guardamos el primer resultado que será true si se ejecuta con éxito
		$result1 = $sql->execute();

		//Rescatamos el ID de la receta que se ha creado en la tabla recipes al hacer el insert
		$id_recipe = $connection->insert_id;

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Creamos unas variables que serán los valores nutricionales totales de nuestra receta
		$kcalTotal = 0;
		$proteinsTotal = 0;
		$fatTotal = 0;
		$carbohydratesTotal = 0;

		//Definimos la segunda consulta para insertar los datos de la tabla
		$sql = $connection->prepare("INSERT INTO recipe_ingredients (recipe_id_fk, ingredient_id_fk, quantity) VALUES (?, ?, ?);");

		//Creamos una variable $result2 que en principio será true
		$result2 = true;

		//Para cada par de valores del array $listIngredients tenemos que insertarlo en la tabla, así que usaremos un for
		for($i=0; $i<count($ingredients); $i++) {

			$ingredientName = $ingredients[$i]->Name;
			$quantity = $ingredients[$i]->Quantity;
			
			//Rescataamos el ingrediente con la función getIngredient()
			$ingredient = getIngredient($connection, $ingredientName);

			//Separamos los datos de los ingredientes en diferentes variables
			$ingredientId = $ingredient['ingredient_id'];

			//Cabe destacar que las siguientes cifras son cada 100g, por eso hay que dividir entre 100 cada cantidad
			$kcalTotal += $quantity * $ingredient['kcal'] / 100;
			$proteinsTotal += $quantity * $ingredient['proteins'] / 100;
			$fatTotal += $quantity * $ingredient['fat'] / 100;
			$carbohydratesTotal += $quantity * $ingredient['carbohydrates'] / 100;

			//Para cada dupla de valores, hacemos un bind_param
			$sql->bind_param("iid", $id_recipe, $ingredientId, $quantity);

			//Ejecutamos la sentencia SQL del prepare con los diferentes valores
			$result = $sql->execute();

			//Si $result es negativo en alguna de las veces que se va a ejecutar, cambiamos el valor de $result2 a false
			if(!$result) {
				$result2 = false;
			}
		}

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Si se han ejecutado ambas sentencias, commiteamos todo y en caso contrario hacemos rollback
		if($result1 && $result2){
			$connection->commit();
			
			//Definimos la tercera consulta para actualizar los datos de la tabla, una vez que se ha creado el registro
			$sql = $connection->prepare("UPDATE recipes SET total_kcal = ?, total_proteins = ?, total_fat = ?, total_carbohydrates = ? WHERE user_id_fk = ? AND recipe_id = ?;");
			
			//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
			$sql->bind_param("ddddii", $kcalTotal, $proteinsTotal, $fatTotal, $carbohydratesTotal, $user_id, $id_recipe);

			//Ejecutamos la consulta
			$sql->execute();

			//Cerramos la sentencia para liberar recursos
			$sql->close();

			//Comiteamos una última vez
			$connection->commit();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos true porque todo ha ido bien
			return true;

		}else {
			$connection->rollback();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos false porque no se ha ejecutado
			return false;
		}

	}

	//Función que devuelve la información de un ingrediente de la base de datos
	function getIngredient($connection, $ingredientName) {

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT ingredient_id, kcal, proteins, fat, carbohydrates FROM ingredients WHERE ingredient = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("s", $ingredientName);
		
		//Hacemos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Ahora guardamos el resultado en un array al que llamaremos $row
		$row = $result->fetch_assoc();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos también el objeto $result con la sentencia free()
		$result->free();

		return $row;

	}

	//Función que devuelve la lista de ingredientes de la Base de Datos
	function getIngredients() {

		//Creamos la conexión
		$connection = crearConexion();

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT ingredient_id, ingredient FROM ingredients;");
		
		//Ejecutamos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos la conexión
        cerrarConexion($connection);

		//Devolvemos el resultado obtenido en $result, que serán todos los ingredientes de la tabla ingredients
		return $result;

	}

	//Función que devuelve la lista de recetas de la Base de Datos
	function getRecipes($id_user) {

		//Creamos la conexión
		$connection = crearConexion();

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT recipes.recipe_id AS Recipe_id, recipes.name_recipe AS Name_recipe, ingredients.ingredient AS Ingredient, recipe_ingredients.quantity AS Quantity FROM recipes INNER JOIN recipe_ingredients ON recipes.recipe_id = recipe_ingredients.recipe_id_fk INNER JOIN ingredients ON recipe_ingredients.ingredient_id_fk = ingredients.ingredient_id WHERE recipes.user_id_fk = $id_user ORDER BY Recipe_id ASC; ");
		
		//Ejecutamos la consulta
		$sql->execute();

		//Recuperamos el resultado y lo guardamos en la variable $result
		$result = $sql->get_result();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos la conexión
        cerrarConexion($connection);

		//Devolvemos el resultado obtenido en $result, que serán todas las recetas de la tabla recipes
		return $result;

	}

	//Función que actualiza una receta a la Base de Datos
    function editRecipe($idRecipe, $nameRecipe, $ingredients) {
		
		//Creamos la conexión
		$connection = crearConexion();

		//Cambiamos la configuración de autocommit a false para que no se ejecuten las sentencias hasta que todo esté listo
		$connection->autocommit(FALSE);

		//Recuperamos el valor del id de usuario que tiene la sesión activa
		session_start();
		$user_id = $_SESSION['user_id'];

		//Por cuestiones de rendimiento, es mucho más óptimo borrar los datos de recipe_ingredients antiguos
		//e insertar unos datos nuevos para la receta concreta, así que creamos la consulta para borrar los datos antiguos
		$sql = $connection->prepare("DELETE FROM recipe_ingredients WHERE recipe_id_fk = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("i", $idRecipe);

		//Hacemos la consulta y guardamos el primer resultado que será true si se ejecuta con éxito
		$result1 = $sql->execute();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Definimos la tercera consulta para insertar los datos de la tabla
		$sql = $connection->prepare("INSERT INTO recipe_ingredients (recipe_id_fk, ingredient_id_fk, quantity) VALUES (?, ?, ?);");

		//Creamos una variable $result2 que en principio será true
		$result2 = true;
		
		//Creamos unas variables que serán los valores nutricionales actualizados totales de nuestra receta
		$kcalTotal = 0;
		$proteinsTotal = 0;
		$fatTotal = 0;
		$carbohydratesTotal = 0;

		//Para cada par de valores del array $listIngredients tenemos que insertarlo en la tabla, así que usaremos un for
		for($i=0; $i<count($ingredients); $i++) {

			$ingredientName = $ingredients[$i]->Name;
			$quantity = $ingredients[$i]->Quantity;

			//Rescataamos el id del ingrediente con la función getIngredientId()
			$ingredient = getIngredient($connection, $ingredientName);

			//Separamos los datos de los ingredientes en diferentes variables
			$ingredientId = $ingredient['ingredient_id'];

			//Cabe destacar que las siguientes cifras son cada 100g, por eso hay que dividir entre 100 cada cantidad
			$kcalTotal += $quantity * $ingredient['kcal'] / 100;
			$proteinsTotal += $quantity * $ingredient['proteins'] / 100;
			$fatTotal += $quantity * $ingredient['fat'] / 100;
			$carbohydratesTotal += $quantity * $ingredient['carbohydrates'] / 100;

			//Para cada dupla de valores, hacemos un bind_param
			$sql->bind_param("iid", $idRecipe, $ingredientId, $quantity);

			//Ejecutamos la sentencia SQL del prepare con los diferentes valores
			$result = $sql->execute();

			//Si $result es negativo en alguna de las veces que se va a ejecutar, cambiamos el valor de $result2 a false
			if(!$result) {
				$result2 = false;
			}
		}

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Definimos la tercera consulta para actualizar los datos de la tabla
		$sql = $connection->prepare("UPDATE recipes SET name_recipe = ?, total_kcal = ?, total_proteins = ?, total_fat = ?, total_carbohydrates = ? WHERE user_id_fk = ? AND recipe_id = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("sddddii", $nameRecipe, $kcalTotal, $proteinsTotal, $fatTotal, $carbohydratesTotal, $user_id, $idRecipe);
		
		//Hacemos la consulta y guardamos el primer resultado que será true si se ejecuta con éxito
		$result3 = $sql->execute();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Si se han ejecutado las 3 sentencias, commiteamos todo y en caso contrario hacemos rollback
		if($result1 && $result2 && $result3) {
			$connection->commit();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos true porque todo ha ido bien
			return true;

		}else {
			$connection->rollback();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos false porque no se ha ejecutado
			return false;
		}
	}
	
	//Función que elimina una receta a la Base de Datos
    function deleteRecipe($idRecipe) {
		
		//Creamos la conexión
		$connection = crearConexion();

		//Cambiamos la configuración de autocommit a false para que no se ejecuten las sentencias hasta que todo esté listo
		$connection->autocommit(FALSE);

		//Establecemos que no haya restricciones de foreign_key momentáneamente
		$connection->query("SET foreign_key_checks = 0");

		//Creamos la consulta
		$sql = $connection->prepare("DELETE recipes, recipe_ingredients FROM recipes LEFT JOIN recipe_ingredients ON recipes.recipe_id = recipe_ingredients.recipe_id_fk WHERE recipes.recipe_id = ?;");

		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("i", $idRecipe);

		//Hacemos la consulta y guardamos el segundo resultado que será true si se ejecuta con éxito
		$result = $sql->execute();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Volvemos a activar las restricciones de foreign_key
		$connection->query("SET foreign_key_checks = 1");

		//Si se ha ejecutado la sentencia con éxito, commiteamos todo y en caso contrario hacemos rollback
		if($result) {
			$connection->commit();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos true porque todo ha ido bien
			return true;

		}else {
			$connection->rollback();

			//Cerramos la conexión
			cerrarConexion($connection);

			//Devolvemos false porque no se ha ejecutado
			return false;
		}
	}

	//Función que guarda el calendario del usuario
	function saveCalendar($recipesCalendar) {

		//Creamos la conexión
		$connection = crearConexion();

		//Recuperamos el valor del id de usuario que tiene la sesión activa
		session_start();
		$user_id = $_SESSION['user_id'];

		//Recorremos la variable recipesCalendar y, para cada valor, sacamos su id del Recipe
		for($i=0; $i<count($recipesCalendar); $i++) {
			$nameRecipe =  $recipesCalendar[$i]->NameRecipe;
			$id[] = getRecipeId($connection, $user_id, $nameRecipe);
		}

		//Comprobamos si existe ya un calendario y, si no existe lo creamos y si existe lo actualizamos
		if (calendarExists($connection, $user_id)){
			
			//Definimos la consulta para actualizar los datos de la tabla
			$sql = $connection->prepare("UPDATE `calendar` SET `monday_breakfast_recipe_fk`=?, `monday_lunch_recipe_fk`=?, `monday_dinner_recipe_fk`=?, `tuesday_breakfast_recipe_fk`=?, `tuesday_lunch_recipe_fk`=?, `tuesday_dinner_recipe_fk`=?, `wednesday_breakfast_recipe_fk`=?, `wednesday_lunch_recipe_fk`=?, `wednesday_dinner_recipe_fk`=?, `thursday_breakfast_recipe_fk`=?, `thursday_lunch_recipe_fk`=?, `thursday_dinner_recipe_fk`=?, `friday_breakfast_recipe_fk`=?, `friday_lunch_recipe_fk`=?, `friday_dinner_recipe_fk`=?, `saturday_breakfast_recipe_fk`=?, `saturday_lunch_recipe_fk`=?, `saturday_dinner_recipe_fk`=?, `sunday_breakfast_recipe_fk`=?, `sunday_lunch_recipe_fk`=?, `sunday_dinner_recipe_fk`=? WHERE `user_id_fk`=?");

			//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
			$sql->bind_param("iiiiiiiiiiiiiiiiiiiiii", $id[0], $id[1], $id[2], $id[3], $id[4], $id[5], $id[6], $id[7], $id[8], $id[9], $id[10], $id[11], $id[12], $id[13], $id[14], $id[15], $id[16], $id[17], $id[18], $id[19], $id[20], $user_id);

			//Hacemos la consulta y guardamos el resultado que será true si se ejecuta con éxito
			$result = $sql->execute();

		}else {
			
			//Definimos la consulta para insertar los datos de la tabla
			$sql = $connection->prepare("INSERT INTO `calendar`(`user_id_fk`, `monday_breakfast_recipe_fk`, `monday_lunch_recipe_fk`, `monday_dinner_recipe_fk`, `tuesday_breakfast_recipe_fk`, `tuesday_lunch_recipe_fk`, `tuesday_dinner_recipe_fk`, `wednesday_breakfast_recipe_fk`, `wednesday_lunch_recipe_fk`, `wednesday_dinner_recipe_fk`, `thursday_breakfast_recipe_fk`, `thursday_lunch_recipe_fk`, `thursday_dinner_recipe_fk`, `friday_breakfast_recipe_fk`, `friday_lunch_recipe_fk`, `friday_dinner_recipe_fk`, `saturday_breakfast_recipe_fk`, `saturday_lunch_recipe_fk`, `saturday_dinner_recipe_fk`, `sunday_breakfast_recipe_fk`, `sunday_lunch_recipe_fk`, `sunday_dinner_recipe_fk`) VALUES (? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )");

			//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
			$sql->bind_param("iiiiiiiiiiiiiiiiiiiiii", $user_id, $id[0], $id[1], $id[2], $id[3], $id[4], $id[5], $id[6], $id[7], $id[8], $id[9], $id[10], $id[11], $id[12], $id[13], $id[14], $id[15], $id[16], $id[17], $id[18], $id[19], $id[20]);

			//Hacemos la consulta y guardamos el resultado que será true si se ejecuta con éxito
			$result = $sql->execute();

		}

		//Cerramos la conexión
		cerrarConexion($connection);

		//Devolvemos el resultado que será true si se ha hecho bien o false en caso contrario
		return $result;

	}

	//Función que devuelve el id de la receta de la Base de Datos
	function getRecipeId($connection, $id_user, $nameRecipe) {

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT recipe_id FROM recipes WHERE user_id_fk = ? AND name_recipe = ?;");
		
		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("is", $id_user, $nameRecipe);
		
		//Ejecutamos la consulta
		$sql->execute();

		//Guardamos el resultado en $result
		$result = $sql->get_result();

		//Recorremos el resultado con fetch_assoc() y lo guardamos en la variable $row
		$row = $result->fetch_assoc();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Devolvemos el resultado obtenido en $row en el campo recipe_id
		return $row['recipe_id'];
	}

	//Función para saber si el usuario tiene ya un calendario creado o no
	function calendarExists($connection, $user_id) {
		
		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT * FROM calendar WHERE user_id_fk = ?;");
		
		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("i", $user_id);
		
		//Ejecutamos la consulta
		$sql->execute();

		//Guardamos el resultado en la variable $result
		$result=$sql->get_result();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Devolvemos el número de filas que se han seleccionado en $result
		return $result->num_rows;
	}

	//Función para obtener los valores nutricionales de una receta concreta
	function getRecipeValues($nameRecipe) {

		//Creamos la conexión
		$connection = crearConexion();

		//Recuperamos el valor del id de usuario que tiene la sesión activa
		session_start();
		$user_id = $_SESSION['user_id'];

		//Definimos la consulta para recuperar los datos de la tabla
		$sql = $connection->prepare("SELECT total_kcal, total_proteins, total_fat, total_carbohydrates FROM recipes WHERE user_id_fk = ? AND name_recipe = ?;");
		
		//Enlazamos los valores para asegurarnos que, efectivamente, nos están pasando valores equivalentes a nuestra BBDD
		$sql->bind_param("is", $user_id, $nameRecipe);

		//Ejecutamos la consulta
		$sql->execute();

		//Guardamos el resultado en $result
		$result = $sql->get_result();

		//Recorremos el resultado con fetch_assoc() y lo guardamos en la variable $row
		$row = $result->fetch_assoc();

		//Cerramos la sentencia para liberar recursos
		$sql->close();

		//Cerramos la conexión
		cerrarConexion($connection);
		
		//Devolvemos el resultado obtenido en $row
		return $row;

	}
?>