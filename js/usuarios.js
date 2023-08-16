var idBuscado = 0;

$(document).ready(function () {
    $("#btnNuevoUsuario").click(function () {
        $("#nuevoUsuario").show();
        $("#actualizarUsuario").hide();
        $("#actualizarContrasena").hide();
    });

    $("#btnActualizarUsuario").click(function () {
        $("#actualizarUsuario").show();
        $("#nuevoUsuario").hide();
        $("#actualizarContrasena").hide();
    });

    $("#btnCambiarContrasena").click(function () {
        $("#actualizarContrasena").show();
        $("#actualizarUsuario").hide();
        $("#nuevoUsuario").hide();
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
    if ($("#username").val().length == 0 || $("#password").val().length == 0 || $("#tipo").val() == "") {
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


// Funcion para actualizar un empleado
function actualizarUsuario() {
    if ($("#usernameUP").val().length == 0 || $("#passwordUP").val().length == 0 || $("#tipoUP").val() == "" 
        || $("#estadoUP").val() == "" ) {
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
        var username = $("#usernameUP").val();
        var password = $("#passwordUP").val();
        var tipo = $("#tipoUP").val();
        var estado = $("#estadoUP").val();

        var datos = {
            idUsuario: id,
            username: username,
            password: password,
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
                password: item.password,
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
                    $("#usernameUP").val(item.username);
                    $("#passwordUP").val(item.password);
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


