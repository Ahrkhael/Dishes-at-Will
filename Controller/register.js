//Vamos a crearnos una función llamada register que va a ser una constante
//y vamos a utilizar la función flecha para crearla
const register = () => {

    //Recuperamos los datos introducidos por el usuario en los inputs del HTML
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const pass = document.getElementById("pass").value
    const confirmPass = document.getElementById("confirmPass").value

    //Comprobamos que los campos introducidos no están vacíos, que es un email válido
    //y que las contraseñas coinciden y no están vacías
    if (username === "") {
        document.getElementById("mensaje").innerHTML = "El campo usuario debe ser rellenado"
        document.getElementById("username").classList.add("error")
    }else if (!validateEmail(email)) {
        document.getElementById("mensaje").innerHTML = "El email introducido no es válido"
        document.getElementById("username").classList.remove("error")
        document.getElementById("email").classList.add("error")
    }else if (pass === "") {
        document.getElementById("username").classList.remove("error")
        document.getElementById("email").classList.remove("error")
        document.getElementById("mensaje").innerHTML = "El campo contraseña debe ser rellenado"
        document.getElementById("pass").classList.add("error")
    }else if (pass !== confirmPass) {
        document.getElementById("username").classList.remove("error")
        document.getElementById("email").classList.remove("error")
        document.getElementById("pass").classList.remove("error")
        document.getElementById("mensaje").innerHTML = "Las contraseñas no coinciden"
        document.getElementById("confirmPass").classList.add("error")
    }else {
        //Llamamos a la función post y creamos una promesa de JavaScript
        //haciendo una serie de cosas si la promesa se cumple o mostrando un error si no
        post("/Proyecto_DAW/Controller/register.php", {username, email, pass, confirmPass}).then(data => {
            //Si todo ha ido bien, redireccionamos a la vista index.html para que el usuario pueda logearse
            location.href = "index.html"
        }).catch(error => {
            //Si algo falla en el lado del servidor, mostramos el mensaje de error
            document.getElementById("mensaje").innerHTML = error.mensaje
        })
    }
}

//Creamos nuestra función para validar el email introducido por el usuario con una expresión regex
//devolverá true en caso de que sea un email válido y false en caso contrario
const validateEmail = (email) => {
    let regex = /\S+@\S+\.\S+/
    return regex.test(email)
};

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
