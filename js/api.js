const API_BASE = 'discrod-aternos-server-production.up.railway.app

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    return response.json();
}

async function getTasks() {
    return apiRequest('/discord-bot-aternos-api/tasks');
}

async function createTask(domain, response, duration) {
    return apiRequest(`/discord-bot-aternos-api/make-task?domain=${domain}&response=${encodeURIComponent(response)}&duration=${duration}`);
}

async function postData(domain, data) {
    return apiRequest('/discord-bot-aternos-api/post-data', {
        method: 'POST',
        body: JSON.stringify({ domain, data })
    });
}
