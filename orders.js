document.addEventListener("DOMContentLoaded", () => {
    // Simulación de pedidos entrantes
    const pedidos = [
        {
            mesa: "Mesa 1",
            fechaHora: "2024-08-24 14:30",
            platos: [
                { nombre: "Pizza", cantidad: 2 },
                { nombre: "Ensalada", cantidad: 1 }
            ],
            precioTotal: 25.00
        },
        {
            mesa: "Mesa 2",
            fechaHora: "2024-08-24 14:35",
            platos: [
                { nombre: "Pasta", cantidad: 1 },
                { nombre: "Sopa", cantidad: 2 }
            ],
            precioTotal: 18.00
        }
    ];

    const pendientesContainer = document.querySelector('.pendientes__cards');
    const esperaContainer = document.querySelector('.espera__cards');
    const finalizadosContainer = document.querySelector('.finalizados__cards');

    function createCard(pedido) {
        const card = document.createElement('div');
        card.classList.add('card');

        let platosHTML = '';
        pedido.platos.forEach(plato => {
            platosHTML += `<p>${plato.nombre} x${plato.cantidad}</p>`;
        });

        card.innerHTML = `
            <h3>${pedido.mesa}</h3>
            <p>${pedido.fechaHora}</p>
            <div>${platosHTML}</div>
            <p>Total: $${pedido.precioTotal.toFixed(2)}</p>
            <div class="buttons">
                <button class="btn-espera">Mover a Espera</button>
                <button class="btn-rechazar">Rechazar</button>
            </div>
        `;

        const btnEspera = card.querySelector('.btn-espera');
        const btnRechazar = card.querySelector('.btn-rechazar');

        btnEspera.addEventListener('click', () => {
            if (card.parentElement === pendientesContainer) {
                // Mover de "En espera" a "En progreso"
                btnEspera.innerText = 'Mover a Finalizados';
                btnRechazar.innerText = 'Volver a Pendientes';
                esperaContainer.appendChild(card);
            } else if (card.parentElement === esperaContainer) {
                // Mover de "En progreso" a "Finalizados"
                btnEspera.innerText = 'Mover a En Progreso';
                btnRechazar.remove(); // Remover el botón "Volver a Pendientes" en finalizados
                finalizadosContainer.appendChild(card);
            } else if (card.parentElement === finalizadosContainer) {
                // Mover de "Finalizados" a "En progreso"
                btnEspera.innerText = 'Mover a Finalizados';
                const volverPendientesBtn = document.createElement('button');
                volverPendientesBtn.classList.add('btn-rechazar');
                volverPendientesBtn.innerText = 'Volver a Pendientes';
                volverPendientesBtn.addEventListener('click', () => {
                    btnEspera.innerText = 'Mover a Espera';
                    btnRechazar.innerText = 'Rechazar';
                    pendientesContainer.appendChild(card);
                });
                card.querySelector('.buttons').appendChild(volverPendientesBtn);
                esperaContainer.appendChild(card);
            }
        });

        btnRechazar.addEventListener('click', () => {
            if (card.parentElement === esperaContainer) {
                // Mover de "En progreso" a "En espera"
                btnEspera.innerText = 'Mover a Espera';
                btnRechazar.innerText = 'Rechazar';
                pendientesContainer.appendChild(card);
            } else {
                // Rechazar el pedido (solo si está en "En espera")
                card.remove();
            }
        });

        return card;
    }

    pedidos.forEach(pedido => {
        const card = createCard(pedido);
        pendientesContainer.appendChild(card);
    });
});
