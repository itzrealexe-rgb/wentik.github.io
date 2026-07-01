const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function loadServers() {
    const container = document.getElementById('server-list');
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const res = await fetch(`${API_BASE}/api/servers`);
        const data = await res.json();
        const servers = Object.values(data.servers || {});

        if (!servers.length) {
            container.innerHTML = '<div class="empty">📭 No servers found.</div>';
            return;
        }

        container.innerHTML = servers.map(s => `
            <div class="server-item">
                <div>
                    <div class="server-name">${s.name || 'Unknown'}</div>
                    <div class="server-info">🆔 ${s.id} • 👥 ${s.memberCount || 0} members</div>
                </div>
                <span class="server-status">● Online</span>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<div class="error">❌ Failed to load servers</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadServers);