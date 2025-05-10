const tableNumber = new URLSearchParams(window.location.search).get('table');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceElement = document.getElementById('total-price');
const menuSection = document.getElementById('menu-section');

let originOrders = []; // 서버에서 받은 기존 주문들
let newOrders = []; // 새로 추가한 주문들
let menuList = []; // 전체 메뉴 목록

function calculateElapsedTime(orderTime) {
    const now = new Date();
    const elapsed = Math.floor((now - new Date(orderTime)) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}분 ${s}초`;
}

function fetchOrders() {
    fetch(`https://softwarepos.r-e.kr/user/order/${tableNumber}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            originOrders = data.map(order => {
                const menuItem = menuList.find(m => m.prodName === order.prodName);
                const price = menuItem ? menuItem.prodPri : 0;
                return {
                    ...order,
                    price: price,
                    originalQuantity: order.quantity // 수량 비교용 저장
                };
            });
            renderOrders();
        });
}


function fetchMenu() {
    fetch('https://softwarepos.r-e.kr/user/products', { credentials: 'include' })
        .then(res => res.json())
        .then(products => {
            menuList = products;
            products.forEach(p => {
                const btn = document.createElement('button');
                btn.innerHTML = `<strong>${p.prodName}</strong><br>${p.prodPri.toLocaleString()}원`;
                btn.onclick = () => {
                    const existing = newOrders.find(o => o.prodName === p.prodName);
                    if (existing) {
                        existing.quantity += 1;
                    } else {
                        newOrders.push({
                            prodName: p.prodName,
                            quantity: 1,
                            orderedAt: new Date()
                        });
                    }
                    renderOrders();
                };
                menuSection.appendChild(btn);
            });
        });
}

function renderOrders() {
    orderItemsContainer.innerHTML = '';
    let total = 0;

    // 기존 주문들 렌더링
    originOrders.forEach((order, index) => {
        const menuItem = menuList.find(m => m.prodName === order.prodName);
        const price = menuItem ? menuItem.prodPri : 0;
        const orderTotalPrice = price * order.quantity;
        total += orderTotalPrice;

        const item = document.createElement('div');
        item.className = 'order-item';

        const quantityControls = `
            <div class="quantity-controls">
                <button onclick="updateOriginQuantity(${index}, -1)">-</button>
                ${order.quantity}개
                <button onclick="updateOriginQuantity(${index}, 1)">+</button>
            </div>
        `;

        item.innerHTML = `
            <div>[기존] ${order.prodName}</div>
            ${quantityControls}
            <div>${orderTotalPrice.toLocaleString()}원</div>
            <div>주문 후 ${calculateElapsedTime(order.orderedAt)}</div>
        `;

        orderItemsContainer.appendChild(item);
    });

    // 새 주문들 렌더링
    newOrders.forEach((order, index) => {
        const menuItem = menuList.find(m => m.prodName === order.prodName);
        const price = menuItem ? menuItem.prodPri : 0;
        const orderTotalPrice = price * order.quantity;
        total += orderTotalPrice;

        const item = document.createElement('div');
        item.className = 'order-item';

        const quantityControls = `
            <div class="quantity-controls">
                <button onclick="updateNewQuantity(${index}, -1)">-</button>
                ${order.quantity}개
                <button onclick="updateNewQuantity(${index}, 1)">+</button>
            </div>
        `;

        item.innerHTML = `
            <div>[신규] ${order.prodName}</div>
            ${quantityControls}
            <div>${orderTotalPrice.toLocaleString()}원</div>
        `;

        orderItemsContainer.appendChild(item);
    });

    totalPriceElement.textContent = `총액: ${total.toLocaleString()}원`;
}

function updateOriginQuantity(index, delta) {
    const order = originOrders[index];
    order.quantity += delta;
    if (order.quantity < 0) order.quantity = 0;
    renderOrders();
}

function updateNewQuantity(index, delta) {
    const order = newOrders[index];
    order.quantity += delta;
    if (order.quantity <= 0) {
        newOrders.splice(index, 1);
    }
    renderOrders();
}

document.getElementById('clear-button').onclick = () => {
    fetch(`https://softwarepos.r-e.kr/user/order/${tableNumber}`, { credentials: 'include' })
        .then(res => res.json())
        .then(orders => {
            const deletes = orders.map(o =>
                fetch(`https://softwarepos.r-e.kr/admin/${o.orderNum}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
            );
            return Promise.all(deletes);
        })
        .then(() => {
            originOrders = [];
            newOrders = [];
            fetchOrders();
            window.location.href = 'index';
        });
};

document.getElementById('cancel-button').onclick = () => {
    window.location.href = 'index';
};

document.getElementById('order-button').onclick = () => {
    const putRequests = originOrders
        .filter(order => order.quantity > 0 && order.quantity !== order.originalQuantity)
        .map(order =>
            fetch(`https://softwarepos.r-e.kr/admin/${order.orderNum}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    prodName: order.prodName,
                    quantity: order.quantity,
                    price: order.price,
                    tableNumber: parseInt(tableNumber)
                })
            })
        );

    const deleteRequests = originOrders
        .filter(order => order.quantity === 0)
        .map(order =>
            fetch(`https://softwarepos.r-e.kr/admin/${order.orderNum}`, {
                method: 'DELETE',
                credentials: 'include'
            })
        );

    const postRequests = newOrders.map(order => {
        const menuItem = menuList.find(m => m.prodName === order.prodName);
        const price = menuItem ? menuItem.prodPri : 0;

        return fetch('https://softwarepos.r-e.kr/user/order', {
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

    Promise.all([...putRequests, ...deleteRequests, ...postRequests])
        .then(() => {
            originOrders = [];
            newOrders = [];
            window.location.href = 'index';
        });
};

window.onload = () => {
    fetchMenu();
    fetchOrders();
};
