//Vamos a crearnos una función llamada login que va a ser una constante
//y vamos a utilizar la función flecha para crearla
const login = () => {

    //Recuperamos los datos introducidos por el usuario en los inputs del HTML
    const username = document.getElementById("username").value
    const pass = document.getElementById("pass").value

    //Comprobamos que los campos introducidos no están vacíos y que las contraseñas coinciden
    if (username === "") {
        document.getElementById("mensaje").innerHTML = "El campo usuario debe ser rellenado"
        document.getElementById("username").classList.add("error")
    }else if (pass === "") {
        document.getElementById("username").classList.remove("error")
        document.getElementById("mensaje").innerHTML = "El campo contraseña debe ser rellenado"
        document.getElementById("pass").classList.add("error")
    }else {
        //Llamamos a la función post y creamos una promesa de JavaScript
        //haciendo una serie de cosas si la promesa se cumple o mostrando un error si no
        post("/Proyecto_DAW/Controller/login.php", {username, pass}).then(data => {
            //En caso de que recibamos un resultado (la promesa se ha cumplido)
            //comprobamos qué resultado nos ha devuelto y redirigimos a la vista que queramos
            if(data.resultado[1] === "user") {
                window.location.href = "userView.html"
            }else if(data.resultado[1] === "superadmin"){
                window.location.href = "superadmin.html"
            }else if(data.resultado[1] === "banned"){
                window.location.href = "userBanned.html"
            }
        }).catch(error => {
            document.getElementById("mensaje").innerHTML = error.mensaje
        })
    }
}

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