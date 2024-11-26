const timetableData = {
    '2024-25-3-1': {
        timeSlots: [
            '8:45-9:45', '9:45-10:35', '10:35-11:25', '11:25-12:15',
            '12:15-1:05', '1:05-1:55', '1:55-2:45', '2:45-3:35'
        ],
        schedule: {
            Monday: [
                { type: 'class', subject: 'ML Lab' },
                { type: 'class', subject: 'ML Lab' },
                { type: 'class', subject: 'ML Lab' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Tuesday: [
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Wednesday: [
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Thursday: [
                { type: 'class', subject: 'DBMS Lab' },
                { type: 'class', subject: 'DBMS Lab' },
                { type: 'class', subject: 'DBMS Lab' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Friday: [
                { type: 'class', subject: 'DBMS' },
                { type: 'class', subject: 'DBMS' },
                { type: 'class', subject: 'DBMS' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ],
            Saturday: [
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' },
                { type: 'lunch' },
                { type: 'free' },
                { type: 'free' },
                { type: 'free' }
            ]
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
        
        const timeCell = document.createElement('td');
        timeCell.className = 'time-column';
        timeCell.textContent = timeSlot;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            const slot = data.schedule[day][index];

            if (slot.type === 'class') {
                cell.innerHTML = `<div class="class-slot">
                    <strong>${slot.subject}</strong>
                </div>`;
            } else {
                cell.innerHTML = '<div class="free-slot">Free Period</div>';
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

document.getElementById('semesterSelect').addEventListener('change', (e) => {
    renderTimetable(e.target.value);
});

renderTimetable('2024-25-3-1');
