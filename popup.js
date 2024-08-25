document.addEventListener('DOMContentLoaded', function() {
    const addNewPlateBtn = document.getElementById('add-new-plate');
    const popup = document.getElementById('add-plate-popup');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const newCategoryInput = document.getElementById('new-category');
    const categorySelect = document.getElementById('plate-category');

    // Mostrar el popup cuando se hace clic en el botón de agregar nuevo plato
    addNewPlateBtn.addEventListener('click', function() {
        popup.style.display = 'block';
    });

    // Cerrar el popup cuando se hace clic en la 'X' o en el botón de cancelar
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    cancelBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Cerrar el popup si se hace clic fuera del contenido del popup
    window.addEventListener('click', function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });

    addCategoryBtn.addEventListener('click', function() {
        const newCategory = newCategoryInput.value.trim();

        if (newCategory !== '') {
            const newOption = document.createElement('option');
            newOption.value = newCategory.toLowerCase().replace(/\s+/g, '-');
            newOption.textContent = newCategory;
            categorySelect.appendChild(newOption);

            newCategoryInput.value = '';
        } else {
            alert('Por favor, ingresa un nombre para la nueva categoría.');
        }
    });

    // Función para eliminar la categoría seleccionada
    removeCategoryBtn.addEventListener('click', function() {
        const selectedCategory = categorySelect.value;

        if (selectedCategory) {
            const optionToRemove = categorySelect.querySelector(`option[value="${selectedCategory}"]`);
            optionToRemove.remove();
        } else {
            alert('Por favor, selecciona una categoría para eliminar.');
        }
    });

    submitPlateBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        const plateTitle = document.getElementById('plate-title').value;
        const plateDescription = document.getElementById('plate-description').value;
        const plateCategory = categorySelect.value;
        const platePrice = '600.00'; // Puedes agregar un campo de precio si es necesario
        const plateImage = document.getElementById('plate-image').files[0];

        if (plateTitle && plateDescription && plateCategory) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const newCard = document.createElement('div');
                newCard.classList.add('menu-card');
                newCard.innerHTML = `
                    <img src="${e.target.result}" alt="${plateTitle}" class="menu-card-img">
                    <div class="menu-card-details">
                        <h3 class="menu-card-title">${plateTitle}</h3>
                        <p class="menu-card-description">${plateDescription}</p>
                        <p class="menu-card-price">$${platePrice}</p>
                        <div class="menu-card-buttons">
                            <button class="menu-card-edit-btn">✎</button>
                            <button class="menu-card-delete-btn">✕</button>
                        </div>
                    </div>
                `;

                menuCardsContainer.appendChild(newCard);

                // Limpiar el formulario
                document.getElementById('add-plate-form').reset();
            };

            reader.readAsDataURL(plateImage);
        } else {
            alert('Por favor, completa todos los campos del formulario.');
        }
    });

    // Función para eliminar un plato
    menuCardsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('menu-card-delete-btn')) {
            const cardToDelete = event.target.closest('.menu-card');
            cardToDelete.remove();
        }
    });

    // Función para editar un plato
    menuCardsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('menu-card-edit-btn')) {
            const cardToEdit = event.target.closest('.menu-card');
            const title = cardToEdit.querySelector('.menu-card-title').textContent;
            const description = cardToEdit.querySelector('.menu-card-description').textContent;
            const category = categorySelect.value; // Suponiendo que la categoría no se muestra en la tarjeta
            const imageSrc = cardToEdit.querySelector('.menu-card-img').src;

            // Abrir el popup con los datos del plato para editar
            document.getElementById('plate-title').value = title;
            document.getElementById('plate-description').value = description;
            categorySelect.value = category;

            const plateImageInput = document.getElementById('plate-image');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([imageSrc], "image.jpg"));
            plateImageInput.files = dataTransfer.files;

            // Cambiar el botón de agregar a editar
            submitPlateBtn.textContent = 'Editar Plato';
            submitPlateBtn.removeEventListener('click', agregarPlato);
            submitPlateBtn.addEventListener('click', function editarPlato(event) {
                event.preventDefault();

                cardToEdit.querySelector('.menu-card-title').textContent = document.getElementById('plate-title').value;
                cardToEdit.querySelector('.menu-card-description').textContent = document.getElementById('plate-description').value;

                reader.onload = function(e) {
                    cardToEdit.querySelector('.menu-card-img').src = e.target.result;
                };
                reader.readAsDataURL(plateImageInput.files[0]);

                submitPlateBtn.textContent = 'Agregar al Menú';
                submitPlateBtn.removeEventListener('click', editarPlato);
                submitPlateBtn.addEventListener('click', agregarPlato);

                document.getElementById('add-plate-form').reset();
            });
        }
    });

    function agregarPlato(event) {
        event.preventDefault();
        // Aquí va el código para agregar el plato.
    }
    
    // Permitir eliminar categorías existentes
    categorySelect.querySelectorAll('option').forEach(option => {
        const removeSpan = document.createElement('span');
        removeSpan.classList.add('remove-category');
        removeSpan.textContent = '✕';
        option.appendChild(removeSpan);

        removeSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            option.remove();
        });
    });
});
