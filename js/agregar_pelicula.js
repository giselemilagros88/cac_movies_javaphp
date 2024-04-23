// Espera a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', async () => {
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
        // si en el localstorage es admin
        if (localStorage.getItem('es_admin')=='N'){
            console.log('No es admin');
            return;
        }
        // le pego al servidor para grabar la pelicula:
        const formData = new FormData(form);
        // armo el json para enviar al servidor
        /*{
                "id_pelicula": null,
                "titulo": "Mision Imposible",
                "fecha_lanzamiento": "1996-07-04",
                "genero": "Acción/Suspenso",
                "duracion": "1h 50m",
                "director": "Brian De Palma",
                "reparto": "Tom Cruise, Jean Reno",
                "sinopsis": "El espía Ethan Hunt debe llevar a cabo una misión imposible: evitar la venta de un disco robado que contiene información confidencial y, al mismo tiempo, limpiar su nombre tras haber sido acusado del asesinato de su mentor.",
                "imagen": "mision_imposible_1.jpg"
                } */
        const peliculaData = {
            id_pelicula : null,
            titulo: formData.get('titulo'),
            fecha_lanzamiento: transformaFecha(formData.get('fecha')),
            genero: formData.get('genero'),
            duracion: formData.get('duracion'),
            director: formData.get('director'),
            reparto: formData.get('reparto'),
            sinopsis: formData.get('sinopsis'),
            imagen: document.getElementById("imagen").files[0].name,
            token: localStorage.getItem('token')
        };

        try {
            const errorMessage = document.getElementById('error-text-login');
            errorMessage.innerText = '';
            const response = await fetch('http://localhost/moviesphp/peliculas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(peliculaData)
            });

            const data = await response.json();
            
            // si da 200 ok
            if (response.ok) {
                console.log('Respuesta del servidor:', data);
                if (data.status=='ok'){ // si la respuesta del ok es OK
                    console.log('Pelicula grabada correctamente');
                   // limpiar los campos del formulario
                    form.reset();
                }else if (data.status=='error'){ // si da error 
                    console.log('Error:', data.result.error_msg);
                    errorMessage.innerText = data.result.error_msg;
                }
                
            } else {
                console.log('Error:', data.error);
                errorMessage.innerText = 'Error al enviar la solicitud:';
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }

    });

    const validateForm = () => {
        let isValid = true;
    
        // Validar campo de título
        isValid = validateField('titulo', 'El título es obligatorio') && isValid;
    
        // Validar campo de fecha de lanzamiento
        isValid = validateField('fecha', 'La fecha de lanzamiento es obligatoria') && isValid;
    
        // Validar campo de género
        isValid = validateField('genero', 'El género es obligatorio') && isValid;
    
        // Validar campo de duración
        isValid = validateField('duracion', 'La duración es obligatoria') && isValid;
    
        // Validar campo de director
        isValid = validateField('director', 'El director es obligatorio') && isValid;
    
        // Validar campo de reparto
        isValid = validateField('reparto', 'El reparto es obligatorio') && isValid;
    
        // Validar campo de sinopsis
        isValid = validateField('sinopsis', 'La sinopsis es obligatoria') && isValid;
    
        // Validar campo de imagen
        isValid = validateFileField('imagen', 'La imagen es obligatoria') && isValid;
    
        return isValid;
    };
    
    const validateFileField = (fieldId, errorMessage) => {
        const field = document.getElementById(fieldId);
        const file = field.files[0]; // Obtenemos el archivo seleccionado
        // levanto el nombre de la imagen 
        const nombreImagen = file.name;
        console.log(nombreImagen);
        if (!file) {
            setErrorFor(field, errorMessage);
            return false;
        } else {
            setSuccessFor(field);
            return true;
        }
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
     // funcion flecha que toma la fecha y la transforma asi : yyyy-mm-dd
    const transformaFecha = (fecha) => {
        const fechaArray = fecha.split('/');
        return `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}`;

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

    // llenar en la tabla los datos de todas las peliculas
    const tabla = document.getElementById('tablaPeliculas');
    // le pego al server para obtener todas las peliculas
    const response = await fetch('http://localhost/moviesphp/peliculas.php', {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    });
    const data = await response.json();
    const peliculas = data;
    // limpio la tabla
    tabla.innerHTML = '';
    // recorro el array de peliculas y las muestro en la tabla y el ultimo campo tiene que tener dos botones de acciones,
    //<td><button class="btn btn-warning">Modificar</button><button class="btn btn-danger">Eliminar</button></td>
    peliculas.forEach(pelicula => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pelicula.id_pelicula}</td>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.genero}</td>
            <td><img src="../assets/img/${pelicula.imagen}" alt="${pelicula.titulo}" width="150"></td>
            <td><button class="btn btn-warning">Modificar</button><button class="btn btn-danger">Eliminar</button></td>
         `;
        tabla.appendChild(row);
    });
});


