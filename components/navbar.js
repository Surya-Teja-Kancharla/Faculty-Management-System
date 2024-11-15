// Navbar Component
function createNavbar(currentPage) {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="logo">Faculty Portal</div>
        <div class="nav-links">
            <a href="/Profile.html" ${currentPage === 'profile' ? 'class="active"' : ''}>Profile</a>
            <a href="/Achievements.html" ${currentPage === 'achievements' ? 'class="active"' : ''}>Achievements</a>
            <a href="/TimeTable.html" ${currentPage === 'timetable' ? 'class="active"' : ''}>Time Table</a>
            <a href="/Notifications.html" ${currentPage === 'notifications' ? 'class="active"' : ''}>Notifications</a>
            <a href="/Performance.html" ${currentPage === 'performance' ? 'class="active"' : ''}>Performance</a>
            <a href="/Login.html" id="logoutBtn">Logout</a>
        </div>
    `;
    return navbar;
}

// Navbar Styles
const navbarStyles = `
    .navbar {
        background: #1e4d92;
        padding: 1rem 2rem;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-links {
        display: flex;
        gap: 2rem;
    }

    .nav-links a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background 0.3s;
    }

    .nav-links a:hover, .nav-links a.active {
        background: rgba(255, 255, 255, 0.1);
    }
`;

// Export functions
export { createNavbar, navbarStyles };