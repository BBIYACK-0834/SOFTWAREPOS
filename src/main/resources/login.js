function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://softwarepos.r-e.kr/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (res.ok) {
                window.location.href = "index";
            } else {
                throw new Error("로그인 실패");
            }
        })
        .catch(err => {
            document.getElementById("error-message").textContent = err.message;
        });
}
