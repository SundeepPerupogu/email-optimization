const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware for JSON parsing
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory

// Intiate the activity
activity.initialize = function() {
    connection.trigger('ready');
    $('#custom-activity-form').on('submit', activity.calculateNextSendTime);
    console.log(`Started Initialize in activity.js`);
};


// POST endpoint to execute the custom activity logic
app.post('/execute', (req, res) => {
    const { timezoneOffset, start_window, end_window, daytype } = req.body;

    // Implement your logic here; for now, just return received data
    const response = {
        nextSendTime: new Date().toISOString(), // Placeholder for calculated date
        nextSendTimeDateType: "default"
    };

    res.status(200).json({
        success: true,
        data: response
    });
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
	console.log(`Saving ..`);
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

// Server configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
