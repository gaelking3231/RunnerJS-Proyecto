// Selecciona la imagen principal y todas las miniaturas
const imagenPrincipal = document.getElementById('imagen-principal');
const miniaturas = document.querySelectorAll('.galeria-miniaturas img');

// Itera sobre cada miniatura
miniaturas.forEach(miniatura => {
    // Agrega un evento 'click' a cada una
    miniatura.addEventListener('click', () => {
        // Obtenemos la URL de la imagen en la que se hizo clic
        const nuevaImagen = miniatura.src;
        
        // Cambia el 'src' de la imagen principal por la de la miniatura
        imagenPrincipal.src = nuevaImagen;
    });
});