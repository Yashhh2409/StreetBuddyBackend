const express = require('express');
const bodyParser = require('body-parser');
const db = require("./config/DB.js"); 
const { v4: uuidv4 } = require('uuid');


const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(bodyParser.json());

// POST API to add browser history
app.post('/add-history', (req, res) => {
  const visits = req.body.visits;
  const user_id = req.body.user_id || uuidv4(); // If user_id is not provided, generate a new one

  visits.forEach(visit => {
    const { url, title, category, visitTime, duration } = visit;
    const query = `INSERT INTO browser_history (user_id, url, title, category, visit_time, duration) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [user_id, url, title, category, visitTime, duration], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error inserting data' });
      }
    });
  });

  res.status(200).json({ message: 'Data inserted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
