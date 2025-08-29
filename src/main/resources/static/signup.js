document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://43.204.36.150:8080/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            // Show success message
            document.getElementById('signupError').style.display = 'none';
            document.getElementById('signupSuccess').textContent = 'Registration successful! Redirecting to login...';
            document.getElementById('signupSuccess').style.display = 'block';

            // Clear form
            document.getElementById('signupForm').reset();

            // Redirect to login page after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }
    } catch (error) {
        document.getElementById('signupSuccess').style.display = 'none';
        document.getElementById('signupError').textContent = error.message;
        document.getElementById('signupError').style.display = 'block';
    }
});
