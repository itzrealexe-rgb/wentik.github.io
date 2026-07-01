const API_BASE = 'https://discrod-aternos-server-production.up.railway.app';

async function loadServers() {
    const container = document.getElementById('server-list');
    
    try {
        const res = await fetch(`${API_BASE}/api/servers`);
        const data = await res.json();
        
        const servers = Object.values(data.servers || {});
        
        if (servers.length === 0) {
            container.innerHTML = '<div style="color:#707070;text-align:center;padding:40px;">📭 No servers found. The bot is not in any servers yet.</div>';
            return;
        }
        
        let html = '';
        for (const s of servers) {
            html += `
                <div class="server-item">
                    <div>
                        <div class="server-name">${s.name || 'Unknown Server'}</div>
                        <div class="server-info">🆔 ${s.id} • 👥 ${s.memberCount || 0} members</div>
                    </div>
                    <div class="server-actions">
                        <span style="color:#00ff08;font-size:12px;">● Online</span>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<div style="color:#ED4245;text-align:center;padding:40px;">❌ Failed to load servers</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadServers);