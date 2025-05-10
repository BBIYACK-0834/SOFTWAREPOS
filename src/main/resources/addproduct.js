const API_BASE = "https://softwarepos.r-e.kr";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const urlParams = new URLSearchParams(window.location.search);
    const prodNum = urlParams.get('prodNum');
    const errorBox = document.getElementById("error-message");

    if (prodNum) {
        // ✅ prodNum 있으면 수정 모드: 기존 상품 정보 불러오기
        fetch(`${API_BASE}/user/products/${prodNum}`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = "login";
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
    }

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

        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(product)], { type: 'application/json' }));

        const fileInput = document.getElementById('prodImage');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        if (prodNum) {
            // ✅ 수정(업데이트)
            fetch(`${API_BASE}/admin/products/${prodNum}`, {
                method: 'PUT',
                credentials: "include",
                body: formData
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        window.location.href = "login";
                        return;
                    }
                    if (!res.ok) throw new Error("수정 실패");
                    alert('✅ 상품이 수정되었습니다.');
                    window.location.href = 'sales';
                })
                .catch(err => {
                    errorBox.textContent = '❌ 상품 수정 중 오류가 발생했습니다.';
                    console.error(err);
                });

        } else {
            // ✅ 추가(등록)
            fetch(`${API_BASE}/admin/products`, {
                method: 'POST',
                credentials: "include",
                body: formData
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        window.location.href = "login";
                        return;
                    }
                    if (!res.ok) throw new Error("등록 실패");
                    alert('✅ 상품이 등록되었습니다.');
                    window.location.href = 'sales';
                })
                .catch(err => {
                    errorBox.textContent = '❌ 상품 등록 중 오류가 발생했습니다.';
                    console.error(err);
                });
        }
    });
});
