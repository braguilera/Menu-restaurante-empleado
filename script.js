document.addEventListener('DOMContentLoaded', function() {
    let pendientesCount = 4;
    const pendientesList = document.getElementById('pendientes-list');
    const progresoList = document.getElementById('progreso-list');
    const finalizadosList = document.getElementById('finalizados-list');
    const notification = document.getElementById('notification');

    function createOrderCard(mesa, items, total, status) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <h3>Mesa ${mesa}</h3>
            <ul>
                ${items.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
            </ul>
            <p class="total">Total: $${total}</p>
            ${getButtonsForStatus(status)}
        `;
        return card;
    }

    function getButtonsForStatus(status) {
        switch(status) {
            case 'pendiente':
                return `
                    <button class="move" onclick="moveOrder(this, 'pendiente', 'en-progreso')">Mover a En Progreso</button>
                    <button class="reject" onclick="rejectOrder(this)">Rechazar</button>
                `;
            case 'en-progreso':
                return `
                    <button class="move" onclick="moveOrder(this, 'en-progreso', 'finalizado')">Finalizar</button>
                    <button class="return" onclick="moveOrder(this, 'en-progreso', 'pendiente')">Volver a Pendientes</button>
                `;
            case 'finalizado':
                return `
                    <button class="return" onclick="moveOrder(this, 'finalizado', 'en-progreso')">Volver a En Progreso</button>
                `;
            default:
                return '';
        }
    }

    function addOrder(list, mesa, items, total, status) {
        const card = createOrderCard(mesa, items, total, status);
        list.appendChild(card);
    }

    // Agregar algunas órdenes de ejemplo
    addOrder(pendientesList, 1, [{name: 'Hamburguesa', quantity: 2}, {name: 'Refresco', quantity: 2}], '25.00', 'pendiente');
    addOrder(pendientesList, 2, [{name: 'Pizza', quantity: 1}, {name: 'Ensalada', quantity: 1}], '20.00', 'pendiente');
    addOrder(progresoList, 3, [{name: 'Pasta', quantity: 1}, {name: 'Vino', quantity: 1}], '30.00', 'en-progreso');
    addOrder(finalizadosList, 4, [{name: 'Postre', quantity: 2}], '10.00', 'finalizado');

    window.moveOrder = function(button, fromStatus, toStatus) {
        const card = button.closest('.order-card');
        let targetList;
        switch(toStatus) {
            case 'pendiente':
                targetList = pendientesList;
                pendientesCount++;
                break;
            case 'en-progreso':
                targetList = progresoList;
                if(fromStatus === 'pendiente') pendientesCount--;
                break;
            case 'finalizado':
                targetList = finalizadosList;
                break;
        }
        targetList.appendChild(card);
        card.innerHTML = card.innerHTML.replace(getButtonsForStatus(fromStatus), getButtonsForStatus(toStatus));
        updatePendientesCount();
    };

    window.rejectOrder = function(button) {
        const card = button.closest('.order-card');
        card.remove();
        pendientesCount--;
        updatePendientesCount();
    };

    function updatePendientesCount() {
        document.getElementById('pendientes-count').textContent = pendientesCount;
    }

    // Simular la llegada de un nuevo pedido cada 30 segundos
    setInterval(function() {
        pendientesCount++;
        updatePendientesCount();
        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.add('hidden'), 5000);

        const newMesa = Math.floor(Math.random() * 20) + 1;
        const newItems = [{name: 'Plato Nuevo', quantity: 1}];
        const newTotal = '15.00';
        addOrder(pendientesList, newMesa, newItems, newTotal, 'pendiente');
    }, 30000);

    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Carta (Menu) functionality
    const menuItems = [
        { name: 'Pizza Margherita', price: 10.99, image: '/placeholder.svg?height=200&width=200' },
        { name: 'Hamburguesa Clásica', price: 8.99, image: '/placeholder.svg?height=200&width=200' },
        { name: 'Ensalada César', price: 7.99, image: '/placeholder.svg?height=200&width=200' },
    ];

    const menuItemsContainer = document.getElementById('menu-items');

    function renderMenuItem(item) {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button>Editar</button>
        `;
        menuItemsContainer.appendChild(menuItemElement);
    }

    menuItems.forEach(renderMenuItem);

    document.getElementById('add-menu-item').addEventListener('click', function() {
        // Here you would typically open a modal or form to add a new menu item
        console.log('Add new menu item clicked');
    });

    // Promociones functionality
    const promotions = [
        { title: '2x1 en pizzas', description: 'Todos los martes', image: '/placeholder.svg?height=200&width=200' },
        { title: 'Hamburguesa + bebida', description: 'Combo especial', image: '/placeholder.svg?height=200&width=200' },
    ];

    const activePromotionsContainer = document.getElementById('active-promotions');

    function renderPromotion(promotion) {
        const promotionElement = document.createElement('div');
        promotionElement.className = 'promotion-item';
        promotionElement.innerHTML = `
            <img src="${promotion.image}" alt="${promotion.title}">
            <h3>${promotion.title}</h3>
            <p>${promotion.description}</p>
            <button>Editar</button>
        `;
        activePromotionsContainer.appendChild(promotionElement);
    }

    promotions.forEach(renderPromotion);

    document.getElementById('add-promotion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically handle the form submission to add a new promotion
        console.log('New promotion submitted');
        // For demonstration, let's add a new promotion with placeholder data
        const newPromotion = {
            title: document.getElementById('promo-title').value,
            description: document.getElementById('promo-description').value,
            image: '/placeholder.svg?height=200&width=200'
        };
        renderPromotion(newPromotion);
        this.reset();
    });
});
