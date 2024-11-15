// Sample timetable data structure
const timetableData = {
    '2024-25-sem1': {
        timeSlots: [
            '8:45-9:45', '9:45-10:35', '10:35-11:25', '11:25-12:15',
            '12:15-1:05', '1:55-2:45', '2:45-3:35'
        ],
        schedule: {
            Monday: [
                { type: 'class', subject: 'ML Lab', room: '303' },
                { type: 'free' },
                { type: 'class', subject: 'CP', room: '405' },
                { type: 'class', subject: 'QA-III', room: '302' },
                { type: 'free' },
                { type: 'lab', subject: 'ML Lab', room: 'ML Lab' },
                { type: 'free' }
            ],
            Tuesday: [
                { type: 'class', subject: 'CP', room: '303' },
                { type: 'class', subject: 'ADS', room: '405' },
                { type: 'class', subject: 'DBMS', room: '302' },
                { type: 'class', subject: 'BC', room: '304' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Wednesday: [
                { type: 'class', subject: 'DBMS', room: '303' },
                { type: 'lab', subject: 'CP Lab', room: 'CP Lab' },
                { type: 'lab', subject: 'CP Lab', room: 'CP Lab' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Thursday: [
                { type: 'class', subject: 'ADS', room: '303' },
                { type: 'lab', subject: 'DBMS Lab', room: 'DB Lab' },
                { type: 'lab', subject: 'DBMS Lab', room: 'DB Lab' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Friday: [
                { type: 'class', subject: 'ML', room: '303' },
                { type: 'class', subject: 'DBMS', room: '405' },
                { type: 'class', subject: 'ADS', room: '302' },
                { type: 'class', subject: 'CP', room: '304' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Saturday: [
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ]
        }
    },
    '2024-25-sem2': {
        // Similar structure for semester 2
        timeSlots: [
            '8:45-9:45', '9:45-10:35', '10:35-11:25', '11:25-12:15',
            '12:15-1:05', '1:55-2:45', '2:45-3:35'
        ],
        schedule: {
            // Different schedule for semester 2
        }
    }
};

function renderTimetable(semester) {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';

    const data = timetableData[semester];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    data.timeSlots.forEach((timeSlot, index) => {
        const row = document.createElement('tr');
        
        // Time column
        const timeCell = document.createElement('td');
        timeCell.className = 'time-column';
        timeCell.textContent = timeSlot;
        row.appendChild(timeCell);

        // Day columns
        days.forEach(day => {
            const cell = document.createElement('td');
            const slot = data.schedule[day][index];

            if (slot.type === 'class') {
                cell.innerHTML = `<div class="class-slot">
                    <strong>${slot.subject}</strong><br>
                    Room: ${slot.room}
                </div>`;
            } else if (slot.type === 'lab') {
                cell.innerHTML = `<div class="lab-slot">
                    <strong>${slot.subject}</strong><br>
                    ${slot.room}
                </div>`;
            } else {
                cell.innerHTML = '<div class="free-slot">Free Period</div>';
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

// Event listener for semester selection
document.getElementById('semesterSelect').addEventListener('change', (e) => {
    renderTimetable(e.target.value);
});

// Initial render
renderTimetable('2024-25-sem1');