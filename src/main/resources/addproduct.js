const API_BASE = 'https://softwarepos.r-e.kr';

function handle401(res) {
    if (res.status === 401) {
        window.location.href = 'sales';
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const urlParams = new URLSearchParams(window.location.search);
    const prodNum = urlParams.get('prodNum');

    if (prodNum) {
        // 수정 모드
        fetch(`${API_BASE}/admin/products/${prodNum}`, {
            credentials: 'include'
        })
            .then(res => {
                if (handle401(res)) return;
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
                alert('상품 정보를 불러오지 못했습니다.');
                console.error(err);
            });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const product = {
            prodName: document.getElementById('prodName').value,
            prodIntro: document.getElementById('prodIntro').value,
            prodStatus: document.getElementById('prodStatus').value,
            prodPri: parseInt(document.getElementById('prodPri').value)
        };

        const method = prodNum ? 'PUT' : 'POST';
        const endpoint = prodNum
            ? `${API_BASE}/admin/products/${prodNum}`
            : `${API_BASE}/admin/products`;

        fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(product)
        })
            .then(res => {
                if (handle401(res)) return;
                if (!res.ok) throw new Error('상품 저장 실패');
                alert('상품이 저장되었습니다.');
                window.location.href = 'sales';
            })
            .catch(err => {
                alert('상품 저장 중 오류가 발생했습니다.');
                console.error(err);
            });
    });
});
