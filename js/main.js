const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();
        
        const servers = document.getElementById('stat-servers');
        const users = document.getElementById('stat-users');
        const uptime = document.getElementById('stat-uptime');
        
        if (servers) servers.textContent = data.stats?.servers || 0;
        if (users) users.textContent = data.stats?.users || 0;
        if (uptime) uptime.textContent = Math.floor(data.stats?.uptime / 3600) + 'h';
    } catch (e) {
        console.error('Failed to fetch stats:', e);
    }
}

document.addEventListener('DOMContentLoaded', fetchStats);