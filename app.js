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
	console.log(JSON.stringify(req.body));
	    
        const inArguments = req.body.inArguments && req.body.inArguments[0];
        if (!inArguments) {
            throw new Error('inArguments missing or invalid');
        }
        const timezoneOffset = inArguments.timezoneOffset;
        const triggerTime = inArguments.triggerTime;
        const daytype = inArguments.daytype;
	const result = outArguments.result;

        if (!timezoneOffset || !triggerTime || !daytype) {
            throw new Error('Missing required arguments: daytype or triggerTime or timezoneOffset');
        }

        const currentUtcTime = new Date().toISOString().split('T')[1].split('.')[0]; // Current UTC time in HH:MM:SS
        const futureTime = new Date(`1970-01-01T${timezoneOffset}Z`);
        const currentTime = new Date(`1970-01-01T${currentUtcTime}Z`);

        const timeDifference = (futureTime - currentTime) / 1000; // Difference in seconds

        res.json({ timeDifference: timeDifference.toString() });
	        console.log(JSON.stringify(res.body));

    } catch (error) {
        handleError(res, error);
    }
});

app.post('/publish', (req, res) => {
    try {
	console.log(`publishing..`);							
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/validate', (req, res) => {
    try {
	    console.log(`Validated`);
	    console.log(JSON.stringify(req.body));
	    res.sendStatus(200);
     } catch (error) {
         handleError(res, error);
     }
});

app.post('/stop', (req, res) => {
    try {
	console.log(`Stopping`);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.listen(port, () => {
    console.log(`Custom Activity running on port ${port}`);
});
