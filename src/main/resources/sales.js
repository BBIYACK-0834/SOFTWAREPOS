const API_BASE = "http://softwarepos.kro.kr:8080";

function handle401(response) {
    if (response.status === 401) {
        window.location.href = "login.html";
        return true;
    }
    return false;
}

window.onload = () => {
    fetch(`${API_BASE}/admin/products`, {
        credentials: 'include'
    })
        .then(res => {
            if (handle401(res)) return;
            return res.json();
        })
        .then(products => {
            if (!products) return;
            const tbody = document.getElementById('productTableBody');
            products.forEach(prod => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${prod.prodNum}</td>
                    <td>${prod.prodName}</td>
                    <td>${prod.prodIntro}</td>
                    <td>${prod.prodStatus}</td>
                    <td>${prod.prodPri.toLocaleString()}원</td>
                    <td>
                        <button class="edit-button" onclick="editProduct(${prod.prodNum})">수정</button>
                        <button class="delete-button" onclick="deleteProduct(${prod.prodNum}, this)">삭제</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error('상품 목록 로드 실패:', err);
            alert('상품 목록을 불러오지 못했습니다.');
        });
};

function editProduct(prodNum) {
    window.location.href = `editProduct.html?prodNum=${prodNum}`;
}

function deleteProduct(prodNum, button) {
    if (!confirm(`정말로 상품 번호 ${prodNum}를 삭제하시겠습니까?`)) return;

    fetch(`${API_BASE}/admin/products/${prodNum}`, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(res => {
            if (handle401(res)) return;
            if (!res.ok) throw new Error('삭제 실패');
            alert('상품이 삭제되었습니다.');
            const row = button.closest('tr');
            row.remove();
        })
        .catch(err => {
            console.error('삭제 중 오류:', err);
            alert('상품 삭제에 실패했습니다.');
        });
}
