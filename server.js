import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// In-memory storage
const db = {
  faculty: [
    {
      id: 1,
      name: 'John Doe',
      qualification: 'Ph.D. in Computer Science',
      experience: 10,
      gender: 'Male',
      personal_email: 'john.doe@gmail.com',
      college_email: 'john.doe@college.edu',
      phone: '1234567890',
      department: 'CSM',
      designation: 'Associate Professor',
      joining_date: '2020-01-01',
      address: '123 Faculty Street',
      password: 'password123'
    }
  ]
};

// Middleware
app.use(express.json());
app.use(express.static('templates'));
app.use(express.static('action'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'templates', 'Login.html'));
});

// API Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const faculty = db.faculty.find(f => 
    (f.college_email === email || f.personal_email === email) && f.password === password
  );
  
  if (faculty) {
    res.json({ success: true, facultyId: faculty.id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Profile routes
app.get('/api/profile', (req, res) => {
  const faculty = db.faculty[0]; // For demo, always return first faculty
  if (faculty) {
    res.json(faculty);
  } else {
    res.status(404).json({ message: 'Profile not found' });
  }
});

app.post('/api/profile', (req, res) => {
  const profileData = req.body;
  try {
    // Update the first faculty member's data
    Object.assign(db.faculty[0], {
      name: profileData.name,
      qualification: profileData.qualification,
      experience: parseInt(profileData.experience),
      gender: profileData.gender,
      personal_email: profileData.personalEmail,
      college_email: profileData.collegeEmail,
      phone: profileData.phone,
      department: profileData.department,
      designation: profileData.designation,
      joining_date: profileData.joiningDate,
      address: profileData.address
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});