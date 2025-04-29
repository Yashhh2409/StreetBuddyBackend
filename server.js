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
  const { user, visits } = req.body;

  // Check if user or visits are missing
  if (!user || !user.id || !visits || !Array.isArray(visits)) {
    return res.status(400).json({
      message: 'Invalid request body. Expected format:\n{\n  user: { id, name, email },\n  visits: [{ url, title, category, visitTime, duration }, ...]\n}'
    });
  }

  // Insert user if not exists
  const insertUserQuery = `
    INSERT INTO users (id, name, email) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email)
  `;

  db.query(insertUserQuery, [user.id, user.name, user.email], (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Error inserting user' });
    }

    // Prepare browser history insertions
    const insertHistoryPromises = visits.map(visit => {
      const query = `
        INSERT INTO browser_history (user_id, url, title, category, visit_time, duration)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      return new Promise((resolve, reject) => {
        db.query(query, [
          user.id,
          visit.url || '',
          visit.title || '',
          visit.category || 'General',
          visit.visitTime || '0000-00-00 00:00:00',
          visit.duration || 0
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    // Execute all insertions
    Promise.all(insertHistoryPromises)
      .then(() => res.status(200).json({ message: 'Data inserted successfully' }))
      .catch((err) => {
        console.error('Error inserting history:', err);
        res.status(500).json({ message: 'Error inserting browser history' });
      });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
