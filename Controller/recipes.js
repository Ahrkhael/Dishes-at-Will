//Creamos una clase a la que llamaremos Recipe y que tendrá los siguientes atributos y métodos
class Recipe {
    constructor() {
        //idRecipe será el id del recipe recibido de la base de datos aunque lo inicializaremos en 0 (no tiene id inicial)
        this.idRecipe = 0
        //nameRecipe será el nombre que el usuario le dio a la receta
        this.nameRecipe = ""
        //numberIngredients hará de contador y se inicializa en 0 porque los arrays en JS empiezan en 0
        this.numberIngredients = 0
        //ingredients será un array con objetos JSON dentro que recibiremos de la base de datos,
        //donde cada objeto JSON tendrá una clave "Name" y una clave "Quantity" para cada ingrediente
        this.ingredients = []
    }
    setIdRecipe(idRecipe) {
        this.idRecipe = idRecipe
    }
    setNameRecipe(nameRecipe) {
        this.nameRecipe = nameRecipe
    }
    getNumberIngredients() {
        return this.numberIngredients
    }
    getRecipeIngredients() {
        return this.ingredients
    }
    increaseNumberIngredients() {
        this.numberIngredients++
    }
    decreaseNumberIngredients() {
        this.numberIngredients--
    }
    pushIngredientsRecipe(ingredient) {
        this.ingredients.push(ingredient)
    }
}

//Creamos también una clase para la lista de recetas a la que llamaremos ListRecipes y tendrá los siguientes atributos y métodos
class ListRecipes {
    constructor() {
        //recipes será un array de objetos de clase Recipe
        this.recipes = []
        //numberRecipes hará de contador y determina el número de recetas de la lista
        this.numberRecipes = 0
    }
    getNumberRecipes() {
        return this.numberRecipes
    }
    getRecipes() {
        return this.recipes
    }
    increaseNumberRecipes() {
        this.numberRecipes++
    }
    pushRecipes(recipe) {
        this.recipes.push(recipe)
    }
}

//Declaramos una variable que tenga ámbito global a la que llamaremos recipe que no inicializaremos de momento
let recipe

//Hacemos lo mismo para la variable recipeList
let recipeList

//Creamos una función getIngredients que llame a la función php y devolverá una promesa (la misma promesa del get)
const getIngredients = () => {

    return get("/Proyecto_DAW/Controller/getIngredients.php")

}

//Creamos una función showModalRecipe que muestre un modal para la nueva receta y que, después de llamar a la función getIngredients()
//tome los ingredientes de la base de datos y, si se cumple la promesa los inserte en el select del Modal
const showModalAddRecipe = () => {

    //Inicializamos la variable recipe
    recipe = new Recipe()

    //Creamos la vista del model de la receta, con cada div y cada select, con cuidado de escapar las comillas dobles para no romper el String
    document.getElementById("containerModalAddRecipe").innerHTML = "<div class=\"row justify-content-md-center\"><div class=\"col col-sm-6\"><label>Choose a name for recipe: </label></div><div class=\"col col-sm-6\"><input type=\"text\" id=\"nameRecipe\"></input></div><div class=\"col col-sm-6\"><label>Choose ingredient: </label></div><div class=\"col col-sm-6\"><select name=\"ingredients\" class=\"ingredients\"></select></div><div class=\"col col-sm-6\"><label>Quantity (g): </label></div><div class=\"col col-sm-6\"><input type=\"number\" class=\"cantidad\"></input></div></div>"

    //Vemos si se cumple la promesa y en caso afirmativo, rellenamos el select con las diferentes options
    getIngredients().then(ingredients => {
        for (let i=0; i<ingredients.length; i++) {
            document.getElementsByClassName("ingredients")[recipe.getNumberIngredients()].innerHTML += "<option>" + ingredients[i] + "</option>"
        }
    }).catch(error => {
        console.log(error.mensaje)
    })
}

//Creamos una función para añadir un nuevo ingrediente a la receta
const addIngredientAddRecipe = () => {

    //Incrementamos el número de ingredientes en la receta
    recipe.increaseNumberIngredients()

    //Creamos el nuevo elemento que queremos añadir
    let elementoAAnadir = document.createElement("div")
    //Le aplicamos a dicho elemento, las clases de row y de justify-content-md-center para que mantenga el mismo estilo que el resto
    elementoAAnadir.classList.add("row")
    elementoAAnadir.classList.add("justify-content-md-center")
    //Se lo añadimos al elemento containerModal como hijo
    document.getElementById("containerModalAddRecipe").appendChild(elementoAAnadir)
    //Introducimos dentro todos los elementos que queremos que tenga (los label, select y demás)
    elementoAAnadir.innerHTML = "<div class=\"col col-sm-6\"><label>Choose ingredient: </label></div><div class=\"col col-sm-6\"><select name=\"ingredients\" class=\"ingredients\"></select></div><div class=\"col col-sm-6\"><label>Quantity (g): </label></div><div class=\"col col-sm-6\"><input type=\"number\" class=\"cantidad\"></input></div>"

    //Rellenamos, como hicimos en addRecipe, cada una de las opciones del select
    getIngredients().then(ingredients => {
        for (let i=0; i<ingredients.length; i++) {
            document.getElementsByClassName("ingredients")[recipe.getNumberIngredients()].innerHTML += "<option>" + ingredients[i] + "</option>"
        }
    }).catch(error => {
        console.log(error.mensaje)
    })
}

 //Creamos una función para eliminar el último ingrediente a la receta
const removeIngredientAddRecipe = () => {

    //Comprobamos que hay mínimo 2 ingredientes en la receta y, si no es el caso, entonces pulsar en el botón no hará nada
    if(recipe.getNumberIngredients()>=1) {
        //Creamos una variable que sea el elemento que queremos eliminar (en nuestro caso el div contenedor de la fila)
        const elementoAEliminar = document.getElementsByClassName("row justify-content-md-center")[recipe.getNumberIngredients() + 1]
        
        //Eliminamos el elemento con removeChild
        elementoAEliminar.parentNode.removeChild(elementoAEliminar)

        //Decrementamos el número de ingredientes en la receta
        recipe.decreaseNumberIngredients()
    }
}

//Creamos una función addRecipe que añada una receta a la base de datos
const addRecipe = () => {

    let ingredientSelected
    let quantitySelected

    for(let i=0; i<=recipe.getNumberIngredients(); i++) {

        //Rescatamos los valores introducidos por el usuario
        ingredientSelected = document.getElementsByClassName("ingredients")[i].value
        quantitySelected = document.getElementsByClassName("cantidad")[i].value

        //Creamos un objeto JSON que introduciremos en nuestro atributo ingredients de nuestra receta
        let ingredient = {
            Name: ingredientSelected,
            Quantity: quantitySelected
        }
        
        //Agregamos el ingrediente al array ingredients de la receta
        recipe.pushIngredientsRecipe(ingredient)
    }

    //Rescatamos el valor de nameRecipe introducido por el usuario
    const nameRecipe = document.getElementById("nameRecipe").value

    //Rescatamos el valor de la lista de ingredientes de la receta, para mandarla al servidor
    const listIngredients = recipe.ingredients

    post("/Proyecto_DAW/Controller/addRecipe.php", {nameRecipe, listIngredients}).then(data => {
        console.log(data.resultado)
        fillCalendarOptions()
    }).catch(error => {
        //Si algo falla en el lado del servidor, mostramos el mensaje de error
        console.log(error.mensaje)
    }) 
}

//Creamos una función getRecipes que llame a la función php y devolverá una promesa (la misma promesa del get)
const getRecipes = () => {

    return get("/Proyecto_DAW/Controller/getRecipes.php")

}

//Creamos la función para mostrar el contenido del modal ShowRecipes
const showRecipes = () => {

    //Inicializamos nuestra lista de recetas
    recipeList = new ListRecipes()

    //Llamamos a la función getRecipes y, en caso de que se cumpla la promesa,
    //haremos una serie de cosas y mostraremos el mensaje del error en caso contrario
    getRecipes().then(data => {
        //Inicializamos una receta inicial
        recipe = new Recipe()

        for (let i=0; i<data.length; i++) {

            //Comprobamos si el id de la receta ha cambiado o no
            if(data[i].Recipe_id != recipe.idRecipe && recipe.idRecipe != 0) {
                //Si esto se cumple quiere decir que hemos cambiado de receta
                //pusheamos la receta a la lista de recetas e incrementamos su número de recetas
                recipeList.pushRecipes(recipe)
                recipeList.increaseNumberRecipes()
                //Creamos una nueva receta para guardar los nuevos datos
                recipe = new Recipe()
            }

            //Guardamos los nuevos idRecipe y nameRecipe en nuestra variable recipe
            recipe.setIdRecipe(data[i].Recipe_id)
            recipe.setNameRecipe(data[i].Name_recipe)

            //Creamos un objeto JSON que introduciremos en nuestro atributo ingredients de nuestra receta
            let ingredient = {
                Name: data[i].Ingredient,
                Quantity: data[i].Quantity
            }

            //Pusheamos el ingrediente en la receta e incrementamos el número de ingredientes
            recipe.pushIngredientsRecipe(ingredient)
            recipe.increaseNumberIngredients()
        }

        //Una vez salga del bucle, pusehamos la última receta e incrementamos el numero de recetas de nuestra lista
        recipeList.pushRecipes(recipe)
        recipeList.increaseNumberRecipes()
        drawRecipesModal(recipeList)
        
    }).catch(error => {
        console.log(error.mensaje)
    })
    
}

//Creamos la función que pinta las recetas dentro del modal ShowRecipes en forma de tabla
const drawRecipesModal = (recipeList) => {

    //Antes que nada, limpiamos el html con los datos previos que pudieran haber
    document.getElementById("containerModalRecipes").innerHTML = "<table class=\"table table-responsive table-bordered\" id=\"tableModalShowRecipes\"><thead><tr class=\"table-primary\"><th scope=\"col\">Name recipe</th><th scope=\"col\">Ingredients</th><th scope=\"col\">Quantity (g)</th><th scope=\"col\"></th></tr></thead><tbody id=\"tbodyModalShowRecipes\"></tbody></table>"

    //Rescatamos el elemento table de nuestro modalShowRecipes
    const table = document.getElementById("tableModalShowRecipes")
    table.classList.add("table")
    table.classList.add("table-bordered")

    //Creamos una variable que nos va a servir para comparar cuando hay un cambio de receta
    let recipeId

    for(let i = 0; i<recipeList.numberRecipes; i++) {
        for(let j = 0; j<recipeList.getRecipes()[i].getNumberIngredients(); j++) {
            //Añadimos una nueva fila a la tabla con sus diferentes elementos
            const row = table.insertRow()
            const cellNameRecipe = row.insertCell(0)
            const cellIngredients = row.insertCell(1)
            const cellQuantity = row.insertCell(2)
            const cellActions = row.insertCell(3)
            if(recipeId === recipeList.getRecipes()[i].idRecipe) {
                //Si esto se cumple, quiere decir que no hemos cambiado de receta y,
                //por tanto, escribimos solo los valores de ingrediente y cantidad
                cellIngredients.textContent = recipe.ingredients[j].Name
                cellQuantity.textContent = recipe.ingredients[j].Quantity
            }else {
                //En caso contrario, es que empieza una nueva receta, así que añadimos los valores de los diferentes campos
                recipe = recipeList.getRecipes()[i]
                cellNameRecipe.textContent = recipe.nameRecipe
                cellIngredients.textContent = recipe.ingredients[j].Name
                cellQuantity.textContent = recipe.ingredients[j].Quantity

                //Creamos dos botones que vamos a añadir en la última celda de la tabla y que nos permitirán
                //editar o eliminar la receta de la tabla y de nuestra base de datos
                const editButton = document.createElement("button")
                editButton.classList.add("btn")
                editButton.classList.add("btn-outline-primary")
                editButton.textContent = "Edit"
                editButton.addEventListener("click", () => editRecipe(row))

                const deleteButton = document.createElement("button")
                deleteButton.classList.add("btn")
                deleteButton.classList.add("btn-outline-primary")
                deleteButton.textContent = "Delete"
                deleteButton.addEventListener("click", () => deleteRecipe(row))

                //Añadimos los botones a sus respectivas celdas
                cellActions.appendChild(editButton)
                cellActions.appendChild(deleteButton)
                recipeId = recipeList.getRecipes()[i].idRecipe
            }
        }
    }
}

//Creamos una función que agregue filas con todos los datos de una Recipe a nuestra tabla tableModalShowRecipes
const editRecipe = (row) => {

    //Rescatamos el valor del nombre de la receta que ha seleccionado el usuario
    const nameRecipeTable = row.querySelector('td:first-child').textContent
    //Creamos una variable que es la receta seleccionada por parte del usuario
    let recipeSelected
    //Recorremos la lista de recetas para saber qué receta ha seleccionado el usuario
    for(let i=0; i<recipeList.getNumberRecipes(); i++) {
        if(nameRecipeTable === recipeList.getRecipes()[i].nameRecipe) {
            recipeSelected = recipeList.getRecipes()[i]
            break
        }
    }
    //Establecemos pues, el objeto recipe también como la receta seleccionada
    recipe = recipeSelected

    //Ocultamos el modal de las recetas y abrimos el modal para editar la receta
    $('#showRecipes').modal('hide')
    $('#editRecipe').modal('show')

    showModalEditRecipe(recipeSelected)
}

//Creamos una función showModalRecipe que muestre un modal para la nueva receta y que, después de llamar a la función getIngredients()
//tome los ingredientes de la base de datos y, si se cumple la promesa los inserte en el select del Modal
const showModalEditRecipe = (recipe) => {

    //Creamos la vista del model de la receta, con cada div y cada select, con cuidado de escapar las comillas dobles para no romper el String
    document.getElementById("containerModalEditRecipe").innerHTML = "<div class=\"row justify-content-md-center\"><div class=\"col col-sm-6\"><label>Choose a name for recipe: </label></div><div class=\"col col-sm-6\"><input type=\"text\" id=\"nameRecipeEdit\" value=\""+ recipe.nameRecipe +" \"></input></div><div class=\"col col-sm-6\"></div>"

    //Añadimos elementos en función del número de ingredientes y los mostramos al usuario
    for(let i = 0; i<recipe.getNumberIngredients(); i++) {
        //Creamos el nuevo elemento que queremos añadir
        let elementoAAnadir = document.createElement("div")
        //Le aplicamos a dicho elemento, las clases de row y de justify-content-md-center para que mantenga el mismo estilo que el resto
        elementoAAnadir.classList.add("row")
        elementoAAnadir.classList.add("justify-content-md-center")
        elementoAAnadir.classList.add("modalEditRecipe")
        //Se lo añadimos al elemento containerModalEditRecipe como hijo
        document.getElementById("containerModalEditRecipe").appendChild(elementoAAnadir)
        //Introducimos dentro todos los elementos que queremos que tenga (los label, select y demás)
        elementoAAnadir.innerHTML = "<div class=\"col col-sm-6\"><label>Choose ingredient: </label></div><div class=\"col col-sm-6\"><select name=\"ingredientsEditRecipe\" class=\"ingredientsEditRecipe\"></select></div><div class=\"col col-sm-6\"><label>Quantity (g): </label></div><div class=\"col col-sm-6\"><input type=\"number\" class=\"quantity\" value= \"" + recipe.getRecipeIngredients()[i].Quantity +"\"></div>"

        //Rellenamos, como hicimos en addRecipe, cada una de las opciones del select
        getIngredients().then(ingredients => {
            for (let j=0; j<ingredients.length; j++) {
                if(ingredients[j] === recipe.getRecipeIngredients()[i].Name) {
                    document.getElementsByClassName("ingredientsEditRecipe")[i].innerHTML += "<option selected>" + ingredients[j] + "</option>"    
                }else {
                    document.getElementsByClassName("ingredientsEditRecipe")[i].innerHTML += "<option>" + ingredients[j] + "</option>"
                }
            }
        }).catch(error => {
            console.log(error.mensaje)
        })
    }
}

//Creamos una función que agrege un ingrediente a la receta en el modal de EditRecipe
const addIngredientEditRecipe = () => {

        //Incrementamos el número de ingredientes en la receta
        recipe.increaseNumberIngredients()

        //Creamos el nuevo elemento que queremos añadir
        let elementoAAnadir = document.createElement("div")
        //Le aplicamos a dicho elemento, las clases de row y de justify-content-md-center para que mantenga el mismo estilo que el resto
        elementoAAnadir.classList.add("row")
        elementoAAnadir.classList.add("justify-content-md-center")
        elementoAAnadir.classList.add("modalEditRecipe")
        //Se lo añadimos al elemento containerModal como hijo
        document.getElementById("containerModalEditRecipe").appendChild(elementoAAnadir)
        //Introducimos dentro todos los elementos que queremos que tenga (los label, select y demás)
        elementoAAnadir.innerHTML = "<div class=\"col col-sm-6\"><label>Choose ingredient: </label></div><div class=\"col col-sm-6\"><select name=\"ingredientsEditRecipe\" class=\"ingredientsEditRecipe\"></select></div><div class=\"col col-sm-6\"><label>Quantity (g): </label></div><div class=\"col col-sm-6\"><input type=\"number\" class=\"quantity\"></input></div>"

        //Rellenamos, como hicimos en addRecipe, cada una de las opciones del select
        getIngredients().then(ingredients => {
            for (let i=0; i<ingredients.length; i++) {
                document.getElementsByClassName("ingredientsEditRecipe")[recipe.getNumberIngredients() - 1].innerHTML += "<option>" + ingredients[i] + "</option>"
            }
        }).catch(error => {
            console.log(error.mensaje)
        })
}

//Creamos una función que elimine el último ingrediente a la receta en el modal de EditRecipe
const removeIngredientEditRecipe = () => {
    
    //Comprobamos que hay mínimo 2 ingredientes en la receta y, si no es el caso, entonces pulsar en el botón no hará nada
    if(recipe.getNumberIngredients()>1) {
        //Creamos una variable que sea el elemento que queremos eliminar (en nuestro caso el div contenedor de la fila)
        const elementoAEliminar = document.getElementsByClassName("modalEditRecipe")[recipe.getNumberIngredients() - 1]
        
        //Eliminamos el elemento con removeChild
        elementoAEliminar.parentNode.removeChild(elementoAEliminar)

        //Decrementamos el número de ingredientes en la receta
        recipe.decreaseNumberIngredients()
    }
}

//Creamos una función que actualice la receta en la base de datos
const updateRecipe = () => {

    let ingredientSelected
    let quantitySelected

    //Limpiamos la lista de ingredientes antes de mandar la receta modificada
    recipe.ingredients = []

    for(let i=0; i<recipe.getNumberIngredients(); i++) {

        //Rescatamos los valores introducidos por el usuario
        ingredientSelected = document.getElementsByClassName("ingredientsEditRecipe")[i].value
        quantitySelected = document.getElementsByClassName("quantity")[i].value

        //Creamos un objeto JSON que introduciremos en nuestro atributo ingredients de nuestra receta
        let ingredient = {
            Name: ingredientSelected,
            Quantity: quantitySelected
        }
        
        //Agregamos el ingrediente al array ingredients de la receta
        recipe.pushIngredientsRecipe(ingredient)
    }

    //Rescatamos el valor del idRecipe que el usuario ha seleccionado para modificar
    const idRecipeSelected = recipe.idRecipe

    //Rescatamos el valor de nameRecipe introducido por el usuario
    const nameRecipe = document.getElementById("nameRecipeEdit").value

    //Rescatamos el valor de la lista de ingredientes de la receta, para mandarla al servidor
    const listIngredients = recipe.ingredients

    //Enviamos los datos al archivo editRecipe.php y en función de la respuesta, haremos una cosa u otra
    post("/Proyecto_DAW/Controller/editRecipe.php", {idRecipeSelected, nameRecipe, listIngredients}).then(data => {
        console.log("La receta " + data.nameRecipe + " ha sido actualizada")
        fillCalendarOptions()
    }).catch(error => {
        //Si algo falla en el lado del servidor, mostramos el mensaje de error
        console.log(error.mensaje)
    })
}

//Creamos un función para borrar el recipe seleccionado por el usuario
const deleteRecipe = (row) => {
    //Mostramos un mensaje por pantalla para confirmar la operación
    if(window.confirm("¿Estás seguro/a?")) {
        //Rescatamos el valor del nombre de la receta que ha seleccionado el usuario
        const nameRecipeTable = row.querySelector('td:first-child').textContent
        //Creamos una variable que es la receta seleccionada por parte del usuario
        let recipeSelected
        //Recorremos la lista de recetas para saber qué receta ha seleccionado el usuario
        for(let i=0; i<recipeList.getNumberRecipes(); i++) {
            if(nameRecipeTable === recipeList.getRecipes()[i].nameRecipe) {
                recipeSelected = recipeList.getRecipes()[i]
                break
            }
        }
        //Establecemos pues, el objeto recipe también como la receta seleccionada
        recipe = recipeSelected
        let idRecipeSelected = recipe.idRecipe

        //Enviamos los datos al archivo deleteRecipe.php y en función de la respuesta, haremos una cosa u otra
        post("/Proyecto_DAW/Controller/deleteRecipe.php", {idRecipeSelected}).then(data => {
            console.log("La receta ha sido eliminada con éxito")
            //Volvemos a recargar los datos del modal actualizado, con la receta eliminada
            showRecipes()
            fillCalendarOptions()
        }).catch(error => {
            //Si algo falla en el lado del servidor, mostramos el mensaje de error
            console.log(error.mensaje)
        })
    }else {
        console.log("Cancelado deleteRecipe")
    }
}

//Creamos la función para recuperar las recetas de la base de datos y rellenar así el calendario
const fillCalendarOptions = () => {
    
    //Inicializamos nuestra lista de recetas
    recipeList = new ListRecipes()

    //Llamamos a la función getRecipes y, en caso de que se cumpla la promesa,
    //haremos una serie de cosas y mostraremos el mensaje del error en caso contrario
    getRecipes().then(data => {
        //Inicializamos una receta inicial
        recipe = new Recipe()

        for (let i=0; i<data.length; i++) {

            //Comprobamos si el id de la receta ha cambiado o no
            if(data[i].Recipe_id != recipe.idRecipe && recipe.idRecipe != 0) {
                //Si esto se cumple quiere decir que hemos cambiado de receta
                //pusheamos la receta a la lista de recetas e incrementamos su número de recetas
                recipeList.pushRecipes(recipe)
                recipeList.increaseNumberRecipes()
                //Creamos una nueva receta para guardar los nuevos datos
                recipe = new Recipe()
            }

            //Guardamos los nuevos idRecipe y nameRecipe en nuestra variable recipe
            recipe.setIdRecipe(data[i].Recipe_id)
            recipe.setNameRecipe(data[i].Name_recipe)

            //Creamos un objeto JSON que introduciremos en nuestro atributo ingredients de nuestra receta
            let ingredient = {
                Name: data[i].Ingredient,
                Quantity: data[i].Quantity
            }

            //Pusheamos el ingrediente en la receta e incrementamos el número de ingredientes
            recipe.pushIngredientsRecipe(ingredient)
            recipe.increaseNumberIngredients()
        }

        //Una vez salga del bucle, pusehamos la última receta e incrementamos el numero de recetas de nuestra lista
        recipeList.pushRecipes(recipe)
        recipeList.increaseNumberRecipes()
        drawRecipesCalendar(recipeList)
        
    }).catch(error => {
        console.log(error.mensaje)
    })
}

//Creamos la función que pinta las recetas dentro del calendar
const drawRecipesCalendar = (recipeList) => {

    //Como sabemos que tenemos 21 campos que rellenar (7 días de la semana multiplicado por 3 comidas cada día)
    //podemos realizar el siguiente bucle for para rellenar todos los campos del calendario
    for(let i = 0; i<21; i++) {

        //Reinicializamos los posibles valores que pudiera haber previamente en el calendario
        document.getElementsByClassName("total-kcal")[i].innerHTML = "0"
        document.getElementsByClassName("total-proteins")[i].innerHTML = "0"
        document.getElementsByClassName("total-fat")[i].innerHTML = "0"
        document.getElementsByClassName("total-carbohydrates")[i].innerHTML = "0"

        //Seleccionamos el elemento padre al que vamos a añadir el elemento option
        const elementFather = document.getElementsByClassName("data-calendar")[i]

        //Le aplicamos a dicho elemento, las clases de row y de justify-content-md-center para que mantenga el mismo estilo que el resto
        elementFather.classList.add("justify-content-center")
        elementFather.classList.add("align-items-center")

        //Comprobamos si actualmente existe un elemento hijo con la clase select-calendar
        const elementChild = document.getElementsByClassName("select-calendar")[i]

        //Si existe, lo borramos y creamos uno nuevo para que se actualice
        if (elementFather.contains(elementChild)) {
            elementFather.removeChild(elementChild)
        }

        //En cualquier caso, creamos el nuevo elemento que queremos añadir con los datos actualizados
        let elementToAdd = document.createElement("select")
        
        //Le añadimos una clase que llamaremos select-calendar
        elementToAdd.classList.add("select-calendar")

        //Se lo añadimos al elemento data-calendar como hijo
        elementFather.insertBefore(elementToAdd, elementFather.firstChild)

        //Introducimos el valor de elementToAdd en el html
        elementToAdd.innerHTML = "<option hidden> Select a recipe </option>"
        
        for(let j=0; j<recipeList.getNumberRecipes(); j++) {
            //Ampliamos el html de elementToAdd con las diferentes opciones
            elementToAdd.innerHTML += "<option>" + recipeList.getRecipes()[j].nameRecipe + "</option>"
        }

        //Creamos un eventListener para cuando el usuario cambie el valor del select
        elementToAdd.addEventListener("change", () => {
            const recipeSelected = elementToAdd.value
            //Enviamos los datos al archivo getRRecipeValues.php y en función de la respuesta, haremos una cosa u otra
            post("/Proyecto_DAW/Controller/getRRecipeValues.php", {recipeSelected}).then(data => {
                document.getElementsByClassName("total-kcal")[i].innerHTML = data.total_kcal.toFixed(2)
                document.getElementsByClassName("total-proteins")[i].innerHTML = data.total_proteins.toFixed(2)
                document.getElementsByClassName("total-fat")[i].innerHTML = data.total_fat.toFixed(2)
                document.getElementsByClassName("total-carbohydrates")[i].innerHTML = data.total_carbohydrates.toFixed(2)
            }).catch(error => {
                //Si algo falla en el lado del servidor, mostramos el mensaje de error
                console.log(error.mensaje)
            })
        })
    }
}

//Función que guarda el calendario en la base de datos
const saveCalendarRecipes = () => {

    //Rescatamos los elementos select del calendario
    const selectsTable = document.getElementsByClassName("select-calendar")

    //Creamos un array y en cada posición del array vamos a guardar un objeto con toda la información 
    //que nos interesa que es el nombre de la receta y la comida a la que corresponde dicha receta
    let arrayRecipesSelected = []

    //Recorremos los 21 campos de nuestro calendario
    for(let i=0; i<21; i++) {

        //Rescatamos el valor seleccionado por el usuario
        const nameRecipeSelected = selectsTable[i].value

        //Para cada caso, miramos el módulo de i para saber a qué día pertenece la elección del usuario
        switch (i%7) {
            case 0:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Monday"}
                break;
            case 1:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Tuesday"}
                break;
            case 2:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Wednesday"}
                break;
            case 3:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Thrusday"}
                break;
            case 4:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Friday"}
                break;
            case 5:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Saturday"}
                break;
            case 6:
                arrayRecipesSelected[i] = {NameRecipe: nameRecipeSelected, Day: "Sunday"}
                break;
        }

        //Además, en función del valor de i podemos saber si corresponde a un desayuno, almuerzo o cena
        if(i<7) {
            arrayRecipesSelected[i].Meal = "Breakfast"
        }else if(i<14) {
            arrayRecipesSelected[i].Meal = "Lunch"
        }else {
            arrayRecipesSelected[i].Meal = "Dinner"
        }
    }

    //Hacemos una petición post a nuestro archivo saveCalendar.php con el arrayRecipesSelected como datos
    post("/Proyecto_DAW/Controller/saveCalendar.php", {arrayRecipesSelected}).then(data => {
        console.log(data.resultado)
    }).catch(error => {
        //Si algo falla en el lado del servidor, mostramos el mensaje de error
        console.log(error.mensaje)
    })
}

//Función que calcula los valores nutricionales totales del calendario
const calculateTotalValues = () => {

    //Creamos un objeto json anidado que contendrá toda la información de los valores nutricionales por día y por comida
    const totalNutritionalValues = {
        monday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        tuesday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        wednesday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        thursday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        friday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        saturday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        sunday: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        breakfast: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        lunch: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        },
        dinner: {
            kcal: 0,
            proteins: 0,
            fat: 0,
            carbohydrates: 0
        }
    }

    //Creamos cuatro varaibles extras que serán los totales de cada uno de los valores nutricionales
    let totalKcal = 0
    let totalProteins = 0
    let totalFat = 0
    let totalCarbohydrates = 0

    //Recorremos los valores nutricionales totales de los 21 campos de la tabla
    for(let i = 0; i<21; i++) {

        //Creamos cuatro variables que serán los valores nutricionales concretos de esa comida
        const kcalMeal = parseFloat(document.getElementsByClassName("total-kcal")[i].textContent)
        const proteinsMeal = parseFloat(document.getElementsByClassName("total-proteins")[i].textContent)
        const fatMeal = parseFloat(document.getElementsByClassName("total-fat")[i].textContent)
        const carbohydratesMeal = parseFloat(document.getElementsByClassName("total-carbohydrates")[i].textContent)

        //Para cada caso, miramos el módulo de i para saber a qué día pertenece la elección del usuario
        switch (i%7) {
            case 0:
                totalNutritionalValues.monday.kcal += kcalMeal
                totalNutritionalValues.monday.proteins += proteinsMeal
                totalNutritionalValues.monday.fat += fatMeal
                totalNutritionalValues.monday.carbohydrates += carbohydratesMeal
                break;
            case 1:
                totalNutritionalValues.tuesday.kcal += kcalMeal
                totalNutritionalValues.tuesday.proteins += proteinsMeal
                totalNutritionalValues.tuesday.fat += fatMeal
                totalNutritionalValues.tuesday.carbohydrates += carbohydratesMeal
                break;
            case 2:
                totalNutritionalValues.wednesday.kcal += kcalMeal
                totalNutritionalValues.wednesday.proteins += proteinsMeal
                totalNutritionalValues.wednesday.fat += fatMeal
                totalNutritionalValues.wednesday.carbohydrates += carbohydratesMeal
                break;
            case 3:
                totalNutritionalValues.thursday.kcal += kcalMeal
                totalNutritionalValues.thursday.proteins += proteinsMeal
                totalNutritionalValues.thursday.fat += fatMeal
                totalNutritionalValues.thursday.carbohydrates += carbohydratesMeal
                break;
            case 4:
                totalNutritionalValues.friday.kcal += kcalMeal
                totalNutritionalValues.friday.proteins += proteinsMeal
                totalNutritionalValues.friday.fat += fatMeal
                totalNutritionalValues.friday.carbohydrates += carbohydratesMeal
                break;
            case 5:
                totalNutritionalValues.saturday.kcal += kcalMeal
                totalNutritionalValues.saturday.proteins += proteinsMeal
                totalNutritionalValues.saturday.fat += fatMeal
                totalNutritionalValues.saturday.carbohydrates += carbohydratesMeal
                break;
            case 6:
                totalNutritionalValues.sunday.kcal += kcalMeal
                totalNutritionalValues.sunday.proteins += proteinsMeal
                totalNutritionalValues.sunday.fat += fatMeal
                totalNutritionalValues.sunday.carbohydrates += carbohydratesMeal
                break;
        }

        //Además, en función del valor de i podemos saber si corresponde a un desayuno, almuerzo o cena
        if(i<7) {
            totalNutritionalValues.breakfast.kcal += kcalMeal
            totalNutritionalValues.breakfast.proteins += proteinsMeal
            totalNutritionalValues.breakfast.fat += fatMeal
            totalNutritionalValues.breakfast.carbohydrates += carbohydratesMeal
        }else if(i<14) {
            totalNutritionalValues.lunch.kcal += kcalMeal
            totalNutritionalValues.lunch.proteins += proteinsMeal
            totalNutritionalValues.lunch.fat += fatMeal
            totalNutritionalValues.lunch.carbohydrates += carbohydratesMeal
        }else {
            totalNutritionalValues.dinner.kcal += kcalMeal
            totalNutritionalValues.dinner.proteins += proteinsMeal
            totalNutritionalValues.dinner.fat += fatMeal
            totalNutritionalValues.dinner.carbohydrates += carbohydratesMeal
        }

        //Independientemente de a qué día pertenezca y a qué comida, sumamos el valor a la variable correspondiente
        totalKcal += kcalMeal
        totalProteins += proteinsMeal
        totalFat += fatMeal
        totalCarbohydrates += carbohydratesMeal
    }

    //Pintamos dichos valores en el html para mostrárselo al usuario
    const totalMonday = document.getElementById("total-monday")
    totalMonday.innerHTML = "Total kcal: " + totalNutritionalValues.monday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.monday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.monday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.monday.carbohydrates.toFixed(2)

    const totalTuesday = document.getElementById("total-tuesday")
    totalTuesday.innerHTML = "Total kcal: " + totalNutritionalValues.tuesday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.tuesday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.tuesday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.tuesday.carbohydrates.toFixed(2)
    
    const totalWednesday = document.getElementById("total-wednesday")
    totalWednesday.innerHTML = "Total kcal: " + totalNutritionalValues.wednesday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.wednesday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.wednesday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.wednesday.carbohydrates.toFixed(2)
    
    const totalThursday = document.getElementById("total-thursday")
    totalThursday.innerHTML = "Total kcal: " + totalNutritionalValues.thursday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.thursday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.thursday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.thursday.carbohydrates.toFixed(2)
    
    const totalFriday = document.getElementById("total-friday")
    totalFriday.innerHTML = "Total kcal: " + totalNutritionalValues.friday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.friday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.friday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.friday.carbohydrates.toFixed(2)
    
    const totalSaturday = document.getElementById("total-saturday")
    totalSaturday.innerHTML = "Total kcal: " + totalNutritionalValues.saturday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.saturday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.saturday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.saturday.carbohydrates.toFixed(2)
    
    const totalSunday = document.getElementById("total-sunday")
    totalSunday.innerHTML = "Total kcal: " + totalNutritionalValues.sunday.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.sunday.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.sunday.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.sunday.carbohydrates.toFixed(2)

    const totalBreakfast = document.getElementById("total-breakfast")
    totalBreakfast.innerHTML = "Total kcal: " + totalNutritionalValues.breakfast.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.breakfast.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.breakfast.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.breakfast.carbohydrates.toFixed(2)
    
    const totalLunch = document.getElementById("total-lunch")
    totalLunch.innerHTML = "Total kcal: " + totalNutritionalValues.lunch.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.lunch.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.lunch.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.lunch.carbohydrates.toFixed(2)
    
    const totalDinner = document.getElementById("total-dinner")
    totalDinner.innerHTML = "Total kcal: " + totalNutritionalValues.dinner.kcal.toFixed(2) + "<br> Total proteins: " + totalNutritionalValues.dinner.proteins.toFixed(2) + "<br> Total fat: " + totalNutritionalValues.dinner.fat.toFixed(2) + "<br> Total carbohydrates: " + totalNutritionalValues.dinner.carbohydrates.toFixed(2)

    const totalCalendar = document.getElementById("total-calendar")
    totalCalendar.innerHTML = "Total kcal: " + totalKcal.toFixed(2) + "<br> Total proteins: " + totalProteins.toFixed(2) + "<br> Total fat: " + totalFat.toFixed(2) + "<br> Total carbohydrates: " + totalCarbohydrates.toFixed(2)
}
