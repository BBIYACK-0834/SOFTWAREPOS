const API_BASE = "https://softwarepos.r-e.kr";
let count = 0;
const serveInfoMap = new Map(); // 음식별 가장 오래된 주문 1건
const countMap = new Map();     // 음식별 총 수량

window.onload = () => {
    fetch(`${API_BASE}/admin/tablecount`, { credentials: 'include' })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "login";
                return;
            }
            return response.json();
        })
        .then(tableCount => {
            if (!tableCount) return;
            count = tableCount;
            if (count > 0) {
                createTables(count);
            } else {
                document.getElementById('tableContainer').innerHTML = '<p>테이블이 존재하지 않습니다.</p>';
            }
        })
        .catch(error => {
            console.error('테이블 개수 로드 실패:', error);
            alert('테이블 개수를 가져오는 데 실패했습니다.');
        });
};

function createTables(tableCount) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';

    for (let i = 1; i <= tableCount; i++) {
        const box = document.createElement('div');
        box.className = 'table-box';
        box.setAttribute('data-table', i);
        box.innerHTML = `<h3>테이블 ${i}</h3><div class="order-list" id="order-list-${i}">조회 중...</div>`;
        box.addEventListener('click', () => {
            window.location.href = `order?table=${i}`;
        });
        container.appendChild(box);
    }

    // ✅ 최초 즉시 실행
    refreshAllOrders(tableCount);

    // ✅ 1초마다 반복 실행
    setInterval(() => {
        refreshAllOrders(tableCount);
    }, 1000);
}

function refreshAllOrders(tableCount) {
    serveInfoMap.clear();
    countMap.clear();

    for (let i = 1; i <= tableCount; i++) {
        fetchOrders(i);
    }
}

function fetchOrders(tableNumber) {
    fetch(`${API_BASE}/user/order/${tableNumber}`, { credentials: 'include' })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "login";
                return;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;
            const listDiv = document.getElementById(`order-list-${tableNumber}`);
            listDiv.innerHTML = '';

            if (data.length === 0) {
                listDiv.textContent = '주문 없음';
                return;
            }

            data.forEach(order => {
                const item = document.createElement('div');
                item.className = 'order-item';
                item.textContent = `${order.prodName} - ${order.quantity}개`;
                listDiv.appendChild(item);

                const time = new Date(order.orderedAt).getTime();

                if (!countMap.has(order.prodName)) {
                    countMap.set(order.prodName, order.quantity);
                } else {
                    countMap.set(order.prodName, countMap.get(order.prodName) + order.quantity);
                }

                if (!serveInfoMap.has(order.prodName)) {
                    serveInfoMap.set(order.prodName, {
                        table: tableNumber,
                        orderTime: time,
                        orderNum: order.orderNum,
                        count: order.quantity
                    });
                } else {
                    const existing = serveInfoMap.get(order.prodName);
                    if (time < existing.orderTime) {
                        serveInfoMap.set(order.prodName, {
                            table: tableNumber,
                            orderTime: time,
                            orderNum: order.orderNum,
                            count: order.quantity
                        });
                    }
                }
            });

            displayPriorityOrders();
        })
        .catch(error => {
            console.error('주문 조회 실패:', error);
        });
}

function displayPriorityOrders() {
    const priorityList = document.getElementById('priorityList');
    const summaryList = document.getElementById('totalSummaryList');
    priorityList.innerHTML = '';
    summaryList.innerHTML = '';

    const sorted = Array.from(serveInfoMap.entries()).sort((a, b) => a[1].orderTime - b[1].orderTime);

    sorted.forEach(([prodName, info]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${prodName} → 테이블 ${info.table} </span>
            <button class="serve-button" onclick="serveOrder(${info.orderNum})">서빙</button>
        `;
        priorityList.appendChild(li);
    });

    countMap.forEach((total, prodName) => {
        const totalLi = document.createElement('li');
        totalLi.textContent = `${prodName}: 총 ${total}개`;
        summaryList.appendChild(totalLi);
    });
}

function serveOrder(orderNum) {
    const entry = Array.from(serveInfoMap.entries()).find(([_, val]) => val.orderNum === orderNum);
    if (!entry) return;

    const [prodName, info] = entry;

    if (info.count > 1) {
        fetch(`${API_BASE}/admin/${orderNum}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                prodName: prodName,
                quantity: info.count - 1,
                price: 0,
                tableNumber: info.table
            })
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = "login";
                    return;
                }
                return response.text();
            })
            .then(() => {
                serveInfoMap.clear();
                countMap.clear();
                window.location.reload();
            })
            .catch(err => {
                console.error("수량 감소 실패", err);
                alert("서빙 중 오류 발생");
            });

    } else {
        fetch(`${API_BASE}/admin/${orderNum}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = "login";
                    return;
                }
                return response.text();
            })
            .then(() => {
                serveInfoMap.clear();
                countMap.clear();
                window.location.reload();
            })
            .catch(err => {
                console.error("서빙 실패", err);
                alert("서빙 중 오류 발생");
            });
    }
}

function addTables() {
    const input = document.getElementById('tableCountInput');
    const newCount = parseInt(input.value);

    if (isNaN(newCount) || newCount <= 0) {
        alert('유효한 테이블 개수를 입력하세요.');
        return;
    }

    fetch(`${API_BASE}/admin/tablecount`, { credentials: 'include' })
        .then(response => response.json())
        .then(currentCount => {
            const method = currentCount > 0 ? 'PUT' : 'POST';
            return fetch(`${API_BASE}/admin/tablecount`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ count: newCount })
            });
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "login";
                return;
            }
            if (!response.ok) throw new Error('테이블 수 저장 실패');
            alert('테이블 수가 저장되었습니다.');
            window.location.reload();
        })
        .catch(err => {
            console.error('테이블 저장 오류:', err);
            alert('테이블 저장 중 오류 발생');
        });
}
