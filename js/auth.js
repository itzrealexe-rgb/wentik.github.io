const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';
let CONFIG = null;

async function loadConfig() {
    if (CONFIG) return CONFIG;
    try {
        const res = await fetch('/informat.json');
        CONFIG = await res.json();
        return CONFIG;
    } catch (e) {
        console.error('Config load error:', e);
        return null;
    }
}

function setCookie(name, value, days = 30) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        try { return JSON.parse(decodeURIComponent(match[2])); } catch { return null; }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getUser() {
    const c = getCookie('user');
    if (c) return c;
    const l = localStorage.getItem('user');
    if (l) { try { const p = JSON.parse(l); setCookie('user', p); return p; } catch {} }
    return null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    setCookie('user', user);
}

function setToken(token) {
    localStorage.setItem('token', token);
    setCookie('token', token);
}

function getToken() {
    return getCookie('token') || localStorage.getItem('token');
}

function logout() {
    localStorage.clear();
    ['user', 'token', 'cookie_consent'].forEach(c => deleteCookie(c));
    window.location.href = '/';
}

async function loginWithDiscord() {
    const config = await loadConfig();
    if (!config) { alert('Config error'); return; }
    const url = `https://discord.com/oauth2/authorize?client_id=${config.discord.clientId}&redirect_uri=${encodeURIComponent(config.discord.redirectUri)}&response_type=code&scope=identify%20guilds`;
    window.location.href = url;
}

function updateAuthButton() {
    const user = getUser();
    const btns = document.querySelectorAll('.auth-btn');
    btns.forEach(btn => {
        if (user && user.username) {
            btn.textContent = `👤 ${user.username}`;
            btn.onclick = (e) => { e.preventDefault(); logout(); };
        } else {
            btn.textContent = 'Login with Discord';
            btn.onclick = (e) => { e.preventDefault(); loginWithDiscord(); };
        }
    });
}

function showCookieConsent() {
    if (getCookie('cookie_consent')) return;
    const div = document.createElement('div');
    div.className = 'cookie-consent show';
    div.innerHTML = `
        <p>🍪 We use cookies.</p>
        <button class="btn btn-primary" id="accept-cookies">Accept</button>
        <button class="btn btn-secondary" id="decline-cookies">Decline</button>
    `;
    document.body.appendChild(div);
    document.getElementById('accept-cookies').onclick = () => {
        setCookie('cookie_consent', true);
        div.remove();
    };
    document.getElementById('decline-cookies').onclick = () => {
        setCookie('cookie_consent', false);
        div.remove();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    showCookieConsent();
    updateAuthButton();
});

window.loginWithDiscord = loginWithDiscord;
window.logout = logout;
window.getUser = getUser;
window.getToken = getToken;
window.loadConfig = loadConfig;
window.updateAuthButton = updateAuthButton;