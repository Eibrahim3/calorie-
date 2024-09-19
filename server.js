const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to SQLite database (creates a new file named 'foodtracker.db' in the project root)
const db = new sqlite3.Database('foodtracker.db');

// Create the 'food_entries' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS food_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodName TEXT,
        servingSize REAL
    );
`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files
app.use(express.static('public'));

// API endpoint for submitting food entries
app.post('/api/submit', (req, res) => {
    try {
        const { foodName, servingSize } = req.body;

        // Validate input
        if (!foodName || isNaN(servingSize) || servingSize <= 0) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Insert the new entry into the 'food_entries' table
        db.run('INSERT INTO food_entries (foodName, servingSize) VALUES (?, ?)', [foodName, servingSize], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Entry submitted successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint for fetching all food entries or searching by name
app.get('/api/entries', (req, res) => {
    const searchQuery = req.query.search || '';

    let query = 'SELECT * FROM food_entries';
    let params = [];

    if (searchQuery) {
        query += ' WHERE foodName LIKE ?';
        params.push(`%${searchQuery}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.json(rows);
    });
});

// API endpoint for deleting a specific food entry
app.delete('/api/entries/:id', (req, res) => {
    const entryId = req.params.id;

    db.run('DELETE FROM food_entries WHERE id = ?', [entryId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.json({ message: 'Entry deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
