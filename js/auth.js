const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';
const DISCORD_CLIENT_ID = 'rem7AyKKqHBm9i_c8jeTpTYovHQaDqE1';
const REDIRECT_URI = 'https://itzrealexe-rgb.github.io/wentik.github.io/callback.html';

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
        } else {
            authBtn.textContent = 'Login with Discord';
            authBtn.addEventListener('click', loginWithDiscord);
        }
    }
});