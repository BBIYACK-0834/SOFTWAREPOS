const API_BASE = "https://softwarepos.r-e.kr";

function handle401(response) {
    if (response.status === 401 || response.status === 403) {
        window.location.href = "login";
        return true;
    }
    return false;
}

window.onload = () => {
    fetch(`${API_BASE}/user/products`, {
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
                const hasImage = prod.prodImage && prod.prodImage.trim() !== '';
                const imgPath = hasImage ? prod.prodImage : null;

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
                    ${
                    hasImage
                        ? `<button class="view-image-button" onclick="viewImage('${imgPath}')">이미지 보기</button>`
                        : `<span style="color: gray; font-size: 0.9em;">이미지 없음</span>`
                }
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
    window.location.href = `editProduct?prodNum=${prodNum}`;
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

// ✅ 이미지 보기 Modal 띄우기
function viewImage(imagePath) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const fullImageUrl = imagePath.startsWith('http') ? imagePath : `${API_BASE}/${imagePath}`;

    modalImg.src = fullImageUrl;
    modal.style.display = "block";
}

// ✅ Modal 닫기
document.querySelector(".close").onclick = function () {
    document.getElementById('imageModal').style.display = "none";
};

// 클릭해서 모달 바깥 영역 클릭시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
