const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();
        document.getElementById('stats').innerHTML = `
            <div style="display:flex;gap:40px;margin-top:20px;">
                <div><strong style="color:#fff;">Servers:</strong> ${data.stats?.servers || 0}</div>
                <div><strong style="color:#fff;">Users:</strong> ${data.stats?.users || 0}</div>
                <div><strong style="color:#fff;">Uptime:</strong> ${Math.floor(data.stats?.uptime / 3600)}h</div>
            </div>
        `;
    } catch (e) {
        document.getElementById('stats').textContent = '❌ Failed to load stats';
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);