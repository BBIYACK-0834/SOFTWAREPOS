const API_BASE = 'https://softwarepos.r-e.kr:8080';
const menuEl = document.getElementById('menu');
const orderListEl = document.getElementById('order-list');
const totalEl = document.getElementById('total');
const modalOrderList = document.getElementById('modalOrderList');
const menuRankingList = document.getElementById('menuRankingList');
const modal = document.getElementById('orderModal');
const order = {};

const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table');

if (!tableNumber) {
    alert("테이블 번호가 URL에 없습니다. 예: ?table=1");
    throw new Error("테이블 번호 없음");
}

function handle401(response) {
    if (response.status === 401) {
        window.location.href = "login.html";
        return true;
    }
    return false;
}

fetch(`${API_BASE}/admin/products`, { credentials: 'include' })
    .then(res => {
        if (handle401(res)) return;
        return res.json();
    })
    .then(products => {
        products.forEach(p => {
            const btn = document.createElement('button');
            btn.innerHTML = `<strong>${p.prodName}</strong><br>${p.prodPri.toLocaleString()}원`;
            btn.addEventListener('click', () => {
                if (order[p.prodName]) {
                    order[p.prodName].quantity += 1;
                } else {
                    order[p.prodName] = {
                        price: p.prodPri,
                        quantity: 1
                    };
                }
                updateOrder();
            });
            menuEl.appendChild(btn);
        });
    });

function updateOrder() {
    orderListEl.innerHTML = '';
    let total = 0;

    for (const [name, item] of Object.entries(order)) {
        const div = document.createElement('div');
        div.className = 'order-item';

        const left = document.createElement('span');
        left.innerHTML = `
            ${name} x${item.quantity}
            <button onclick="changeQuantity('${name}', -1)">-</button>
            <button onclick="changeQuantity('${name}', 1)">+</button>
        `;

        const right = document.createElement('span');
        const subtotal = item.price * item.quantity;
        total += subtotal;
        right.textContent = `${subtotal.toLocaleString()}원`;

        div.appendChild(left);
        div.appendChild(right);
        orderListEl.appendChild(div);
    }

    totalEl.textContent = `총액: ${total.toLocaleString()}원`;
}
function changeQuantity(name, delta) {
    if (!order[name]) return;

    order[name].quantity += delta;

    if (order[name].quantity <= 0) {
        delete order[name];
    }

    updateOrder();
}


function clearOrder() {
    Object.keys(order).forEach(k => delete order[k]);
    updateOrder();
}

function submitOrder() {
    const requests = Object.entries(order).map(([prodName, item]) => {
        return fetch(`${API_BASE}/user/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                prodName,
                quantity: item.quantity,
                price: item.price,
                tableNumber: parseInt(tableNumber)
            })
        });
    });

    Promise.all(requests)
        .then(() => {
            alert('주문이 완료되었습니다!');
            clearOrder();
        })
        .catch(err => {
            console.error('주문 실패:', err);
            alert('문제가 발생했습니다.');
        });
}

function showCurrentOrders() {
    fetch(`${API_BASE}/user/order/${tableNumber}`, { credentials: 'include' })
        .then(res => {
            if (handle401(res)) return;
            return res.json();
        })
        .then(data => {
            modalOrderList.innerHTML = '';
            const myMenuNames = [];

            if (data.length === 0) {
                modalOrderList.innerHTML = "<p>주문 내역이 없습니다.</p>";
            } else {
                data.forEach(order => {
                    myMenuNames.push(order.prodName);
                    const div = document.createElement('div');
                    div.className = 'modal-item';
                    div.innerHTML = `
                        <span style="flex: 1; text-align: left;">${order.prodName}</span>
                        <span style="flex: 0 0 auto;">x${order.quantity}</span>
                    `;
                    modalOrderList.appendChild(div);
                });
            }

            fetch(`${API_BASE}/user/order/all`, { credentials: 'include' })
                .then(res => {
                    if (handle401(res)) return;
                    return res.json();
                })
                .then(allOrders => {
                    const grouped = {};
                    menuRankingList.innerHTML = '';

                    allOrders.forEach(order => {
                        if (!myMenuNames.includes(order.prodName)) return;
                        if (!grouped[order.prodName]) grouped[order.prodName] = [];
                        grouped[order.prodName].push(order);
                    });

                    Object.entries(grouped).forEach(([prodName, orders]) => {
                        orders.sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt));

                        const title = document.createElement('div');
                        title.style = 'font-weight: bold; margin-top: 10px;';
                        title.textContent = `🍽️ ${prodName}`;
                        menuRankingList.appendChild(title);

                        orders.forEach((order, index) => {
                            if (String(order.tableNumber) !== String(tableNumber)) return;

                            const div = document.createElement('div');
                            div.style = 'margin-left: 10px; font-size: 14px;';
                            const time = new Date(order.orderedAt).toLocaleTimeString('ko-KR', {
                                hour: '2-digit', minute: '2-digit'
                            });
                            div.textContent = `${index + 1}번째로 조리중이에요 (${time})`;
                            menuRankingList.appendChild(div);
                        });
                    });

                    modal.style.display = 'flex';
                });
        });
}

function closeModal() {
    modal.style.display = 'none';
}
