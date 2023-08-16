var idBuscado = 0;

$(document).ready(function () {
    consultarEmpleado();
});

const botonActualizar = document.getElementById('btnNuevoRegistro');
botonActualizar.addEventListener('click', function () {
    limpiarCampos();
});

// Funciones para limpiar los campos de los modales insertar y actualizar
function limpiarCampos() {
    $("#tipo").val("");
    $("#id").val("");
    $("#nombres").val("");
    $("#apellidos").val("");
    $("#direccion").val("");
    $("#telefono").val("");
    $("#correo").val("");
    $("#fechaNac").val("");
    $("#genero").val("");
}

// Funcion para listar todos los empleados 
function consultarEmpleado() {
    $.ajax({
        url: "http://localhost:8085/libertadores/empleado/general",
        type: "GET",
        dataType: "json",
        success: function (response) {
            // Ordenar el array response en reverso basado en el ID
            response.sort(function(a, b) {
                return b.idEmpleado - a.idEmpleado;
            });

            $("#contenidoTablaEmpleado").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.tipoDocumentoEmpleado));
                row.append($("<td>").text(element.identificadorEmpleado));
                row.append($("<td>").text(element.nombresEmpleado));
                row.append($("<td>").text(element.apellidosEmpleado));
                row.append($("<td>").text(element.telefonoEmpleado));
                row.append($("<td>").text(element.correoEmpleado));
                row.append($("<td>").text(element.fechaNacimientoEmpleado));
                row.append($("<td>").text(element.genero));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-warning btn-block w-100" style="font-size: 12px;" data-target="#actualizarEmpleadoModal" data-toggle="modal" onclick="buscarEmpleado(' + element.idEmpleado + ')">Editar</button>'));
                $("#contenidoTablaEmpleado").append(row);
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


// Funcion para registrar un empleado
function crearEmpleado() {
    if ($("#id").val().length == 0 || $("#nombres").val().length == 0 || $("#apellidos").val().length == 0 || $("#direccion").val().length == 0 || $("#telefono").val().length == 0
        || $("#correo").val().length == 0 || $("#fechaNac").val().length == 0 || $("#tipo").val() == "" || $("#genero").val() == "") {
            Swal.fire({
                text: '¡Por favor complete todos los campos!',
                icon: 'warning',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
    } else {
        const url = 'http://localhost:8085/libertadores/empleado';
        const datos = {
            tipoDocumentoEmpleado: $("#tipo").val(),
            identificadorEmpleado: $("#id").val(),
            nombresEmpleado: $("#nombres").val(),
            apellidosEmpleado: $("#apellidos").val(),
            direccionEmpleado: $("#direccion").val(),
            telefonoEmpleado: $("#telefono").val(),
            correoEmpleado: $("#correo").val(),
            fechaNacimientoEmpleado: $("#fechaNac").val(),
            genero: $("#genero").val(),
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
                    text: '¡Empleado creado exitosamente!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                })
                    .then(() => {
                        consultarEmpleado();
                        limpiarCampos();
                        window.location.reload()
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    text: '¡Empleado ya existe en la base de datos!',
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
        url: "http://localhost:8085/libertadores/empleado/" + id,
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

// Funcion para filtrar tabla por medio del input 
$(document).ready(function () {
    $("#filtroInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#contenidoTablaEmpleado tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
