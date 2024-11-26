import express from 'express';
import connection from '../config/db.js';

const router = express.Router();

// Render login page
router.get('/', (req, res) => {
  res.render('pages/login', { errorMessage: null });
});

// Handle login form submission
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM facultyinfo WHERE College_Mail = ? AND Password = ?";

  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).render('pages/login', { errorMessage: 'Database error. Please try again.' });
    }
    if (results.length > 0) {
      res.redirect('/dashboard');
    } else {
      res.render('pages/login', { errorMessage: 'Invalid email or password.' });
    }
  });
});

export default router;
