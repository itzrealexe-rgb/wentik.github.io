const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

// Админ ID — твой Discord ID
const ADMIN_ID = '1489179864006393876';

async function loadDashboard() {
    const user = getUser();
    if (!user || !user.id) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('dashboard-content');
    container.innerHTML = '<div class="loading">Loading</div>';

    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();

        let html = `
            <h1 style="color:#fff;font-size:28px;margin-bottom:10px;">📊 Dashboard</h1>
            <p style="color:#a0a0a0;margin-bottom:20px;">Welcome back, ${user.username}! 👋</p>
            
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="number">${data.stats?.servers || 0}</div>
                    <div class="label">Servers</div>
                </div>
                <div class="dashboard-card">
                    <div class="number">${data.stats?.users || 0}</div>
                    <div class="label">Users</div>
                </div>
                <div class="dashboard-card">
                    <div class="number">${Math.floor(data.stats?.uptime / 3600)}h</div>
                    <div class="label">Uptime</div>
                </div>
                <div class="dashboard-card">
                    <div class="number">${data.stats?.totalRequests || 0}</div>
                    <div class="label">Requests</div>
                </div>
            </div>
        `;

        // ========== АДМИН ПАНЕЛЬ ==========
        if (user.id === ADMIN_ID) {
            html += `
                <div style="margin-top:40px;padding:20px;background:rgba(235,69,158,0.1);border:1px solid rgba(235,69,158,0.2);border-radius:16px;">
                    <h2 style="color:#EB459E;font-size:20px;margin-bottom:16px;">👑 Admin Panel</h2>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;">
                        <button onclick="adminAction('servers')" class="btn btn-primary" style="font-size:12px;">📡 List Servers</button>
                        <button onclick="adminAction('users')" class="btn btn-primary" style="font-size:12px;">👥 List Users</button>
                        <button onclick="adminAction('stats')" class="btn btn-primary" style="font-size:12px;">📊 Refresh Stats</button>
                        <button onclick="adminAction('clear')" class="btn btn-danger" style="font-size:12px;">🗑️ Clear Cache</button>
                    </div>
                    <div id="admin-output" style="margin-top:16px;color:#a0a0a0;font-size:14px;"></div>
                </div>
            `;
        }

        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<div style="color:#ED4245;text-align:center;padding:40px;">❌ Failed to load dashboard</div>';
    }
}

// ========== АДМИН ДЕЙСТВИЯ ==========
async function adminAction(action) {
    const output = document.getElementById('admin-output');
    if (!output) return;
    
    output.innerHTML = '⏳ Processing...';
    
    try {
        if (action === 'servers') {
            const res = await fetch(`${API_BASE}/api/servers`);
            const data = await res.json();
            let list = '📡 **Servers:**\n';
            for (const [id, s] of Object.entries(data.servers || {})) {
                list += `• ${s.name || id} — ${s.memberCount || 0} members\n`;
            }
            output.innerHTML = list || 'No servers found.';
        } else if (action === 'users') {
            const res = await fetch(`${API_BASE}/api/users`);
            const data = await res.json();
            let list = '👥 **Users:**\n';
            for (const [id, u] of Object.entries(data.users || {})) {
                list += `• ${u.username || id}\n`;
            }
            output.innerHTML = list || 'No users found.';
        } else if (action === 'stats') {
            const res = await fetch(`${API_BASE}/api/stats`);
            const data = await res.json();
            output.innerHTML = `📊 Stats updated: ${data.stats?.servers || 0} servers, ${data.stats?.users || 0} users`;
        } else if (action === 'clear') {
            localStorage.clear();
            document.cookie.split(';').forEach(c => {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            output.innerHTML = '✅ Cache cleared! Refreshing...';
            setTimeout(() => window.location.reload(), 1000);
        }
    } catch (e) {
        output.innerHTML = '❌ Error: ' + e.message;
    }
}

// ========== EXPORT ==========
window.adminAction = adminAction;

document.addEventListener('DOMContentLoaded', loadDashboard);