// In-memory storage for achievements
const achievements = {
    projects: [],
    patents: [],
    publications: [],
    trainings: [],
    achievements: []
};

let currentType = '';

function openModal(type) {
    currentType = type;
    document.getElementById('modalTitle').textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('achievementModal').style.display = 'block';
    resetFormFields(type);
}

function closeModal() {
    document.getElementById('achievementModal').style.display = 'none';
    document.getElementById('achievementForm').reset();
}

function resetFormFields(type) {
    const form = document.getElementById('achievementForm');
    form.reset();
    form.onsubmit = function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (title && description && startDate && endDate) {
            const achievement = {
                title,
                description,
                startDate,
                endDate,
            };
            achievements[currentType].push(achievement);
            renderAchievements();
            closeModal();
        }
    };
}

function renderAchievements() {
    for (let type in achievements) {
        const listElement = document.getElementById(`${type}List`);
        listElement.innerHTML = '';
        achievements[type].forEach((achievement, index) => {
            const achievementElement = document.createElement('div');
            achievementElement.classList.add('achievement-item');
            achievementElement.innerHTML = `
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                    <p><strong>Start Date:</strong> ${achievement.startDate}</p>
                    <p><strong>End Date:</strong> ${achievement.endDate}</p>
                </div>
                <div class="achievement-actions">
                    <button class="edit-btn" onclick="editAchievement('${type}', ${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteAchievement('${type}', ${index})">Delete</button>
                </div>
            `;
            listElement.appendChild(achievementElement);
        });
    }
}

function editAchievement(type, index) {
    const achievement = achievements[type][index];
    document.getElementById('title').value = achievement.title;
    document.getElementById('description').value = achievement.description;
    document.getElementById('start-date').value = achievement.startDate;
    document.getElementById('end-date').value = achievement.endDate;

    openModal(type);
    const form = document.getElementById('achievementForm');
    form.onsubmit = function (e) {
        e.preventDefault();
        achievement.title = document.getElementById('title').value;
        achievement.description = document.getElementById('description').value;
        achievement.startDate = document.getElementById('start-date').value;
        achievement.endDate = document.getElementById('end-date').value;
        renderAchievements();
        closeModal();
    };
}

function deleteAchievement(type, index) {
    achievements[type].splice(index, 1);
    renderAchievements();
}

// Initial render
renderAchievements();
