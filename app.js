const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(express.static('public'));  // To serve index.html, customactivity.js, etc.

// Utility function to log and send errors
function handleError(res, error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
}

app.post('/execute', (req, res) => {
    try {
        const inArguments = req.body.inArguments && req.body.inArguments[0];
        if (!inArguments) {
            throw new Error('inArguments missing or invalid');
        }

        const futureUtcTime = inArguments.futureUtcTime;
        const userTimeZone = inArguments.userTimeZone;

        if (!futureUtcTime || !userTimeZone) {
            throw new Error('Missing required arguments: futureUtcTime or userTimeZone');
        }

        const currentUtcTime = new Date().toISOString().split('T')[1].split('.')[0]; // Current UTC time in HH:MM:SS
        const futureTime = new Date(`1970-01-01T${futureUtcTime}Z`);
        const currentTime = new Date(`1970-01-01T${currentUtcTime}Z`);

        const timeDifference = (futureTime - currentTime) / 1000; // Difference in seconds

        res.json({ timeDifference: timeDifference.toString() });
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/publish', (req, res) => {
    try {
							
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/validate', (req, res) => {
    console.log(`Validated`);
    try {
        const inArguments = req.body.arguments && req.body.arguments.execute && req.body.arguments.execute.inArguments;
        if (!inArguments || inArguments.length === 0 || !inArguments[0].futureUtcTime || !inArguments[0].userTimeZone) {
            throw new Error('Invalid configuration: Missing required inArguments');
        }
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/stop', (req, res) => {
    try {
							
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.listen(port, () => {
    console.log(`Custom Activity running on port ${port}`);
});
