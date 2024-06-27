//Creamos nuestra función get que recibirá una url del archivo php que queramos llamar
//para ello usaremos la función fetch de javascript, cuya documentación dejaré aquí además de en la memoria
//y usaremos esta vez el metodo GET y "same-origin" e "include" porque queremos comprobar si hay sesión activa
//en el servidor (y, como no queremos enviar nada, solo comprobar algo del servidor, usamos GET en lugar de POST)
//https://developer.mozilla.org/es/docs/Web/API/fetch
const get = (url) => fetch(url, {
    method: "GET",
    mode: "same-origin",
    credentials: "include"
}).then(response => {
    //La respuesta a dicha petición será una nueva promesa con los dos valores que nos interesan,
    //que son el ok de que todo ha ido bien y un json con los valores de la respuesta.
    //El ok lo recuperamos con un response.ok, sin embargo, el json no podemos recuperarlo directamente
    //sino que debemos obtenerlo llamando al método response.json(), que nos da una promesa, así que
    //vamos a crearnos una promesa que envuelva todo este procedimiento,
    //llamando primero al response.json() y cuando este termina, resolvemos la promesa con el ok y el json
    return new Promise(resolve => response.json().then(json => resolve({ok: response.ok, json})))
}).then(data => {
    //En caso de que todo vaya bien devolvemos los datos en formato json y
    //en caso contrario, lanzamos un error con los datos en formato json
    if(data.ok) {
        return data.json
    } else {
        throw data.json
    }
})

//Creamos nuestra función post que recibirá una url del archivo php que queramos llamar
//y un diccionario con los valores que queremos mandar a dicha url, para ello usaremos 
//la función fetch de javascript, cuya documentación dejaré aquí además de en la memoria
//https://developer.mozilla.org/es/docs/Web/API/fetch
const post = (url, body) => fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
}).then(response => {
    //La respuesta a dicha petición será una nueva promesa con los dos valores que nos interesan,
    //que son el ok de que todo ha ido bien y un json con los valores de la respuesta.
    //El ok lo recuperamos con un response.ok, sin embargo, el json no podemos recuperarlo directamente
    //sino que debemos obtenerlo llamando al método response.json(), que nos da una promesa, así que
    //vamos a crearnos una promesa que envuelva todo este procedimiento,
    //llamando primero al response.json() y cuando este termina, resolvemos la promesa con el ok y el json
    return new Promise(resolve => response.json().then(json => resolve({ok: response.ok, json})))
}).then(data => {
    //En caso de que todo vaya bien devolvemos los datos en formato json y
    //en caso contrario, lanzamos un error con los datos en formato json
    if(data.ok) {
        return data.json
    } else {
        throw data.json
    }
})

//Creamos una función para que le pregunte a nuestro servidor si hay sesión activa o no y si esta pertenece a superadmin
const checkSession = () => {

    //Llamamos a la función get y establecemos una promesa haciendo una serie de cosas
    //si la promesa se cumple y otras si no lo hace
    get("/Proyecto_DAW/Controller/checkSession.php").then(data => {
        if(data.active_session === true && data.rol_user === "superadmin") {
            document.getElementById("pageLoaded").style.visibility = "visible"
            document.getElementsByTagName("body")[0].style.backgroundColor = "#f0f2f5"
        }
        console.log(data.active_session)
        console.log(data.user_id)
        console.log(data.rol_user)
    }).catch(error => {
        location.href = "userViewRejected.html"
        console.log(error.mensaje)
    })
}

//Creamos una función para cerrar nuestra sesión en nuestro servidor
const closeSession = () => {

    //Llamamos a la función get y establecemos una promesa haciendo una serie de cosas
    //si la promesa se cumple y otras si no lo hace
    get("/Proyecto_DAW/Controller/closeSession.php").then(data => {
        location.href = "index.html"
    }).catch(error => {
        console.log(error.mensaje)
    })
}

//Función que recoge los datos de todos los usuarios
const getUsers = () => {

    //Llamamos a la función get y establecemos una promesa haciendo una serie de cosas
    //si la promesa se cumple y otras si no lo hace
    get("/Proyecto_DAW/Controller/getUsers.php").then(data => {
        drawUsers(data)
    }).catch(error => {
        console.log(error.mensaje)
    })    
}

//Función que pinta los datos de todos los usuarios
const drawUsers = (users) => {
    //Recuperamos el elemento padre donde vamos a insertar todos los nuevos datos
    const table = document.getElementById("table-users")

    //Limpiamos el html de cualquier dato anterior que pudiera tener
    table.innerHTML = "<thead><tr><th>id</th><th>username</th><th>email</th><th>rol user</th><th>action</th></tr></thead>"

    //Recorremos el array de usuarios que nos ha llegado del backend
    for(let i=0; i<users.length; i++) {
        //Añadimos una nueva fila a la tabla con sus diferentes elementos
        const row = table.insertRow()
        const cellIdUser = row.insertCell(0)
        const cellNameUser = row.insertCell(1)
        const cellEmailUser = row.insertCell(2)
        const cellRolUser = row.insertCell(3)
        const cellAction = row.insertCell(4)

        //Añadimos los valores de la base de datos en su respectivo campo
        cellIdUser.textContent = users[i].user_id
        cellNameUser.textContent = users[i].username
        cellEmailUser.textContent = users[i].email
        cellRolUser.textContent = users[i].rol_user
        
        //Creamos dos botones que vamos a añadir en la última celda de la tabla y que nos permitirán
        //editar o eliminar la receta de la tabla y de nuestra base de datos
        const banUserButton = document.createElement("button")
        banUserButton.textContent = "Ban user"
        
        //Si el usuario ha sido baneado previamente, desactivamos el botón
        //y, en caso contrario, añadimos un eventlistener al botón
        if(cellRolUser.textContent === "banned") {
            banUserButton.disabled = true
        }else {
            banUserButton.addEventListener("click", () => banUser(row))
        }
        //Añadimos el botón a su respectiva celda
        cellAction.appendChild(banUserButton)
    }
}

//Función que proporcionándole unos datos de usuario, permitirá banearlo
const banUser = (row) => {

    //Rescatamos el valor del id del usuario que se quiere banear
    const tdList = row.querySelectorAll('td')
    const idUser = tdList[0].textContent

    //Rescatamos el elemento button que se ha creado en la fila correspondiente
    const banUserButton = tdList[tdList.length-1].childNodes[0]

    //Enviamos los datos al archivo banUser.php y en función de la respuesta, haremos una cosa u otra
    post("/Proyecto_DAW/Controller/banUser.php", {idUser}).then(data => {
        console.log("El usuario ha sido baneado")
        //Cambiamos el valor del campo de rol user y deshabilitamos el botón
        tdList[3].textContent = "banned"
        banUserButton.disabled = true
    }).catch(error => {
        //Si algo falla en el lado del servidor, mostramos el mensaje de error
        console.log(error.mensaje)
    })
}