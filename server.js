import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql';
import cookieParser from 'cookie-parser'; // Import cookie-parser

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'templates'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Loveyourself',
  database: 'faculty',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

connection.on('error', (err) => {
  console.error('Database error:', err);
});

// Serve static files
app.use('/templates', express.static(join(__dirname, 'templates')));
app.use('/action', express.static(join(__dirname, 'action')));
app.use('/src', express.static(join(__dirname, 'src')));

// Render the login page initially
app.get('/', (req, res) => {
  res.render('Login');
});

// Render the dashboard page with profile info if logged in
app.get('/dashboard', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/');  // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Pass the faculty data to the EJS view
      // console.log(results[0])
      res.render('Profile', { faculty: results[0] });
    }
  });
});

app.get('/profile', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/');  // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Pass the faculty data to the EJS view
      // console.log(results[0])
      res.render('Profile', { faculty: results[0] });
    }
  });
});

app.get('/achievements', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/');  // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Pass the faculty data to the EJS view
      // console.log(results[0])
      res.render('Achievements', { faculty: results[0] });
    }
  });
});

app.get('/timetable', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/');  // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM timetable WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Group data by day and period
      console.log(results.length)
      const timetable = {
        1: {}, // Monday
        2: {}, // Tuesday
        3: {}, // Wednesday
        4: {}, // Thursday
        5: {}  // Friday
      };

      results.forEach((row) => {
        const day = row.Day_of_Week;
        const period = row.Period_Number;
        timetable[day][period] = row.Course_Name;
      });

      res.render('TimeTable', { timetable });
    }
  });
});

app.get('/notifications', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/'); // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM notifications WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Pass all notifications to the EJS view
      res.render('Notifications', { notifications: results });
    }
  });
});

app.get('/performance', (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect('/'); // Redirect to login if no Faculty_ID cookie exists
  }

  const sql = "SELECT * FROM notifications WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Pass all notifications to the EJS view
      res.render('Performance', { notifications: results });
    }
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT Faculty_ID, College_Mail, Password FROM facultyinfo WHERE College_Mail = ? AND Password = ?";
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database error' });
    } else if (results.length > 0) {
      const facultyId = results[0].Faculty_ID;
      res.cookie('Faculty_ID', facultyId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 360000000
      });
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid login details' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
