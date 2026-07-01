const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();
        document.getElementById('stat-servers').textContent = data.stats?.servers || 0;
        document.getElementById('stat-users').textContent = data.stats?.users || 0;
        document.getElementById('stat-uptime').textContent = Math.floor(data.stats?.uptime / 3600) + 'h';
    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', fetchStats);