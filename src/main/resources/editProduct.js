const API_BASE = "https://softwarepos.r-e.kr";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const urlParams = new URLSearchParams(window.location.search);
    const prodNum = urlParams.get('prodNum');
    const errorBox = document.getElementById("error-message");
    const preview = document.getElementById("preview");
    const pageTitle = document.getElementById('pageTitle');

    if (prodNum) {
        // 수정 모드
        pageTitle.textContent = "상품 수정";

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
                if (data.prodImage) {
                    preview.src = `${API_BASE}/${data.prodImage}`;
                    preview.style.display = 'block';
                }
            })
            .catch(err => {
                errorBox.textContent = '상품 정보를 불러오지 못했습니다.';
                console.error(err);
            });
    }

    // 파일 선택시 이미지 미리보기
    document.getElementById('prodImage').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorBox.textContent = ''; // 초기화

        const name = document.getElementById('prodName').value.trim();
        const price = parseInt(document.getElementById('prodPri').value);

        if (!name || isNaN(price) || price < 0) {
            errorBox.textContent = '유효한 상품명과 0 이상의 가격을 입력하세요.';
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
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        const url = prodNum
            ? `${API_BASE}/admin/products/${prodNum}` // 수정
            : `${API_BASE}/admin/products`;           // 추가

        const method = prodNum ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            credentials: "include",
            body: formData
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = "login";
                    return;
                }
                if (!res.ok) throw new Error(prodNum ? "수정 실패" : "등록 실패");

                alert(prodNum ? '상품이 수정되었습니다.' : '✅ 상품이 등록되었습니다.');
                window.location.href = 'sales';
            })
            .catch(err => {
                errorBox.textContent = prodNum ? '상품 수정 중 오류 발생' : '상품 등록 중 오류 발생';
                console.error(err);
            });
    });
});
