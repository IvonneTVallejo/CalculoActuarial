/*var idBuscado = 0;

$(document).ready(function () {
    consultarEmpleado();
});*/

$("#salarioBase").on({
    "focus": function (event) {
        $(event.target).select();
    },
    "keyup": function (event) {
        $(event.target).val(function (index, value) {
            return value.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        });
    }
});

// Funciones para limpiar los campos de los modales insertar y actualizar
function limpiarCampos() {
    $("#empleador").val("");
    $("#empleado").val("");
    $("#fechaNac").val("");
    $("#genero").val("");
    $("#fechaIni").val("");
    $("#fechaFin").val("");
    $("#salarioBase").val("$ ");
    $("#total").val("$ ");
}
/*

// Funcion para listar todos los empleados 
function consultarEmpleado() {

    $.ajax({
        url: "http://localhost:8085/libertadores/empleado/general",
        type: "GET",
        dataType: "json",
        success: function (response) {
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

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" style="font-size: 12px;" data-target="#actualizarEmpleadoModal" data-toggle="modal" onclick="buscarEmpleado(' + element.idEmpleado + ')">Editar</button>'));
                $("#contenidoTablaEmpleado").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}*/

// Funcion para generar un calculo actuarial
function generaCalculo() {
    if ($("#empleador").val().length == 0 || $("#empleado").val().length == 0 || $("#fechaNac").val().length == 0 || $("#genero").val().length == 0 || $("#fechaIni").val().length == 0
        || $("#fechaFin").val().length == 0 || $("#salarioBase").val().length == 0) {
        Swal.fire({
            text: '¡Por favor complete todos los campos!',
            icon: 'warning',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        });
    } else {
        Swal.fire({
            title: '¿Desea continuar?',
            text: "Por favor revise que la información este correcta, una vez calculado ya no se podrá modificar el registro",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0f5044',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            customClass: {
                popup: 'my-swal-popup',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: '¡Cálculo realizado con éxito!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                })
            }
        })
        /*
        // Inicio operacion con el back
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
                alert('EMPLEADO CREADO EXITOSAMENTE!!:', data);
                consultarEmpleado();
                limpiarCampos();
                window.location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
            });*/
    }
}



/*

// Funcion para registrar un empleado
function crearEmpleado() {
    if ($("#id").val().length == 0 || $("#nombres").val().length == 0 || $("#apellidos").val().length == 0 || $("#direccion").val().length == 0 || $("#telefono").val().length == 0
        || $("#correo").val().length == 0 || $("#fechaNac").val().length == 0) {
        alert("COMPLETE TODOS LOS CAMPOS!!")
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
                alert('EMPLEADO CREADO EXITOSAMENTE!!:', data);
                consultarEmpleado();
                limpiarCampos();
                window.location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// Funcion para actualizar un empleado
function actualizarEmpleado() {
    if ($("#idUP").val().length == 0 || $("#nombresUP").val().length == 0 || $("#apellidosUP").val().length == 0 || $("#direccionUP").val().length == 0 || $("#telefonoUP").val().length == 0
        || $("#correoUP").val().length == 0 || $("#fechaNacUP").val().length == 0) {
        alert("COMPLETE TODOS LOS CAMPOS!!")
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
                alert('EMPLEADO ACTUALIZADO EXITOSAMENTE!!:', data);
                consultarEmpleado();
                window.location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
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
                alert("The record was not found!!");
            }
        },
        error: function (xhr, status) {
            alert("An error has occurred");
        }
    });
}

*/
// Funcion para filtrar tabla por medio del input 
$(document).ready(function () {
    $("#filtroInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#contenidoTablaEmpleado tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


// Funcion para descargar de excel
document.getElementById("exportarExcel").addEventListener("click", function () {
    const tabla = document.getElementById("tablaCalculo");
    const filas = tabla.getElementsByTagName("tr");

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(tabla);
    XLSX.utils.book_append_sheet(workbook, sheet, "Hoja1");  

    XLSX.writeFile(workbook, "Reporte_Calculo_Actuarial.xlsx");
});

