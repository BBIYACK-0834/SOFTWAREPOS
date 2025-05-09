const tableNumber = new URLSearchParams(window.location.search).get('table');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceElement = document.getElementById('total-price');
const menuSection = document.getElementById('menu-section');
const sessionOrders = [];
let activeOrders = [];
let menuList = [];

function calculateElapsedTime(orderTime) {
    const now = new Date();
    const elapsed = Math.floor((now - new Date(orderTime)) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}분 ${s}초`;
}

function fetchOrders() {
    fetch('https://softwarepos.r-e.kr:8080/user/order/${tableNumber}', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            renderOrders([...data, ...sessionOrders]);
        });
}

function renderOrders(orderList) {
    orderItemsContainer.innerHTML = '';
    activeOrders = orderList.map(order => ({ ...order }));
    let total = 0;

    activeOrders.forEach((order, index) => {
        const menuItem = menuList.find(m => m.prodName === order.prodName);
        const price = menuItem ? menuItem.prodPri : 0;
        const orderTotalPrice = price * order.quantity;
        total += orderTotalPrice;

        const item = document.createElement('div');
        item.className = 'order-item';

        const quantityControls = `
            <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                ${order.quantity}개
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
        `;

        item.innerHTML = `
            <div>${order.prodName}</div>
            ${quantityControls}
            <div>${orderTotalPrice.toLocaleString()}원</div>
            <div>주문 후 ${calculateElapsedTime(order.orderedAt || new Date())}</div>
        `;

        orderItemsContainer.appendChild(item);
        order.price = price;
    });

    totalPriceElement.textContent = `총액: ${total.toLocaleString()}원`;
}

function updateQuantity(index, delta) {
    const order = activeOrders[index];
    const newQuantity = order.quantity + delta;

    if (newQuantity <= 0) {
        if (order.orderNum) {
            fetch('https://softwarepos.r-e.kr:8080/admin/${order.orderNum}', {
                method: 'DELETE',
                credentials: 'include'
            }).then(fetchOrders);
        } else {
            const sessionIndex = sessionOrders.findIndex(o => o.prodName === order.prodName);
            if (sessionIndex !== -1) {
                sessionOrders.splice(sessionIndex, 1);
            }
            fetchOrders();
        }
        return;
    }

    order.quantity = newQuantity;

    if (order.orderNum) {
        fetch('https://softwarepos.r-e.kr/admin/${order.orderNum}', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prodName: order.prodName,
                quantity: order.quantity,
                price: order.price,
                tableNumber: parseInt(tableNumber)
            })
        }).then(() => renderOrders(activeOrders));
    } else {
        const sessionOrder = sessionOrders.find(o => o.prodName === order.prodName);
        if (sessionOrder) {
            sessionOrder.quantity = order.quantity;
        }
        renderOrders(activeOrders);
    }
}

function fetchMenu() {
    fetch('https://softwarepos.r-e.kr/admin/products', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(products => {
            menuList = products;
            products.forEach(p => {
                const btn = document.createElement('button');
                btn.innerHTML = `<strong>${p.prodName}</strong><br>${p.prodPri.toLocaleString()}원`;
                btn.onclick = () => {
                    const existing = sessionOrders.find(o => o.prodName === p.prodName);
                    if (existing) {
                        existing.quantity += 1;
                    } else {
                        sessionOrders.push({
                            prodName: p.prodName,
                            quantity: 1,
                            orderedAt: new Date()
                        });
                    }
                    fetchOrders();
                };
                menuSection.appendChild(btn);
            });
        });
}

document.getElementById('clear-button').onclick = () => {
    fetch('https://softwarepos.r-e.kr:8080/user/order/${tableNumber}', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(orders => {
            const deletes = orders.map(o =>
                fetch('https://softwarepos.r-e.kr:8080/admin/${o.orderNum}', {
                    method: 'DELETE',
                    credentials: 'include'
                })
            );
            return Promise.all(deletes);
        })
        .then(() => {
            sessionOrders.length = 0;
            fetchOrders();
            window.location.href = 'index.html';
        });
};

document.getElementById('cancel-button').onclick = () => {
    window.location.href = 'index.html';
};

document.getElementById('order-button').onclick = () => {
    const postRequests = sessionOrders.map(order => {
        const menuItem = menuList.find(m => m.prodName === order.prodName);
        const price = menuItem ? menuItem.prodPri : 0;

        return fetch('https://softwarepos.r-e.kr:8080/user/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                prodName: order.prodName,
                quantity: order.quantity,
                price: price,
                tableNumber: parseInt(tableNumber)
            })
        });
    });

    Promise.all(postRequests)
        .then(() => {
            sessionOrders.length = 0;
            window.location.href = 'index.html';
        });
};

window.onload = () => {
    fetchMenu();
    fetchOrders();
};
