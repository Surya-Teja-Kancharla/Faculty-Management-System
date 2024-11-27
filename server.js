import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import async from "async";
import bodyParser from "body-parser";
// const bodyParser = require('body-parser'); // Ensure this package is installed


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", join(__dirname, "templates"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Loveyourself",
  database: "faculty",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

connection.on("error", (err) => {
  console.error("Database error:", err);
});
app.use("/templates", express.static(join(__dirname, "templates")));
app.use("/action", express.static(join(__dirname, "action")));
app.use("/src", express.static(join(__dirname, "src")));
app.get("/", (req, res) => {
  res.render("Login");
});
app.get("/dashboard", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect("/");
  }

  const sql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.render("Profile", { faculty: results[0] });
    }
  });
});

app.get("/profile", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect("/");
  }

  const sql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.render("Profile", { faculty: results[0] });
    }
  });
});

app.post("/updateProfile", (req, res) => {
  const facultyId = req.cookies.Faculty_ID; // Ensure cookies middleware is set up
  if (!facultyId) {
    return res.redirect("/");
  }

  const {
    name,
    experience,
    gender,
    personalEmail,
    collegeEmail,
    phone,
    department,
    designation,
    joiningDate,
    address,
  } = req.body;

  const updateSql = `
    UPDATE facultyinfo 
    SET Name = ?, Experience = ?, Gender = ?, Personal_Mail = ?, College_Mail = ?, 
        Phone_Number = ?, Department = ?, Designation = ?, Joining_Date = ?, Address = ? 
    WHERE Faculty_ID = ?`;

  const values = [
    name,
    experience,
    gender,
    personalEmail,
    collegeEmail,
    phone,
    department,
    designation,
    joiningDate,
    address,
    facultyId,
  ];

  connection.query(updateSql, values, (err, results) => {
    if (err) {
      console.error("Database Error: ", err);
      return res.status(500).json({ message: "Database update error" });
    }

    // Fetch the updated data
    const fetchSql = "SELECT * FROM facultyinfo WHERE Faculty_ID = ?";
    connection.query(fetchSql, [facultyId], (err, rows) => {
      if (err) {
        console.error("Error fetching updated data: ", err);
        return res.status(500).json({ message: "Error fetching updated data" });
      }

      // Send the updated data back to the client
      // res.render("Profile", { faculty: rows[0] });
      res.status(200).json({ message: "Profile updated successfully", faculty: rows[0] });
    });
  });
});



app.get("/timetable", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect("/");
  }

  const sql = "SELECT * FROM timetable WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    } else {
      const timetable = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
      };

      results.forEach((row) => {
        const day = row.Day_of_Week;
        const period = row.Period_Number;
        timetable[day][period] = row.Course_Name;
      });

      res.render("TimeTable", { timetable });
    }
  });
});

app.get("/notifications", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect("/");
  }

  const sql = "SELECT * FROM notifications WHERE Faculty_ID = ?";
  connection.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.render("Notifications", { notifications: results });
    }
  });
});

app.get("/performance", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) return res.redirect("/");

  const performanceSql = `SELECT a.Course_Name, a.Credits, a.Students_Count, 
                          a.Pass_Student_Count, semester.Sem_Name, a.Faculty_ID 
                          FROM (SELECT courses.Course_Name, courses.Course_ID, courses.Credits, 
                                       results.Faculty_ID, results.Students_Count, 
                                       results.Pass_Student_Count, results.Sem_ID 
                                FROM results 
                                JOIN courses ON results.Course_ID = courses.Course_ID) AS a 
                          JOIN semester ON a.Sem_ID = semester.Sem_ID 
                          WHERE a.Faculty_ID = ?`;

  const leaveSummarySql = `SELECT SUM(Days_Count) AS Total_Days, 
                           Leave_Type, 
                           CASE Leave_Type 
                             WHEN 'CL' THEN 'Casual Leave'
                             WHEN 'EL' THEN 'Earned Leave'
                             WHEN 'ODL' THEN 'On-Duty Leave'
                             WHEN 'AL' THEN 'Academic Leave'
                             ELSE 'NA'
                           END AS Leave_Type_Abbr 
                           FROM faculty_leaves 
                           WHERE Faculty_ID = 2 
                           GROUP BY Leave_Type;`;

  connection.query(performanceSql, [facultyId], (err, performanceResults) => {
    if (err) return res.status(500).json({ message: "Database error" });

    connection.query(leaveSummarySql, [facultyId], (err, leaveResults) => {
      if (err) return res.status(500).json({ message: "Database error" });

      let totalPassPercentage = 0;
      performanceResults.forEach((row) => {
        const passPercentage =
          (row.Pass_Student_Count / row.Students_Count) * 100;
        row.passPercentage = passPercentage.toFixed(2);
        totalPassPercentage += passPercentage;
      });

      const averagePassPercentage = (
        totalPassPercentage / performanceResults.length
      ).toFixed(2);
      const resultFactor = (averagePassPercentage / 10).toFixed(1);

      res.render("Performance", {
        performance: performanceResults,
        averagePassPercentage,
        resultFactor,
        leaveData: leaveResults,
      });
    });
  });
});

app.get("/achievements", (req, res) => {
  const facultyId = req.cookies.Faculty_ID;
  if (!facultyId) {
    return res.redirect("/");
  }
  const projectsSql = `SELECT Project_ID, Project_Title, Description, Start_date, End_date, Status
                       FROM projects
                       WHERE Faculty_ID = ?`;
  const publicationsSql = `SELECT Publication_ID, Title, Journal_Name, Start_date, End_date, DOI_Link
                           FROM publications
                           WHERE Faculty_ID = ?`;
  const patentsSql = `SELECT Patent_ID, Patent_Title, Description, Start_date, End_date
                      FROM patents
                      WHERE Faculty_ID = ?`;

  connection.query(projectsSql, [facultyId], (err, projects) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching projects" });
    }

    connection.query(publicationsSql, [facultyId], (err, publications) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching publications" });
      }

      connection.query(patentsSql, [facultyId], (err, patents) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error fetching patents" });
        }
        res.render("Achievements", {
          projects: projects,
          publications: publications,
          patents: patents,
        });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT Faculty_ID, College_Mail, Password FROM facultyinfo WHERE College_Mail = ? AND Password = ?";
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Database error" });
    } else if (results.length > 0) {
      const facultyId = results[0].Faculty_ID;
      res.cookie("Faculty_ID", facultyId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 360000000,
      });
      res.json({ success: true, message: "Login successful" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid login details" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("Faculty_ID"); // Clear the Faculty_ID cookie
  res.redirect("/"); // Redirect to the login page
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
