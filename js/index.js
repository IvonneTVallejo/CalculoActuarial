
/**
 * Funcion para Validar login
 */


$("#login").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();

    if (username === "" || $.trim(password) === "") {
        
    } else {
        const data = {
            username: username,
            password: password,
        };

        $.ajax({
            url: "http://localhost:8080/libertadores/authenticate",
            method: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                $("#token").val(response.token);
                // Almacenar el tipo de usuario en el almacenamiento local
                localStorage.setItem("tipoUsuario", response.tipoUsuario);

                    window.location.href = '/pages/home.html';
                
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401) {
                    Swal.fire({
                        text: '¡Usuario y/o contraseña incorrectos!',
                        icon: 'error',
                        confirmButtonColor: '#0f5044',
                        customClass: {
                            popup: 'my-swal-popup',
                        }
                    });
                } else {
                    Swal.fire({
                        text: '¡Ha ocurrido un error!',
                        icon: 'error',
                        confirmButtonColor: '#0f5044',
                        customClass: {
                            popup: 'my-swal-popup',
                        }
                    });
                }
            }
        });
    }
});



const pass_field = document.querySelector('.pass-key');
const showBtn = document.querySelector('.show');
showBtn.addEventListener('click', function () {
    if (pass_field.type === "password") {
        pass_field.type = "text";
        showBtn.textContent = "Ocultar";
        showBtn.style.color = "#0f5044";
    } else {
        pass_field.type = "password";
        showBtn.textContent = "Mostrar";
        showBtn.style.color = "#222";
    }
});