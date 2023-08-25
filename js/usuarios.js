var idBuscado = 0;

$(document).ready(function () {
    consultarUsuarios();
});

$(document).ready(function () {
    $("#btnNuevoUsuario").click(function () {
        $("#nuevoUsuario").show();
        $("#actualizarUsuario").hide();
        $("#actualizarContrasena").hide();
        $("#div1").hide();
    });

    $("#btnActualizarUsuario").click(function () {
        $("#actualizarUsuario").show();
        $("#nuevoUsuario").hide();
        $("#actualizarContrasena").hide();
        $("#div1").hide();
        window.location(reload);
    });

    $("#btnCambiarContrasena").click(function () {
        $("#actualizarContrasena").show();
        $("#actualizarUsuario").hide();
        $("#nuevoUsuario").hide();
        $("#div1").hide();
        window.location(reload);
    });
});

// Funcion para limpiar campos en formulario actualizar cuando se presiona el boton 

const botonActualizar = document.getElementById('btnActualizarUsuario');
botonActualizar.addEventListener('click', function () {
    limpiarCamposActualizados();
});

const botonNuevoUsuario = document.getElementById('btnNuevoUsuario');
botonNuevoUsuario.addEventListener('click', function () {
    limpiarCampos();
});


// Funciones para limpiar los campos de los modales insertar y actualizar
function limpiarCampos() {
    $("#username").val("");
    $("#password").val("");
    $("#tipo").val("");
}

function limpiarCamposActualizados() {
    $("#usernameUP").val("");
    $("#passwordUP").val("");
    $("#inputUsuario").val("");
    $("#tipoUP").val("");
    $("#estadoUP").val("");

}

// Funcion para registrar un empleado
function registrarNuevoUsuario() {
    if ($("#nombre").val().length == 0 || $("#password").val().length == 0 || $("#tipo").val() == "") {
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
            nombre: $("#nombre").val(),
            username: $("#username").val(),
            password: $("#password").val(),
            tipoUsuario: $("#tipo").val(),
            estado: "activo",
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
                        window.location.reload();
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


// Funcion para modificar contraseña 
function cambiarContrasena() {
    if ( $("#passwordCP").val() == "") {
        Swal.fire({
            text: '¡Por favor ingrese una contraseña!',
            icon: 'warning',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        });
    } else {
        const url = 'http://localhost:8085/libertadores/usuario/password';
        var id = $("#idCP").val();
        var password = $("#passwordCP").val();

        var datos = {
            idUsuario: id,
            password: password,

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
                    text: '¡Cambio de contraseña exitoso!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    },
                })
                    .then(() => {
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


function actualizarUsuario() {
    if ($("#nameUP").val().length == 0 || $("#tipoUP").val() == "" || $("#estadoUP").val() == "") {
        Swal.fire({
            text: '¡Por favor complete todos los campos!',
            icon: 'warning',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        });
    } else {
        const url = 'http://localhost:8085/libertadores/usuario/';
        var id = $("#idUP").val();
        var nombre = $("#nameUP").val();
        var tipo = $("#tipoUP").val();
        var estado = $("#estadoUP").val();

        var datos = {
            idUsuario: id,
            nombre: nombre,
            tipoUsuario: tipo,
            estado: estado,
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
                    text: '¡Usuario actualizado exitosamente!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    },
                })
                    .then(() => {
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

function consultarUsuarios() {

    $.ajax({
        url: "http://localhost:8085/libertadores/usuario/general",
        type: "GET",
        dataType: "json",
        success: function (response) {
            

            $("#contenidoTablaUsuarios").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.nombre));
                row.append($("<td>").text(element.username));
                row.append($("<td>").text(element.tipoUsuario));
                row.append($("<td>").text(element.estado));
                $("#contenidoTablaUsuarios").append(row);
            });
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

// Funcion para obtener la informacion del usuario
const apiUrl = 'http://localhost:8085/libertadores/usuario/general';
const searchInput = document.getElementById('inputUsuario');
const autocompleteResults = document.getElementById('listaUsuario');

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const usuarioArray = data.map(item => {
            return {
                id: item.idUsuario,
                username: item.username,
                nombre: item.nombre,
                tipo: item.tipoUsuario,
                estado: item.estado,
            };
        });

        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();
            autocompleteResults.innerHTML = '';

            const filteredResults = usuarioArray.filter(item => {
                return item.username.toLowerCase().includes(searchTerm);
            });

            filteredResults.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item.username;
                listItem.addEventListener('click', () => {
                    searchInput.value = item.username;
                    $("#idUP").val(item.id);
                    $("#nameUP").val(item.nombre);
                    $("#tipoUP").val(item.tipo);
                    $("#estadoUP").val(item.estado);
                    autocompleteResults.style.display = 'none';
                });
                autocompleteResults.appendChild(listItem);
            });

            if (searchTerm === '') {
                autocompleteResults.style.display = 'none';
            } else {
                autocompleteResults.style.display = 'block';
            }
        });

    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });


const apiUrl2 = 'http://localhost:8085/libertadores/usuario/general';
const searchInput2 = document.getElementById('inputUsuarioCP');
const autocompleteResults2 = document.getElementById('listaUsuarioCP');

fetch(apiUrl2)
    .then(response => response.json())
    .then(data => {
        const idAndNameArray2 = data.map(item => {
            return {
                id: item.idUsuario,
                username: item.username,
            };
        });

        searchInput2.addEventListener('input', function () {
            const searchTerm2 = searchInput2.value;
            autocompleteResults2.innerHTML = '';

            const filteredResults2 = idAndNameArray2.filter(item => {
                return item.username.toLowerCase().includes(searchTerm2);
            });

            filteredResults2.forEach(item => {
                const listItem2 = document.createElement('li');
                listItem2.textContent = item.username;
                listItem2.addEventListener('click', () => {
                    searchInput2.value = item.username;
                    $("#idCP").val(item.id);
                    $("#usernameCP").val(item.username);
                    autocompleteResults2.style.display = 'none';
                });
                autocompleteResults2.appendChild(listItem2);
            });

            if (searchTerm2 === '') {
                autocompleteResults2.style.display = 'none';
            } else {
                autocompleteResults2.style.display = 'block';
            }
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
