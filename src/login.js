import mysql from "mysql";
import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import helper function for ES modules
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kst017@anits",
    database: "faculty"
});

// Connect to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database successfully!!!");
});

// Serve Login.html file
app.get("/", function (req, res) {
    const filePath = path.join(__dirname, "../templates/Login.html");
    res.sendFile(filePath);
});

// Handle login POST request
app.post("/", function (req, res) {
    console.log("POST request received");
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        "SELECT College_Mail, Password FROM FacultyInfo WHERE College_Mail = ? AND Password = ?",
        [email, password],
        function (error, results) {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                // Redirect to profile route on success
                res.redirect("/profile");
            } else {
                // Redirect back to login on failure
                res.redirect("/");
            }
        }
    );
});

// Serve Profile.html for successful login
app.get("/profile", function (req, res) {
    const filePath = path.join(__dirname, "../templates/Profile.html");
    res.sendFile(filePath);
});

// Set app port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
