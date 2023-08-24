var idBuscado = 0;

$(document).ready(function () {
    consultarCalculo();
});

const botonNUevoCalculo = document.getElementById('btnNUevoCalculo');
botonNUevoCalculo.addEventListener('click', function () {
    limpiarCampos();
});

$("#salarioBase").on({
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


// Funciones para limpiar los campos de los modales insertar y actualizar
function limpiarCampos() {
    $("#idEmpleador").val("");
    $("#idEmpleado").val("");
    $("#inputEmpleador").val("");
    $("#inputEmpleado").val("");
    $("#nombreEmpleado").val("");
    $("#fechaNac").val("");
    $("#genero").val("");
    $("#fechaIni").val("");
    $("#fechaFin").val("");
    $("#salarioBase").val("");
    $("#total").val("$ ");
    $("#btnGenerarCalculo").prop("disabled", false);
}

function obtenerNombreEmpleador(idEmpleador, callback) {
    $.ajax({
        url: 'http://localhost:8085/libertadores/empleador/' + idEmpleador,
        method: 'GET',
        success: function (responseNombre) {
            callback(responseNombre.nombreEmpleador);
        },
        error: function () {
            callback('Nombre no disponible');
        }
    });
}

function obtenerNombreyDocumentoEmpleado(idEmpleado, callback) {
    $.ajax({
        url: 'http://localhost:8085/libertadores/empleado/' + idEmpleado,
        method: 'GET',
        success: function (responseNombreyDocumento) {
            callback(responseNombreyDocumento.nombresEmpleado, responseNombreyDocumento.apellidosEmpleado, responseNombreyDocumento.identificadorEmpleado);
        },
        error: function () {
            callback('Nombre no disponible');
        }
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}


// Funcion para listar todos los empleados 
function consultarCalculo() {
    $.ajax({
        url: "http://localhost:8085/libertadores/calculoAc/general",
        type: "GET",
        dataType: "json",
        success: function (response) {

            response.sort(function (a, b) {
                return b.idCalculo - a.idCalculo;
            });

            $("#contenidoTablaCalculo").empty();
            response.forEach(element => {
                obtenerNombreEmpleador(element.idEmpleador, function (nombreEmpleador) {
                    obtenerNombreyDocumentoEmpleado(element.idEmpleado, function (nombresEmpleado, apellidosEmpleado, identificadorEmpleado) {
                        var row = $("<tr>");
                        row.append($("<td>").text(element.fechaRegistro.slice(0, 10)));
                        row.append($("<td>").text(identificadorEmpleado));
                        row.append($("<td>").text(nombresEmpleado + ' ' + apellidosEmpleado));
                        row.append($("<td>").text(formatCurrency(element.reservaActurial)));
                        row.append($("<td>").text(element.estado));

                        var accionesColumn = $("<td class='text-center no-padding'>");

                        var buttonsContainer = $("<div class='d-flex justify-content-between'>"); // Contenedor para los botones
        
                        var anularButton = $('<button type="button" class="btn btn-danger w-80" style="font-size: 12px;">Anular</button>');
                        anularButton.click(function () {
                            anularCalculo(element.idCalculo, element.estado);
                        });
        
                        var pdfButton = $('<button type="button" class="btn btn-primary w-80 ml-2" style="background-color: #0f5044; font-size: 12px;" data-target="#modalVerDetalleCalculo" data-toggle="modal">Ver Detalle</button>');
                        pdfButton.click(function () {
                            generatePDFTable(
                                element.fechaRegistro,
                                nombreEmpleador,
                                nombresEmpleado + ' ' + apellidosEmpleado,
                                identificadorEmpleado,
                                element.fechaInicioNoPago,
                                element.fechaCorte,
                                formatCurrency(element.reservaActurial),
                                element.estado
                            );
                        });

                        buttonsContainer.append(anularButton);
                        buttonsContainer.append(pdfButton);
        
                        accionesColumn.append(buttonsContainer);
        
                        row.append(accionesColumn);
        
                        $("#contenidoTablaCalculo").append(row);
                    });
                });
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


// Funcion para generar un calculo actuarial
function generaCalculo() {
    if ($("#inputEmpleador").val().length == 0 || $("#inputEmpleado").val().length == 0 || $("#nombreEmpleado").val().length == 0 || $("#fechaNac").val().length == 0 || $("#genero").val().length == 0 || $("#fechaIni").val().length == 0
        || $("#idEmpleador").val().length == 0 || $("#idEmpleado").val().length == 0 || $("#fechaFin").val().length == 0 || $("#salarioBase").val().length == 0) {
        Swal.fire({
            text: '¡Por favor complete todos los campos!',
            icon: 'warning',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        });
    } else {
        const fechaInicio = new Date(document.getElementById('fechaIni').value);
        const fechaFin = new Date(document.getElementById('fechaFin').value);

        if (fechaFin <= fechaInicio) {
            Swal.fire({
                text: '¡La fecha final debe ser mayor que la fecha inicial!',
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
                    // Inicio operacion con el back
                    const url = 'http://localhost:8085/libertadores/calculoAc';
                    const datos = {
                        idEmpleado: $("#idEmpleado").val(),
                        idEmpleador: $("#idEmpleador").val(),
                        fechaInicioNoPago: $("#fechaIni").val(),
                        fechaCorte: $("#fechaFin").val(),
                        fechaNacimiento: $("#fechaNac").val(),
                        salarioBaseLiquidacion: parseFloat($("#salarioBase").val().replace(/[^\d.-]/g, '')),
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
                            const totalAPagarField = document.getElementById('total');
                            const formattedReservaActuarial = formatCurrency(data.reservaActurial);
                            totalAPagarField.value = formattedReservaActuarial;

                            const fecha = new Date(data.fechaRegistro);
                            const dia = fecha.getDate();
                            const mes = fecha.getMonth() + 1;
                            const anio = fecha.getFullYear();
                            const fechaFormateada = `${anio}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
                            fechaRegistro.value = fechaFormateada;

                            Swal.fire({
                                text: '¡Cálculo realizado exitosamente!',
                                icon: 'success',
                                confirmButtonColor: '#0f5044',
                                customClass: {
                                    popup: 'my-swal-popup',
                                }
                            })
                                .then(() => {
                                    generatePDF();
                                    consultarCalculo();
                                    $("#btnGenerarCalculo").prop("disabled", true);
                                });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            })

        }
    }
}




// Función para anular un registro mediante la API
function anularCalculo(idCalculo,estado) {
    if (estado === "Anulado") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Este registro ya se encuentra anulado!',
            confirmButtonColor: '#0f5044',
            customClass: {
                popup: 'my-swal-popup',
            }
        })
    } else {

        Swal.fire({
            title: '¿Estás seguro de anular el registro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0f5044',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'my-swal-popup',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    idCalculo: idCalculo,
                    estado: "Anulado"
                };

                $.ajax({
                    url: "http://localhost:8085/libertadores/calculoAc/estado",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (response) {
                        consultarCalculo();
                        window.location(reload);
                    },
                    error: function (xhr, status) {
                        Swal.fire({
                            text: '¡Ha ocurrido un error al anular el cálculo!',
                            icon: 'error',
                            confirmButtonColor: '#0f5044',
                            customClass: {
                                popup: 'my-swal-popup',
                            }
                        });
                    }
                });
            }
        });
    }



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


// Funcion para descargar de excel
document.getElementById("exportarExcel").addEventListener("click", function () {
    const tabla = document.getElementById("tablaCalculo");
    const filas = tabla.getElementsByTagName("tr");

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(tabla);
    XLSX.utils.book_append_sheet(workbook, sheet, "Hoja1");

    XLSX.writeFile(workbook, "Reporte_Calculo_Actuarial.xlsx");
});



// Funcion para obtener registros del empleador
const apiUrl = 'http://localhost:8085/libertadores/empleador/general';
const searchInput = document.getElementById('inputEmpleador');
const autocompleteResults = document.getElementById('listaEmpleador');

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const idAndNameArray = data.map(item => {
            return {
                id: item.idEmpleador,
                documento: item.identificadorEmpleador,
                buscar: item.identificadorEmpleador + ' - ' + item.nombreEmpleador,
                nombre: item.nombreEmpleador
            };
        });

        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();
            autocompleteResults.innerHTML = '';

            const filteredResults = idAndNameArray.filter(item => {
                return item.buscar.toLowerCase().includes(searchTerm);
            });

            filteredResults.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item.buscar;
                listItem.addEventListener('click', () => {
                    searchInput.value = item.nombre;
                    idEmpleador.value = item.id;
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

// Funcion para obtener registros del empleado
const apiUrl2 = 'http://localhost:8085/libertadores/empleado/general';
const searchInput2 = document.getElementById('inputEmpleado');
const autocompleteResults2 = document.getElementById('listaEmpleado');

fetch(apiUrl2)
    .then(response => response.json())
    .then(data => {
        const idAndNameArray2 = data.map(item => {
            return {
                id: item.idEmpleado,
                buscar: item.identificadorEmpleado + ' - ' + item.nombresEmpleado + ' ' + item.apellidosEmpleado,
                documento: item.identificadorEmpleado,
                nombre: item.nombresEmpleado + ' ' + item.apellidosEmpleado,
                fechaNac: item.fechaNacimientoEmpleado,
                genero: item.genero
            };
        });

        searchInput2.addEventListener('input', function () {
            const searchTerm2 = searchInput2.value;
            autocompleteResults2.innerHTML = '';

            const filteredResults2 = idAndNameArray2.filter(item => {
                return item.buscar.includes(searchTerm2);
            });

            filteredResults2.forEach(item => {
                const listItem2 = document.createElement('li');
                listItem2.textContent = item.buscar;
                listItem2.addEventListener('click', () => {
                    searchInput2.value = item.documento;
                    idEmpleado.value = item.id;
                    nombreEmpleado.value = item.nombre;
                    fechaNac.value = item.fechaNac;
                    genero.value = item.genero;
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







// Funcion para generar el pdf al finalizar el calculo    
function generatePDF() {

    var nombreEmpleado = $("#nombreEmpleado").val();
    var docEmpleado = $("#inputEmpleado").val();
    var fechaRegistro = $("#fechaRegistro").val();
    var empleador = $("#inputEmpleador").val();
    var fechaNac = $("#fechaNac").val();
    var fechaIni = $("#fechaIni").val();
    var fechaFin = $("#fechaFin").val();
    var genero = $("#genero").val();
    var salarioBase = $("#salarioBase").val();
    var total = $("#total").val();


    var props = {
        outputType: "save",
        returnJsPDFDocObject: true,
        fileName: "Reporte Cálculo Actuarial",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "/Images/avatar.png",
            width: 50, //aspect ratio = width/height
            height: 33,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "CONSULTORIO JURÍDICO",
            address: "Calle 63a # 16-38",
            phone: "Sede Proyección Social",
            email: "cjuridico@libertadores.edu.co",
            email_1: "2544750 Ext. 3207-3209",
            website: "https://www.ulibertadores.edu.co › proyeccion-social",
        },
        contact: {
            label: "Fecha: " + fechaRegistro,
            name: "Empleado: " + nombreEmpleado,
            address: "Identificación: " + docEmpleado,
            phone: "Fecha Nacimiento: " + fechaNac,
            email: "Género: " + genero,
            // otherInfo: "www.website.al", // Puedes agregar esto si es necesario
        },
        invoice: {
            headerBorder: true,
            tableBodyBorder: true,
            header: [
                {
                    title: "#",
                    style: {
                        width: 10
                    }
                },
                {
                    title: "Empleador",
                    style: {
                        width: 60
                    }
                },
                { title: "Fecha Inicial" },
                { title: "Fecha Final" },
                { title: "Salario Base" },
                { title: "Total a Pagar" }
            ],
            table: Array.from(Array(1), (item, index) => ([
                index + 1,
                empleador,
                fechaIni,
                fechaFin,
                salarioBase,
                total,

            ])),

            invDescLabel: "Consideraciones para tener en cuenta",
            invDesc: "-Los datos ingresados en este aplicativo son confidenciales y seran usados solo para el presente cálculo" +
                "\n-Los resultados generados son una proyección y, por lo tanto, corresponde a una orientacion sobre el eventual monto de la Reserva Actuarial, por tanto podria variar" +
                "\n-Esta simulación se efectua teniendo en cuenta el salario reportado por el empleado" +
                "\n-La anterior información no compromete a la Fundación Universitaria Los Libertadores en caso de diferir en el resultado",
        },
        footer: {
            text: "Fundacion Universitaria Los Libertadores - Todos los derechos reservados",
        },
        pageEnable: true,
        pageLabel: "Page ",
    };

    var pdfObject = jsPDFInvoiceTemplate.default(props);
}

$(document).ready(function () {
    $("#filtroInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#contenidoTablaCalculo tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function generatePDFTable(fechaRegistro, nombreEmpleador, nombreCompletoEmpleado, identificadorEmpleado, fechaInicioNoPago, fechaCorte, reservaActurial, estado) {

    var nombreEmpleado = nombreCompletoEmpleado;
    var docEmpleado = identificadorEmpleado;
    var fechaRegistro = fechaRegistro;
    var empleador = nombreEmpleador;
    var fechaNac = fechaInicioNoPago;
    var fechaIni =fechaInicioNoPago ;
    var fechaFin = fechaCorte;
    var genero = identificadorEmpleado;
    var salarioBase = salarioBase;
    var total = reservaActurial;

    var props = {
        outputType: "save",
        returnJsPDFDocObject: true,
        fileName: "Reporte Cálculo Actuarial",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "/Images/avatar.png",
            width: 50, //aspect ratio = width/height
            height: 33,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "CONSULTORIO JURÍDICO",
            address: "Calle 63a # 16-38",
            phone: "Sede Proyección Social",
            email: "cjuridico@libertadores.edu.co",
            email_1: "2544750 Ext. 3207-3209",
            website: "https://www.ulibertadores.edu.co › proyeccion-social",
        },
        contact: {
            label: "Fecha: " + fechaRegistro,
            name: "Empleado: " + nombreEmpleado,
            address: "Identificación: " + docEmpleado,
            phone: "Fecha Nacimiento: " + fechaNac,
            email: "Género: " + genero,
            // otherInfo: "www.website.al", // Puedes agregar esto si es necesario
        },
        invoice: {
            headerBorder: true,
            tableBodyBorder: true,
            header: [
                {
                    title: "#",
                    style: {
                        width: 10
                    }
                },
                {
                    title: "Empleador",
                    style: {
                        width: 60
                    }
                },
                { title: "Fecha Inicial" },
                { title: "Fecha Final" },
                { title: "Salario Base" },
                { title: "Total a Pagar" }
            ],
            table: Array.from(Array(1), (item, index) => ([
                index + 1,
                empleador,
                fechaIni,
                fechaFin,
                salarioBase,
                total,

            ])),

            invDescLabel: "Consideraciones para tener en cuenta",
            invDesc: "-Los datos ingresados en este aplicativo son confidenciales y seran usados solo para el presente cálculo" +
                "\n-Los resultados generados son una proyección y, por lo tanto, corresponde a una orientacion sobre el eventual monto de la Reserva Actuarial, por tanto podria variar" +
                "\n-Esta simulación se efectua teniendo en cuenta el salario reportado por el empleado" +
                "\n-La anterior información no compromete a la Fundación Universitaria Los Libertadores en caso de diferir en el resultado",
        },
        footer: {
            text: "Fundacion Universitaria Los Libertadores - Todos los derechos reservados",
        },
        pageEnable: true,
        pageLabel: "Page ",
    };

    var pdfObject = jsPDFInvoiceTemplate.default(props);
}