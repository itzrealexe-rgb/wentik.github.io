const DISCORD_CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = 'https://wentik.github.io/callback.html';
const API_BASE = 'https://your-api.onrender.com';

function loginWithDiscord() {
    const url = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    window.location.href = url;
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        const user = getUser();
        if (user) {
            authBtn.textContent = `👤 ${user.username}`;
            authBtn.href = '#';
        } else {
            authBtn.textContent = 'Login with Discord';
            authBtn.href = '#';
            authBtn.addEventListener('click', loginWithDiscord);
        }
    }
});
