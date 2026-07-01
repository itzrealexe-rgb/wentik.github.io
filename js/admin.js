const ADMIN_ID = '1406997807998701578';

function isAdmin(userId) {
    return userId === ADMIN_ID;
}

function checkAdmin() {
    const user = getUser();
    if (!user) return false;
    return isAdmin(user.id);
}

// Имба: при входе админа показываем приветствие
document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user && isAdmin(user.id)) {
        console.log('👑 Admin logged in!');
        // Можно добавить звездочки или эффект
    }
});