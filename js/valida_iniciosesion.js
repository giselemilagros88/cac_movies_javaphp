// Espera a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario en el DOM
    const form = document.querySelector('form');

    // Agrega un evento de escucha para cuando se envía el formulario
    form.addEventListener('submit', async (event) => {
        // Si la validación del formulario no es exitosa
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        if (!validateForm()) {
            console.log('El formulario no es válido. Por favor, corrige los errores.');
            return;
        }
        // le pego al servidor para obtener el token si el usuario es el admin:
        const formData = new FormData(form);
        const userData = {
            usuario: formData.get('usuario'),
            password: formData.get('password')
        };

        try {
            const errorMessage = document.getElementById('error-text-login');
            errorMessage.innerText = '';
            const response = await fetch('http://localhost/moviesphp/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            // si da 200 ok
            if (response.ok) {
                console.log('Respuesta del servidor:', data);
                if (data.status=='ok'){ // si la respuesta del ok es OK
                    const token = data.result.token;
                    const es_admin = data.result.es_admin;
                    console.log('Token de autenticación:', token);
                    // Aquí puedes guardar el token en localStorage o sessionStorage para usarlo en otras solicitudes
                    localStorage.setItem('token', token);
                    localStorage.setItem('es_admin', es_admin);
                    // Redireccionar al índice del front
                    window.location.href = '../index.html';
                }else if (data.status=='error'){ // si da error 
                    console.log('Error:', data.result.error_msg);
                    localStorage.setItem('es_admin', 'N');
                    errorMessage.innerText = data.result.error_msg;
                }
                
            } else {
                console.log('Error:', data.error);
                localStorage.setItem('es_admin', 'N');
                errorMessage.innerText = 'Error al enviar la solicitud:';
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }

    });

    // Función para validar todo el formulario
    const validateForm = () => {
        let isValid = true;

        // Validar campo de email
        isValid = validateEmailField('usuario', 'El correo electrónico no es válido') && isValid;

        // Validar campo de contraseña
        isValid = validateField('password', 'La contraseña es obligatoria') && isValid;

        return isValid;
    };

    // Función para validar un campo específico
    const validateField = (fieldId, errorMessage) => {
        // Obtiene el elemento del campo mediante su ID
        const field = document.getElementById(fieldId);
        // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
        const value = field.value.trim();
        // Si el valor del campo está vacío
        if (value === '') {
            // Establece un mensaje de error para el campo
            setErrorFor(field, errorMessage);
            // Devuelve false indicando que la validación ha fallado
            return false;
        } else {
            // Si el valor del campo no está vacío, elimina cualquier mensaje de error anterior
            setSuccessFor(field);
            // Devuelve true indicando que la validación ha tenido éxito
            return true;
        }
    };

    // Función para validar el campo de correo electrónico
    const validateEmailField = (fieldId, errorMessage) => {
        // Obtiene el elemento del campo de correo electrónico mediante su ID
        const field = document.getElementById(fieldId);
        // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
        const email = field.value.trim();
        // Si el campo de correo electrónico está vacío
        if (email === '') {
            // Establece un mensaje de error para el campo de correo electrónico
            setErrorFor(field, 'El correo electrónico es obligatorio');
            // Devuelve false indicando que la validación ha fallado
            return false;
        // Si el campo de correo electrónico no está vacío pero no es válido
        } else if (!isEmail(email)) {
            // Establece un mensaje de error para el campo de correo electrónico
            setErrorFor(field, errorMessage);
            // Devuelve false indicando que la validación ha fallado
            return false;
        } else {
            // Si el campo de correo electrónico es válido, elimina cualquier mensaje de error anterior
            setSuccessFor(field);
            // Devuelve true indicando que la validación ha tenido éxito
            return true;
        }
    };

    // Función para establecer un mensaje de error en un campo
    const setErrorFor = (input, message) => {
        // Encuentra el elemento padre del campo de entrada
        const formControl = input.closest('div');
        // Encuentra el elemento de texto de error dentro del elemento padre
        const errorText = formControl.querySelector('.error-text');
        // Agrega la clase de error al elemento padre para resaltar el campo
        formControl.classList.add('error');
        // Establece el texto del mensaje de error
        errorText.innerText = message;
        // Establece el foco en el campo de entrada para una corrección rápida
        input.focus();
    };

    // Función para eliminar un mensaje de error de un campo
    const setSuccessFor = (input) => {
        // Encuentra el elemento padre del campo de entrada
        const formControl = input.closest('div');
        // Elimina la clase de error del elemento padre
        formControl.classList.remove('error');
        // Encuentra el elemento de texto de error dentro del elemento padre
        const errorText = formControl.querySelector('.error-text');
        // Establece el texto de error como vacío
        errorText.innerText = '';
    };

    // Función para validar si una cadena es una dirección de correo electrónico válida
    const isEmail = (email) => {
        // Expresión regular para validar el formato de correo electrónico
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Verifica si el correo electrónico cumple con el formato
        return re.test(email);
    };
     // Agrega eventos para borrar las clases de error cuando se completa el input o se presiona Tab
     form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
            const value = input.value.trim();
            // Si el campo no está vacío, elimina cualquier mensaje de error
            if (value !== '') {
                setSuccessFor(input);
            }
        });
    });
     // Agrega eventos para borrar las clases de error cuando se selecciona una opción del select
     form.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            // Obtiene el valor seleccionado del campo de selección
            const value = select.value;
            // Si se selecciona una opción, elimina cualquier mensaje de error
            if (value !== '') {
                setSuccessFor(select);
            }
        });
    });

   
});


