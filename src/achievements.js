// In-memory storage for achievements
const achievements = {
    projects: [],
    patents: [],
    publications: [],
    trainings: []
};

let currentType = '';

function openModal(type) {
    currentType = type;
    document.getElementById('modalTitle').textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('achievementModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('achievementModal').style.display = 'none';
    document.getElementById('achievementForm').reset();
}

function addAchievement(type, achievement) {
    achievements[type + 's'].push(achievement);
    renderAchievements(type);
}

function deleteAchievement(type, index) {
    achievements[type + 's'].splice(index, 1);
    renderAchievements(type);
}

function renderAchievements(type) {
    const container = document.getElementById(`${type}sList`);
    container.innerHTML = '';

    achievements[type + 's'].forEach((achievement, index) => {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.innerHTML = `
            <div class="achievement-info">
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
                <p>Date: ${achievement.date}</p>
            </div>
            <div class="achievement-actions">
                <button class="edit-btn" onclick="editAchievement('${type}', ${index})">Edit</button>
                <button class="delete-btn" onclick="deleteAchievement('${type}', ${index})">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

document.getElementById('achievementForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const achievement = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };

    addAchievement(currentType, achievement);
    closeModal();
});

// Initialize the page
['project', 'patent', 'publication', 'training'].forEach(type => {
    renderAchievements(type);
});