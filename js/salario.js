$(document).ready(function () {
    consultarSalarios();
    consultarEdades();
});

$(document).ready(function () {
    $("#opcionSalario").click(function () {
        $("#salarios").show();
        $("#edades").hide();
    });

    $("#opcionEdades").click(function () {
        $("#salarios").hide();
        $("#edades").show();
    });
});



$("#salario").on({
    "focus": function (event) {
        $(event.target).select();
    },
    "keyup": function (event) {
        $(event.target).val(function (index, value) {
            value = value.replace(/\D/g, "")
                .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");

            return "$ " + value; 
        });
    }
});

// Funciones para limpiar los campos 
function limpiarCampos() {
    $("#ano").val("");
    $("#salario").val("");
}


// Funcion para listar todos los empleados 
function consultarSalarios() {

    $.ajax({
        url: "http://localhost:8085/libertadores/salario/general",
        type: "GET",
        dataType: "json",
        success: function (response) {
            response.sort(function (a, b) {
                return b.ano - a.ano;
            });

            $("#contenidoTablaSalario").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.ano));

                var formattedSalary = element.salario.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
                row.append($("<td>").text(formattedSalary));
                $("#contenidoTablaSalario").append(row);
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
function insertarSalario() {
    if ($("#ano").val().length === 0 || $("#salario").val().length === 0) {
        Swal.fire({
            text: '¡Por favor complete todos los campos!',
            icon: 'warning',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        });
    } else {
        const url = 'http://localhost:8085/libertadores/salario';

        const year = new Date().getFullYear();

        const salarioFormateado = parseFloat($("#salario").val().replace(/[^0-9.]/g, ''));

        if (parseInt($("#ano").val()) !== year) {
            Swal.fire({
                text: '¡El año debe ser el año actual!',
                icon: 'error',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
            return;
        }

        const datos = {
            ano: year, 
            salario: salarioFormateado,
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
                    text: 'Salario creado exitosamente!',
                    icon: 'success',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                })
                    .then(() => {
                        consultarSalarios();
                        limpiarCampos();
                        window.location.reload();
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    text: '¡Salario ya existe en la base de datos!',
                    icon: 'error',
                    confirmButtonColor: '#0f5044',
                    customClass: {
                        popup: 'my-swal-popup',
                    }
                });
            });
    }
}


// Funcion para filtrar tabla por medio del input 
$(document).ready(function () {
    $("#filtroInput").on("keyup", function () {
        var yearFilter = $(this).val().toLowerCase();

        $("#contenidoTablaSalario tr").each(function () {
            var yearCell = $(this).find("td:eq(0)").text().toLowerCase();
            var isVisible = yearCell.indexOf(yearFilter) > -1;
            $(this).toggle(isVisible);
        });
    });
});


function consultarEdades() {
    $.ajax({
        url: "http://localhost:8085/libertadores/edadReferencia/general",
        type: "GET",
        dataType: "json",
        success: function (response) {
            response.sort(function(a, b) {
                return b.ano - a.ano;
            });

            $("#contenidoTablaEdades").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.genero));
                
                var edadInput = $("<input>").attr({
                    type: "number",
                    value: element.edad,
                    id: "input_" + element.idEdad 
                }).addClass("editable-edad");
                
                var edadCell = $("<td>").append(edadInput);
                row.append(edadCell);

                var botonActualizar = $("<button>").text("Actualizar").addClass("btn-actualizar");
                var botonActualizar = $("<button>").text("Actualizar").addClass("btn-actualizar btn btn-success");

                row.append($("<td>").append(botonActualizar));
                
                $("#contenidoTablaEdades").append(row);
            });

            $(".btn-actualizar").on("click", function() {
                var idEdad = $(this).closest("tr").find("input").attr("id").split("_")[1];
                var nuevaEdad = $(this).closest("tr").find("input").val();
                var genero = $("#contenidoTablaEdades tr:first-child").find("td:first-child").text();
                actualizarEdad(idEdad, nuevaEdad, genero);
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

function actualizarEdad(idEdad, nuevaEdad, genero) {
    $.ajax({
        url: "http://localhost:8085/libertadores/edadReferencia",
        type: "PUT",
        dataType: "json",
        contentType: "application/json", 
        data: JSON.stringify({
            idEdad: idEdad,
            edad: nuevaEdad,
            genero: genero
        }),
        success: function(response) {
            Swal.fire({
                text: 'Edad actualizada exitosamente!',
                icon: 'success',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            })
                .then(() => {
                    consultarEdades();
                });
        },
        error: function(xhr, status) {
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
