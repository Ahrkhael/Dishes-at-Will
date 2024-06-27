//Creamos una función para que le pregunte a nuestro servidor si hay sesión activa o no
const checkSession = () => {

    //Llamamos a la función get y establecemos una promesa haciendo una serie de cosas
    //si la promesa se cumple y otras si no lo hace
    get("/Proyecto_DAW/Controller/checkSession.php").then(data => {
        if(data.active_session === true && data.rol_user === "user") {
            document.getElementById("pageLoaded").style.visibility = "visible"
            document.getElementsByTagName("body")[0].style.backgroundColor = "#5096ae"
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

