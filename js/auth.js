const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

// ========== ПРАВИЛЬНЫЙ CLIENT ID (ЧИСЛО!) ==========
const DISCORD_CLIENT_ID = '1489179864006393876';
const REDIRECT_URI = 'https://aternos-dc-bot.vercel.app/'

// ========== КУКИ ==========
function setCookie(name, value, days = 30) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        try {
            return JSON.parse(decodeURIComponent(match[2]));
        } catch (e) {
            return null;
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ========== ПОЛЬЗОВАТЕЛЬ ==========
function getUser() {
    const cookieUser = getCookie('user');
    if (cookieUser) return cookieUser;
    
    const localUser = localStorage.getItem('user');
    if (localUser) {
        try {
            const parsed = JSON.parse(localUser);
            setCookie('user', parsed);
            return parsed;
        } catch (e) {}
    }
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    deleteCookie('user');
    deleteCookie('token');
    window.location.href = 'index.html';
}

// ========== ЛОГИН ==========
function loginWithDiscord() {
    const url = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
    window.location.href = url;
}

// ========== COOKIE CONSENT ==========
function showCookieConsent() {
    if (getCookie('cookie_consent')) return;
    
    const div = document.createElement('div');
    div.className = 'cookie-consent show';
    div.innerHTML = `
        <p>🍪 We use cookies to keep you logged in.</p>
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

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    showCookieConsent();
    
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        const user = getUser();
        if (user && user.username) {
            authBtn.textContent = `👤 ${user.username}`;
            authBtn.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        } else {
            authBtn.textContent = 'Login with Discord';
            authBtn.onclick = (e) => {
                e.preventDefault();
                loginWithDiscord();
            };
        }
    }
});

window.loginWithDiscord = loginWithDiscord;
window.logout = logout;
window.getUser = getUser;
window.getToken = getToken;