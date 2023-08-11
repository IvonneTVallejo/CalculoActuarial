var idBuscado = 0;

$(document).ready(function () {
    consultarUsuarios();
});

function consultarUsuarios() {

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

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" style="font-size: 12px;" data-bs-target="#updateUser" data-bs-toggle="modal" onclick="buscarUsuario(' + element.id + ')">Editar</button>'));
                $("#contenidoTablaEmpleado").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}