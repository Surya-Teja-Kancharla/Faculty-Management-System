// In-memory storage for achievements
const achievements = {
    projects: [],
    patents: [],
    publications: [],
    trainings: [],
    achievements: []
};

let currentType = ''; // Stores the current type of achievement being added/edited

// Open the modal for adding achievements
function openModal(type) {
    currentType = type;  // Set the current type for the modal (projects, patents, etc.)
    document.getElementById('modalTitle').textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('achievementModal').style.display = 'block';
    resetFormFields();
}

// Close the modal and reset the form
function closeModal() {
    document.getElementById('achievementModal').style.display = 'none';
    document.getElementById('achievementForm').reset();  // Reset form fields
    currentType = '';  // Reset current type
}

// Reset form fields and set the correct submit handler for the current type
function resetFormFields() {
    const form = document.getElementById('achievementForm');
    
    // Reset the submit handler for the form
    form.onsubmit = function (e) {
        e.preventDefault();  // Prevent the default form submit action
        
        // Get the values from form fields
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        // Validation for required fields
        if (title && description && startDate && endDate) {
            const achievement = {
                title,
                description,
                startDate,
                endDate
            };

            // Add the new achievement to the current type's list
            achievements[currentType].push(achievement);

            // Re-render all achievements after adding
            renderAchievements();
            closeModal();  // Close the modal after saving
        } else {
            alert("All fields are required.");
        }
    };
}

// Render all achievements for each section (projects, patents, etc.)
function renderAchievements() {
    // Loop through each type (projects, patents, etc.)
    for (let type in achievements) {
        const listElement = document.getElementById(`${type}List`);
        listElement.innerHTML = '';  // Clear existing list

        // Render each achievement in the list
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
            listElement.appendChild(achievementElement);  // Append new element
        });
    }
}

// Edit an existing achievement
function editAchievement(type, index) {
    const achievement = achievements[type][index];
    document.getElementById('title').value = achievement.title;
    document.getElementById('description').value = achievement.description;
    document.getElementById('start-date').value = achievement.startDate;
    document.getElementById('end-date').value = achievement.endDate;

    openModal(type);  // Open modal for editing

    // Update the submit handler for editing the achievement
    const form = document.getElementById('achievementForm');
    form.onsubmit = function (e) {
        e.preventDefault();  // Prevent default form submit

        // Update the achievement with new values
        achievement.title = document.getElementById('title').value;
        achievement.description = document.getElementById('description').value;
        achievement.startDate = document.getElementById('start-date').value;
        achievement.endDate = document.getElementById('end-date').value;

        // Re-render achievements after editing
        renderAchievements();
        closeModal();  // Close modal after editing
    };
}

// Delete an achievement
function deleteAchievement(type, index) {
    achievements[type].splice(index, 1);  // Remove achievement from the list
    renderAchievements();  // Re-render the list after deletion
}

// Initial render when the page loads (just in case there are already achievements stored)
renderAchievements();
