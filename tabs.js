function openTab(tabName) {
    // Ocultar todas las pestañas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Remover la clase 'active' de todos los botones
    const links = document.querySelectorAll('.tab-link');
    links.forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');

    // Agregar la clase 'active' al botón seleccionado
    event.currentTarget.classList.add('active');
}
