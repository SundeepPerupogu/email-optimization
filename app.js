const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const activity = require('./public/scripts/activity');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/execute', (req, res) => {
    try {
        console.log(`Started executing in app.js`);
        const { time_zone, start_window, end_window } = req.body;
        console.log(JSON.stringify(req));
        const nextSendTime = activity.getNextSendTime(time_zone, start_window, end_window);
        console.log(JSON.stringify(nextSendTime));
        res.status(200).json({ next_send: nextSendTime });
        console.log(JSON.stringify(res));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
