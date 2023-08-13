
/**
 * Funcion para Validar login
 */

$("#login").click(function () {
    let username= $("#username").val();
    let password =  $("#password").val();
    if (username == "" || $.trim(password) == "") {
        alert("Por favor complete todos los campos");
    } else {
        const data = {
            username: username,
            password: password,
        };
        return $.ajax({
            url: "http://localhost:8080/libertadores/authenticate" ,
            method: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                    $("#token").val(response.token);
                    window.location.href = './pages/home.html';
            }
        });
    }
});

/**
 * Funcion para hacer el registro de una nueva cuenta
 */

$("#registrar").click(function () {
    if ($("#emailRegistro").val() == "" || $.trim($("#passwordRegistro").val()) == "" || $.trim($("#userRegistro").val()) == "" || $.trim($("#passwordRegistro2").val()) == "") {
        alert("Por favor complete todos los campos");
    } else {
        if ($("#passwordRegistro").val() != $("#passwordRegistro2").val()) {
            alert("Las contraseñas no coinciden");
        } else {
            let datos = {
                username: $("#usernameRegistro").val(),
                password: $("#passwordRegistro").val(),
                name: $("#userRegistro").val()
            };
            $.ajax({
                url: "http://localhost:8080/api/user/new",
                method: "POST",
                dataType: "json",
                data: JSON.stringify(datos),
                contentType: "application/json",
                Headers: {
                    "Content-Type": "application/json"
                },
                statusCode: {
                    201: function (response) {
                        if (response.id != null) {  //Condicional para validar la creacion de una cuenta o alerta de cuenta ya existente
                            emailBuscado = response.email;
                            $("#emailRegistro").val("");
                            $("#passwordRegistro").val("");
                            $("#passwordRegistro2").val("");
                            $("#userRegistro").val("");
                            alert("Cuenta creada de forma correcta");
                            window.location.reload()
                        } else {
                            alert("Email ya existe");
                        }
                    },
                    400: function (response) {
                        alert("An error has occurred!!");
                    }
                }
            });
        }
    }
});

/**
 * Funcion para resaltar los campos de las contraseñas cuando no coinciden
 */

$("#passwordRegistro2").change(function () {
    if ($("#passwordRegistro").val() != $("#passwordRegistro2").val()) {
        $("#passwordRegistro2").css("border-color", "red");
        $("#passwordRegistro").css("border-color", "red");
    } else {
        $("#passwordRegistro2").css("border-color", "");
        $("#passwordRegistro").css("border-color", "");
    }
});