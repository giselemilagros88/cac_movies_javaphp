// Definimos la URL base de la API de The Movie DB
const API_SERVER = 'http://localhost/moviesphp/peliculas.php'; 
// Opciones para las peticiones fetch a la API
const options = {
    method: 'GET', // Método de la petición (GET)
    headers: {
        accept: 'application/json', // Tipo de respuesta esperada (JSON)
    }
};


// Función para crear elementos HTML
const createElement = (tag, className, attributes = {}) => {
    // Creamos un nuevo elemento HTML del tipo especificado (tag)
    const element = document.createElement(tag);
    
    // Si se especificó una clase, la añadimos al elemento
    if (className) {
        element.classList.add(className);
    }
    
    // Iteramos sobre los atributos pasados como argumento y los añadimos al elemento
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    
    // Devolvemos el elemento creado
    return element;
};

// Función para cargar películas en la cuadrícula de tendencias
const fetchMoviesGrid = async (page = 1) => {
    // Realizamos una petición fetch a la API para obtener las películas populares
    const response = await fetch(`${API_SERVER}?page=${page}`, options);
    // Convertimos la respuesta a JSON
    const data = await response.json();
    // Extraemos las películas de la respuesta
   // const movies = data.results;
    // la transformamos a json
    const movies = data;
    // si el data no devuelve nada entonces vuelvo a pegarle al endpoint pero con la pagina anterior
    if (movies.length==0){
        page = page - 1;
        const response = await fetch(`${API_SERVER}?page=${page}`, options);
        const data = await response.json();
        movies = data;
    }

    // Seleccionamos el contenedor de películas de tendencia en el DOM
    const tendenciasContainer = document.querySelector('.peliculasTendencia .peliculas');
    
    // Limpiamos el contenido previo del contenedor
    tendenciasContainer.innerHTML = '';

    // Iteramos sobre cada película obtenida
    movies.forEach(movie => {
     
        // Creamos los elementos HTML para mostrar la película
        const pelicula = createElement('div', 'pelicula');
        pelicula.dataset.id = movie.id;
        const img = createElement('img', 'imgTendencia', {
            src:'./assets/img/'+movie.imagen,
            alt: movie.titulo,
            loading: 'lazy'
        });
        const tituloPelicula = createElement('div', 'tituloPelicula');
        const titulo = createElement('h4', '');
        titulo.textContent = movie.titulo;

        // Agregamos los elementos al DOM
        tituloPelicula.appendChild(titulo); // Agregamos el título de la película al contenedor de título
        pelicula.append(img, tituloPelicula); // Agregamos la imagen y el contenedor de título a la película
        const peliculaWrapper = createElement('div', 'peliculas'); // Creamos un contenedor adicional para la película
        peliculaWrapper.appendChild(pelicula); // Agregamos la película al contenedor adicional
        tendenciasContainer.appendChild(peliculaWrapper); // Agregamos el contenedor adicional al contenedor de tendencias
    });

    // Actualizamos el atributo data-page con el número de página actual
    tendenciasContainer.parentElement.setAttribute('data-page', page);
};

// Función para cargar películas en el carrusel de películas aclamadas
const fetchMoviesFlex = async (page = 1) => {
    // Realizamos una petición fetch a la API para obtener las películas más aclamadas
    const response = await fetch(`${API_SERVER}?page=${page}`, options);
    
    // Convertimos la respuesta a JSON
    const data = await response.json();
    
    // Extraemos las películas de la respuesta
    //const movies = data.results;
    const movies = data;

    // Seleccionamos el contenedor de películas aclamadas en el DOM
    const aclamadasContainer = document.querySelector('.aclamadas');
    
    // Iteramos sobre cada película obtenida
    movies.forEach(movie => {
        // Creamos los elementos HTML para mostrar la película
        const peliculaItem = createElement('div', 'peliculaItem');
        const img = createElement('img', 'imgAclamada', {
            //que la imagen este dentro de la carpeta assets
            src:'./assets/img/'+movie.imagen,
           // src: movie.imagen,
            alt: movie.titulo,
            loading: 'lazy'
        });
        
        // Agregamos los elementos al DOM
        peliculaItem.appendChild(img); // Agregamos la imagen al contenedor de la película
        aclamadasContainer.appendChild(peliculaItem); // Agregamos el contenedor de la película al contenedor de películas aclamadas
    });
};

// Event listener para el botón "Anterior"
document.querySelector('.anterior').addEventListener('click', () => {
    // Obtener el número de página actual
    let currentPage = Number(document.querySelector('.peliculasTendencia').getAttribute('data-page'));
    // Si es la primera página, no hacemos nada
    if (currentPage <= 1) return;
    // Cargar las películas de la página anterior
    fetchMoviesGrid(currentPage - 1);
});

// Event listener para el botón "Siguiente"
document.querySelector('.siguiente').addEventListener('click', () => {
    // Obtener el número de página actual
    let currentPage = Number(document.querySelector('.peliculasTendencia').getAttribute('data-page'));
    // Cargar las películas de la página siguiente
    fetchMoviesGrid(currentPage + 1);
});

// Ejecutamos las funciones de carga de películas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargamos las películas en la cuadrícula de tendencias
    fetchMoviesGrid();
    // Cargamos las películas en el carrusel de películas aclamadas
    fetchMoviesFlex();
});