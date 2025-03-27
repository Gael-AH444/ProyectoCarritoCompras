//VARIABLES
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

registrarEventListeners();
function registrarEventListeners(){
    //Cuando se agrega un curso presionando agregar al carrito
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);


    //Extrae los articulos del local storage
    document.addEventListener('DOMContentLoaded', () =>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    });


    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //Reseteamos el arreglo

        limpiarHTML(); //Eliminamos todo el HTML del carrito
    });
}

//FUNCIONES
function agregarCurso(evnt){
    evnt.preventDefault(); //Previene el evento del href

    if(evnt.target.classList.contains('agregar-carrito')) { //Click al btn
        const cursoSeleccionado = evnt.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

function eliminarCurso(evnt) {
    if(evnt.target.classList.contains('borrar-curso')) {
        const cursoId = evnt.target.getAttribute('data-id');

        //Elimina del arreglo de'articulosCarrito' el curso por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId); //Trae de vuelta los articulos a excepcion del 'cursoId'

        carritoHTML(); //Iterar sobre el carrito y mostrar su HTML
    }
}



//Lee el contenido del HTML al que le dimos click y extrae la informacion de curso
function leerDatosCurso(cursoSelect) {
    // console.log(cursoSelect);

    //Crear un objeto con contenido del curso actual
    const infoCurso = {
        imagen: cursoSelect.querySelector('img').src,
        titulo: cursoSelect.querySelector('h4').textContent,
        precio: cursoSelect.querySelector('.precio span').textContent,
        id: cursoSelect.querySelector('a').getAttribute('data-id'),
        cantidad : 1
    }

    //Comprobando si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe){
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad ++;
                return curso; //Retorna el objeto actualizado
            }
            else {
                return curso; //Retona los objetos que no estan duplicados
            }
        });
        articulosCarrito = [...cursos]; //Spread operator
    }
    else{
        //Agregar curso al carrito
        //Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso]; //Spread operator
    }

    carritoHTML();
}



//Mustra el carrito de compras en el HTML
function carritoHTML() {

    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach((curso) => {
        const {imagen, titulo, precio, cantidad, id} = curso; //Destructuring
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100px" />
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>           
            </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al local storage
    sincronizarStorage();
}


function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}


//Elimina los cursos previos del tbody
function limpiarHTML() {
    //Forma lenta
    // contenedorCarrito.innerHTML  = ''; 

    //Forma rapida de eliminar
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
