const API_BASE = 'discrod-aternos-server-production.up.railway.app

async function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Загрузка статистики
        const statsRes = await fetch(`${API_BASE}/discord-bot-aternos-api/stats`);
        const stats = await statsRes.json();

        document.getElementById('total-servers').textContent = stats.stats?.totalTasks || 0;
        document.getElementById('total-users').textContent = stats.stats?.totalRequests || 0;
        document.getElementById('total-uptime').textContent = Math.floor(stats.stats?.uptime / 3600) + 'h';

        // Загрузка списка серверов
        const serversRes = await fetch(`${API_BASE}/discord-bot-aternos-api/tasks`);
        const servers = await serversRes.json();
        
        const list = document.getElementById('server-list');
        list.innerHTML = '';
        for (const [id, task] of Object.entries(servers.tasks || {})) {
            const div = document.createElement('div');
            div.className = 'server-item';
            div.innerHTML = `
                <span>${id}</span>
                <span>${task.requests} requests</span>
                <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                <button onclick="deleteTask('${id}')" class="btn btn-danger">Delete</button>
            `;
            list.appendChild(div);
        }
    } catch (e) {
        console.error('Dashboard error:', e);
    }
}

async function deleteTask(id) {
    if (!confirm(`Delete task ${id}?`)) return;
    try {
        await fetch(`${API_BASE}/discord-bot-aternos-api/task/${id}`, {
            method: 'DELETE',
            headers: { 'x-api-key': localStorage.getItem('adminKey') || '' }
        });
        loadDashboard();
    } catch (e) {
        alert('Failed to delete task');
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
