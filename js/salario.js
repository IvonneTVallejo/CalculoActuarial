/*var idBuscado = 0;
*/
$(document).ready(function () {
    consultarSalarios();
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

            return "$ " + value; // Agregar el signo de pesos al inicio
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
            response.sort(function(a, b) {
                return b.ano - a.ano;
            });

            $("#contenidoTablaSalario").empty();
            response.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.ano));
                
                // Formatear el campo salario con decimales y el símbolo "$"
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

        // Obtener el año actual
        const year = new Date().getFullYear();

        // Formatear el salario y eliminar caracteres no numéricos
        const salarioFormateado = parseFloat($("#salario").val().replace(/[^0-9.]/g, ''));

        // Comparar el año ingresado con el año actual
        if (parseInt($("#ano").val()) !== year) {
            Swal.fire({
                text: '¡El año debe ser el año actual!',
                icon: 'error',
                confirmButtonColor: '#0f5044',
                customClass: {
                    popup: 'my-swal-popup',
                }
            });
            return; // Detener el proceso
        }

        const datos = {
            ano: year, // Usar el año actual
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
                    text: '¡Empleado creado exitosamente!',
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
