const API_BASE = "https://softwarepos.r-e.kr:8080";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const urlParams = new URLSearchParams(window.location.search);
    const prodNum = urlParams.get('prodNum');
    const errorBox = document.getElementById("error-message");

    if (!prodNum) {
        errorBox.textContent = '❌ 상품 번호가 없습니다.';
        return;
    }

    // 기존 상품 정보 불러오기
    fetch(`${API_BASE}/admin/products/${prodNum}`, {
        credentials: "include"
    })
        .then(res => {
            if (res.status === 401) {
                window.location.href = "login.html";
                return;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById('prodName').value = data.prodName;
            document.getElementById('prodIntro').value = data.prodIntro;
            document.getElementById('prodStatus').value = data.prodStatus;
            document.getElementById('prodPri').value = data.prodPri;
        })
        .catch(err => {
            errorBox.textContent = '❌ 상품 정보를 불러오지 못했습니다.';
            console.error(err);
        });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorBox.textContent = ''; // 초기화

        const name = document.getElementById('prodName').value.trim();
        const price = parseInt(document.getElementById('prodPri').value);

        if (!name || isNaN(price) || price < 0) {
            errorBox.textContent = '❗ 유효한 상품명과 0 이상의 가격을 입력하세요.';
            return;
        }

        const product = {
            prodName: name,
            prodIntro: document.getElementById('prodIntro').value,
            prodStatus: document.getElementById('prodStatus').value,
            prodPri: price
        };

        fetch(`${API_BASE}/admin/products/${prodNum}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(product)
        })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = "login.html";
                    return;
                }
                if (!res.ok) throw new Error("수정 실패");
                alert('✅ 상품이 수정되었습니다.');
                window.location.href = 'sales.html';
            })
            .catch(err => {
                errorBox.textContent = '❌ 상품 수정 중 오류가 발생했습니다.';
                console.error(err);
            });
    });
});
