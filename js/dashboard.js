const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function loadDashboard() {
    const user = getUser();
    if (!user) {
        window.location.href = '/';
        return;
    }

    const container = document.getElementById('dashboard-content');
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const config = await loadConfig();
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();
        const stats = data.stats || {};

        let html = `
            <div class="dashboard-header">
                <h1>📊 Dashboard</h1>
                <p>Welcome back, <strong>${user.username}</strong>!</p>
            </div>
            <div class="dashboard-grid">
                <div class="dashboard-card"><div class="number">${stats.servers || 0}</div><div class="label">Servers</div></div>
                <div class="dashboard-card"><div class="number">${stats.users || 0}</div><div class="label">Users</div></div>
                <div class="dashboard-card"><div class="number">${Math.floor(stats.uptime / 3600)}h</div><div class="label">Uptime</div></div>
                <div class="dashboard-card"><div class="number">${stats.totalRequests || 0}</div><div class="label">Requests</div></div>
            </div>
        `;

        // Admin Panel
        if (config && user.id === config.admin.userId) {
            html += `
                <div class="admin-panel">
                    <h2>👑 Admin Panel</h2>
                    <div class="admin-buttons">
                        <button onclick="adminAction('servers')" class="btn btn-primary">📡 Servers</button>
                        <button onclick="adminAction('users')" class="btn btn-primary">👥 Users</button>
                        <button onclick="adminAction('stats')" class="btn btn-primary">📊 Refresh</button>
                        <button onclick="adminAction('clear')" class="btn btn-danger">🗑️ Clear Cache</button>
                    </div>
                    <div id="admin-output" class="admin-output"></div>
                </div>
            `;
        }

        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<div class="error">❌ Failed to load dashboard</div>';
    }
}

async function adminAction(action) {
    const output = document.getElementById('admin-output');
    if (!output) return;
    output.textContent = '⏳ Processing...';

    try {
        let text = '';
        if (action === 'servers') {
            const res = await fetch(`${API_BASE}/api/servers`);
            const data = await res.json();
            const list = Object.values(data.servers || {});
            text = list.length ? list.map(s => `• ${s.name || s.id} — ${s.memberCount || 0} members`).join('\n') : 'No servers.';
        } else if (action === 'users') {
            const res = await fetch(`${API_BASE}/api/users`);
            const data = await res.json();
            const list = Object.values(data.users || {});
            text = list.length ? list.map(u => `• ${u.username || u.id}`).join('\n') : 'No users.';
        } else if (action === 'stats') {
            const res = await fetch(`${API_BASE}/api/stats`);
            const data = await res.json();
            text = `✅ Updated: ${data.stats?.servers || 0} servers, ${data.stats?.users || 0} users`;
        } else if (action === 'clear') {
            localStorage.clear();
            ['user', 'token', 'cookie_consent'].forEach(c => document.cookie = c + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
            text = '✅ Cache cleared! Refreshing...';
            setTimeout(() => location.reload(), 1000);
        }
        output.textContent = text;
    } catch (e) {
        output.textContent = '❌ Error: ' + e.message;
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
window.adminAction = adminAction;