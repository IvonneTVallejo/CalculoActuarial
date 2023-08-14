
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
                window.location.href = './pages/home.html';
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

