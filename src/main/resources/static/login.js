document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://43.204.36.150:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (res.ok) {
        const user = await res.json();
        localStorage.setItem('userId', user.id);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
});
