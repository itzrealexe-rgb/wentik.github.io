const API_BASE = 'discrod-aternos-server-production.up.railway.app

async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE}/discord-bot-aternos-api/stats`);
        const data = await res.json();
        
        document.getElementById('stat-servers').textContent = data.stats?.totalTasks || 0;
        document.getElementById('stat-users').textContent = data.stats?.totalRequests || 0;
        document.getElementById('stat-uptime').textContent = Math.floor(data.stats?.uptime / 3600) + 'h';
    } catch (e) {
        console.error('Failed to fetch stats:', e);
    }
}

document.addEventListener('DOMContentLoaded', fetchStats);
