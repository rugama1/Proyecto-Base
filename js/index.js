/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};
/*
  Función que inicializa el elemento Slider
*/

function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}

inicializarSlider();
playVideoOnScroll();
cargarCiudades();

function cargarCiudades() {
  Promise.all([
    obtenerOpciones("ciudades"),
    obtenerOpciones("tipos")
  ])
    .then(function(opciones) {
      agregarOpciones(document.getElementById("selectCiudad"), opciones[0]);
      agregarOpciones(document.getElementById("selectTipo"), opciones[1]);
      $("select").material_select();
    })
    .catch(function(error) {
      console.error(error);
    });
}

function obtenerOpciones(accion) {
  return fetch("buscador.php?accion=" + accion)
    .then(function(respuesta) {
      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las opciones de " + accion);
      }
      return respuesta.json();
    });
}

function agregarOpciones(select, opciones) {
  opciones.forEach(function(valor) {
    var opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = valor;
    select.appendChild(opcion);
  });
}

function buscarInmuebles(evento) {
  evento.preventDefault();
  var parametros = new URLSearchParams(new FormData(document.getElementById("formulario")));

  fetch("buscador.php?" + parametros.toString())
    .then(function(respuesta) {
      if (!respuesta.ok) {
        throw new Error("La búsqueda no pudo completarse");
      }
      return respuesta.json();
    })
    .then(mostrarResultados)
    .catch(function(error) {
      console.error(error);
    });
}

function mostrarResultados(inmuebles) {
  var contenedor = document.querySelector(".colContenido");
  contenedor.querySelectorAll(".itemMostrado").forEach(function(elemento) {
    elemento.remove();
  });

  inmuebles.forEach(function(inmueble) {
    var resultado = document.createElement("div");
    resultado.className = "itemMostrado card horizontal";

    var imagen = document.createElement("div");
    imagen.className = "card-image";
    var foto = document.createElement("img");
    foto.src = "img/home.jpg";
    foto.alt = "Propiedad en " + inmueble.ciudad;
    imagen.appendChild(foto);

    var contenido = document.createElement("div");
    contenido.className = "card-stacked";
    var datos = document.createElement("div");
    datos.className = "card-content";
    agregarDato(datos, "Dirección", inmueble.direccion);
    agregarDato(datos, "Ciudad", inmueble.ciudad);
    agregarDato(datos, "Teléfono", inmueble.telefono);
    agregarDato(datos, "Código postal", inmueble.codigo_postal);
    agregarDato(datos, "Tipo", inmueble.tipo);
    var precio = document.createElement("p");
    precio.className = "precioTexto";
    var etiquetaPrecio = document.createElement("strong");
    etiquetaPrecio.textContent = "Precio: ";
    precio.appendChild(etiquetaPrecio);
    precio.appendChild(document.createTextNode("$" + Number(inmueble.precio).toLocaleString("en-US")));
    datos.appendChild(precio);

    var accion = document.createElement("div");
    accion.className = "card-action";
    accion.textContent = "VER MAS";
    contenido.appendChild(datos);
    contenido.appendChild(accion);
    resultado.appendChild(imagen);
    resultado.appendChild(contenido);
    contenedor.appendChild(resultado);
  });
}

function agregarDato(contenedor, etiqueta, valor) {
  var dato = document.createElement("p");
  var textoEtiqueta = document.createElement("strong");
  textoEtiqueta.textContent = etiqueta + ": ";
  dato.appendChild(textoEtiqueta);
  dato.appendChild(document.createTextNode(valor));
  contenedor.appendChild(dato);
}

document.getElementById("formulario").addEventListener("submit", buscarInmuebles);
document.getElementById("mostrarTodos").addEventListener("click", function() {
  document.getElementById("selectCiudad").value = "";
  document.getElementById("selectTipo").value = "";
  buscarInmuebles({ preventDefault: function() {} });
});
