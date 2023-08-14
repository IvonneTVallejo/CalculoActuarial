/*var idBuscado = 0;
*/
$(document).ready(function() {
            $("#btnNuevoUsuario").click(function() {
                $("#nuevoUsuario").show();
                $("#actualizarUsuario").hide();
            });

            $("#btnActualizarUsuario").click(function() {
                $("#actualizarUsuario").show();
                $("#nuevoUsuario").hide();
            });
        });

            
// Funciones para limpiar los campos de los modales insertar y actualizar
function limpiarCampos() {
    $("#username").val("");
    $("#password").val("");
}

function limpiarCamposActualizados() {
    $("#usernameUP").val("");
    $("#passwordUP").val("");
}


// Funcion para registrar un empleado
function registrarNuevoUsuario() {
    if ($("#username").val().length == 0 || $("#password").val().length == 0) {
            Swal.fire({
                text: '¡Por favor complete todos los campos!',
                icon: 'warning',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
    } else {
        const url = 'http://localhost:8085/libertadores/usuario';
        const datos = {
            username: $("#username").val(),
            password: $("#password").val(),
            tipoUsuario: $("#tipo").val(),
            estado: "Activo",
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    text: '¡Usuario creado exitosamente!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                })
                    .then(() => {
                        limpiarCampos();
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    text: 'Usuario ya existe en la base de datos!',
                    icon: 'error',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                });
            });
    }
}

/*
// Funcion para actualizar un empleado
function actualizarEmpleado() {
    if ($("#idUP").val().length == 0 || $("#nombresUP").val().length == 0 || $("#apellidosUP").val().length == 0 || $("#direccionUP").val().length == 0 || $("#telefonoUP").val().length == 0
        || $("#correoUP").val().length == 0 || $("#fechaNacUP").val().length == 0) {
            Swal.fire({
                text: '¡Por favor complete todos los campos!',
                icon: 'warning',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
    } else {
        const url = 'http://localhost:8085/libertadores/empleado/';
        var id = idBuscado;
        var tipo = $("#tipoUP").val();
        var iden = $("#idUP").val();
        var nombres = $("#nombresUP").val();
        var apellidos = $("#apellidosUP").val();
        var direccion = $("#direccionUP").val();
        var telefono = $("#telefonoUP").val();
        var correo = $("#correoUP").val();
        var fechaNac = $("#fechaNacUP").val();
        var genero = $("#generoUP").val();
        var datos = {
            idEmpleado: id,
            tipoDocumentoEmpleado: tipo,
            identificadorEmpleado: iden,
            nombresEmpleado: nombres,
            apellidosEmpleado: apellidos,
            direccionEmpleado: direccion,
            telefonoEmpleado: telefono,
            correoEmpleado: correo,
            fechaNacimientoEmpleado: fechaNac,
            genero: genero,

        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    text: '¡Empleado actualizado exitosamente!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    },
                })
                    .then(() => {
                        consultarEmpleado();
                        window.location.reload();
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    text: '¡Ha ocurrido un error!',
                    icon: 'error',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                });
            });
    }
}

// Funcion para buscar un empleado y poder modificarlo 
function buscarEmpleado(id) {
    $.ajax({
        url: "http://localhost:8085/libertadores/usuario//" + id,
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.idEmpleado != null) {
                idBuscado = response.idEmpleado;
                $("#tipoUP").val(response.tipoDocumentoEmpleado);
                $("#idUP").val(response.identificadorEmpleado);
                $("#nombresUP").val(response.nombresEmpleado);
                $("#apellidosUP").val(response.apellidosEmpleado);
                $("#direccionUP").val(response.direccionEmpleado);
                $("#telefonoUP").val(response.telefonoEmpleado);
                $("#correoUP").val(response.correoEmpleado);
                $("#fechaNacUP").val(response.fechaNacimientoEmpleado);
                $("#generoUP").val(response.genero);
            } else {
                Swal.fire({
                    text: '¡No se encontró el registro!',
                    icon: 'error',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                });
            }
        },
        error: function (xhr, status) {
            Swal.fire({
                text: '¡Ha ocurrido un error!',
                icon: 'error',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
        }
    });
}


*/
