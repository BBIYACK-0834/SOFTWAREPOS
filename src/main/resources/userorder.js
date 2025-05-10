const API_BASE = 'https://softwarepos.r-e.kr';

const menuEl = document.getElementById('menu');
const orderListEl = document.getElementById('order-list');
const totalEl = document.getElementById('total');
const foodModal = document.getElementById('foodModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalQuantity = document.getElementById('modalQuantity');
const orderModal = document.getElementById('orderModal');
const orderModalList = document.getElementById('orderModalList');

const order = {};
let currentProduct = null;
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table');

if (!tableNumber) {
    alert("테이블 번호가 URL에 없습니다. 예: ?table=1");
    throw new Error("테이블 번호 없음");
}

function handle401(response) {
    if (response.status === 401 || response.status === 403) {
        window.location.href = "login";
        return true;
    }
    return false;
}

// 메뉴 불러오기
fetch(`${API_BASE}/user/products`, { credentials: 'include' })
    .then(response => {
        if (handle401(response)) return;
        return response.json();
    })
    .then(products => {
        if (!products) return;
        products.forEach(p => {
            const btn = document.createElement('button');

            const imgTag = p.prodImage
                ? `<img src="https://softwarepos.r-e.kr/${p.prodImage}" alt="${p.prodName}">`
                : '';

            btn.innerHTML = `
        ${imgTag}
        <strong>${p.prodName}</strong><br>${p.prodPri.toLocaleString()}원
      `;

            btn.addEventListener('click', () => openModal(p));
            menuEl.appendChild(btn);
        });
    })
    .catch(err => {
        console.error('메뉴 로드 실패:', err);
        alert('메뉴를 불러오는 데 실패했습니다.');
    });

// 음식 상세 모달 열기
function openModal(product) {
    currentProduct = product;
    modalImage.src = `https://softwarepos.r-e.kr/${product.prodImage}`;
    modalName.textContent = product.prodName;
    modalDesc.textContent = product.prodIntro;
    modalPrice.textContent = product.prodPri.toLocaleString() + "원";
    modalQuantity.textContent = 1;
    foodModal.style.display = 'flex';
}

function closeModal() {
    foodModal.style.display = 'none';
}

function changeModalQuantity(delta) {
    let quantity = parseInt(modalQuantity.textContent);
    quantity += delta;
    if (quantity < 1) quantity = 1;
    modalQuantity.textContent = quantity;
}

function addToOrder() {
    const quantity = parseInt(modalQuantity.textContent);
    if (order[currentProduct.prodName]) {
        order[currentProduct.prodName].quantity += quantity;
    } else {
        order[currentProduct.prodName] = {
            price: currentProduct.prodPri,
            quantity: quantity
        };
    }
    updateOrder();
    closeModal();
}

// 장바구니(order) 업데이트
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
    if (order[name].quantity <= 0) delete order[name];
    updateOrder();
}

function clearOrder() {
    Object.keys(order).forEach(k => delete order[k]);
    updateOrder();
}

// 주문 서버로 전송
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

// ✅ 주문 내역 모달로 보기
function showCurrentOrders() {
    fetch(`${API_BASE}/user/order/${tableNumber}`, { credentials: 'include' })
        .then(response => {
            if (handle401(response)) return;
            return response.json();
        })
        .then(data => {
            const orderModalList = document.getElementById('orderModalList'); // id 찾기
            const menuRankingList = document.getElementById('menuRankingList'); // id 찾기
            const orderModal = document.getElementById('orderModal');

            orderModalList.innerHTML = '';
            const myMenuNames = [];

            if (data.length === 0) {
                orderModalList.innerHTML = "<p>주문 내역이 없습니다.</p>";
            } else {
                data.forEach(order => {
                    myMenuNames.push(order.prodName);
                    const div = document.createElement('div');
                    div.className = 'modal-item';
                    div.innerHTML = `
                        <span style="flex: 1; text-align: left;">${order.prodName}</span>
                        <span style="flex: 0 0 auto;">x${order.quantity}</span>
                    `;
                    orderModalList.appendChild(div);
                });
            }

            fetch(`${API_BASE}/user/order/all`, { credentials: 'include' })
                .then(response => {
                    if (handle401(response)) return;
                    return response.json();
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

                    orderModal.style.display = 'flex';
                });
        });

}

// 주문 모달 닫기
function closeOrderModal() {
    orderModal.style.display = 'none';
}
