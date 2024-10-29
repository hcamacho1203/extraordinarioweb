// Obtener elementos del DOM
const listaPublicaciones = document.getElementById("lista-publicaciones");
const detallesPublicacion = document.getElementById("detalles-publicacion");
const tituloDetalle = document.getElementById("titulo-detalle");
const cuerpoDetalle = document.getElementById("cuerpo-detalle");
const listaComentarios = document.getElementById("lista-comentarios");
const botonVolver = document.getElementById("boton-volver");

// Variables para controlar la paginación
let publicacionesPorPagina = 10;
let comentariosPorPagina = 5;
let paginaActual = 1;
let paginaComentariosActual = 1;
let totalPaginas = 1;
let totalPaginasComentarios = 1;

// Función para cargar publicaciones con paginación
function cargarPublicaciones(pagina = 1) {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((data) => {
            totalPaginas = Math.ceil(data.length / publicacionesPorPagina);
            mostrarPublicacionesPorPagina(data, pagina);
            if (totalPaginas > 1) {
                agregarMarcadorDePaginas();
            } else {
                document.getElementById("paginacion").innerHTML = ""; // Limpiar si solo hay una página
            }
        })
        .catch((error) =>
            console.error("Error al cargar publicaciones:", error)
        );
}

// Función para mostrar publicaciones por página
function mostrarPublicacionesPorPagina(publicaciones, pagina) {
    listaPublicaciones.innerHTML = ""; // Limpiar lista de publicaciones
    let inicio = (pagina - 1) * publicacionesPorPagina;
    let fin = inicio + publicacionesPorPagina;
    let publicacionesPagina = publicaciones.slice(inicio, fin);

    publicacionesPagina.forEach((publicacion) => {
        const li = document.createElement("li");
        li.textContent = publicacion.title;
        li.addEventListener("click", () => mostrarDetalles(publicacion.id));
        listaPublicaciones.appendChild(li);
    });
}

// Función para mostrar el marcador de páginas de publicaciones
function agregarMarcadorDePaginas() {
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = ""; // Limpiar paginación

    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.textContent = i;
        botonPagina.classList.add("boton-pagina");

        if (i === paginaActual) {
            botonPagina.classList.add("activo"); // Resaltar la página actual
        }

        botonPagina.addEventListener("click", () => cambiarPagina(i));
        paginacion.appendChild(botonPagina);
    }
}

// Función para cambiar de página de publicaciones
function cambiarPagina(pagina) {
    paginaActual = pagina;
    cargarPublicaciones(paginaActual);
}

// Función para mostrar los detalles de una publicación
function mostrarDetalles(idPublicacion) {
    document.getElementById("publicaciones").style.display = "none";
    detallesPublicacion.style.display = "block";
    paginaComentariosActual = 1; // Resetear la página de comentarios al ver una nueva publicación

    fetch(`https://jsonplaceholder.typicode.com/posts/${idPublicacion}`)
        .then((response) => response.json())
        .then((data) => {
            tituloDetalle.textContent = data.title;
            cuerpoDetalle.textContent = data.body;

            // Cargar comentarios asociados con paginación
            cargarComentarios(idPublicacion);
        })
        .catch((error) =>
            console.error("Error al cargar detalles de la publicación:", error)
        );
}

// Función para cargar comentarios con paginación
function cargarComentarios(idPublicacion, pagina = 1) {
    fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${idPublicacion}`
    )
        .then((response) => response.json())
        .then((comentarios) => {
            totalPaginasComentarios = Math.ceil(
                comentarios.length / comentariosPorPagina
            );
            mostrarComentariosPorPagina(comentarios, pagina);
            if (totalPaginasComentarios > 1) {
                agregarMarcadorDePaginasComentarios(idPublicacion);
            } else {
                document.getElementById("paginacion-comentarios").innerHTML =
                    ""; // Limpiar si solo hay una página
            }
        })
        .catch((error) => console.error("Error al cargar comentarios:", error));
}

// Función para mostrar comentarios por página
function mostrarComentariosPorPagina(comentarios, pagina) {
    listaComentarios.innerHTML = ""; // Limpiar lista de comentarios
    let inicio = (pagina - 1) * comentariosPorPagina;
    let fin = inicio + comentariosPorPagina;
    let comentariosPagina = comentarios.slice(inicio, fin);

    comentariosPagina.forEach((comentario) => {
        const li = document.createElement("li");
        li.textContent = comentario.body;
        listaComentarios.appendChild(li);
    });
}

// Función para mostrar el marcador de páginas de comentarios
function agregarMarcadorDePaginasComentarios(idPublicacion) {
    const paginacionComentarios = document.getElementById(
        "paginacion-comentarios"
    );
    paginacionComentarios.innerHTML = ""; // Limpiar paginación de comentarios

    for (let i = 1; i <= totalPaginasComentarios; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.textContent = i;
        botonPagina.classList.add("boton-pagina");

        if (i === paginaComentariosActual) {
            botonPagina.classList.add("activo"); // Resaltar la página actual
        }

        botonPagina.addEventListener("click", () =>
            cambiarPaginaComentarios(i, idPublicacion)
        );
        paginacionComentarios.appendChild(botonPagina);
    }
}

// Función para cambiar de página de comentarios
function cambiarPaginaComentarios(pagina, idPublicacion) {
    paginaComentariosActual = pagina;
    cargarComentarios(idPublicacion, paginaComentariosActual);
}

// Evento para el botón de volver a la lista de publicaciones
botonVolver.addEventListener("click", () => {
    detallesPublicacion.style.display = "none";
    document.getElementById("publicaciones").style.display = "block";
});

// Cargar publicaciones al iniciar
window.onload = () => cargarPublicaciones(paginaActual);
