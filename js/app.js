const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
//const activity = require(path.join(__dirname, '.', '/public/scripts', 'activity.js'));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add this line
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
var activity = {};

activity.initialize = function() {
    connection.trigger('ready');
    $('#custom-activity-form').on('submit', activity.calculateNextSendTime);
    console.log(`Started Initialize in activity.js`);
};

activity.calculateNextSendTime = function(event) {
    event.preventDefault();

    console.log(`Started executing function: calculateNextSendTime`);
    var daytype = $('#daytype').val();
    var timezoneOffset = $('#timezoneOffset').val();
    var startWindow = $('#start_window').val();
    var endWindow = $('#end_window').val();

    // Validation
    if (!validateTimeFormat(startWindow) || !validateTimeFormat(endWindow) || startWindow === endWindow) {
        alert('Invalid input. Please check the time format and ensure start and end windows are different.');
        return;
    }

    var nextSendTime = calculateNextSendTime(timezoneOffset, daytype, startWindow, endWindow);
    $('#result').text('Next Send Time: ' + nextSendTime);
};



        function calculateNextSendTime(timezoneOffset, daytype, start_window, end_window) {
            const currentUTC = new Date();
            const offsetParts = timezoneOffset.split(':');
            const offsetHours = parseInt(offsetParts[0], 10);
            const offsetMinutes = parseInt(offsetParts[1], 10);
            const offsetTotalMinutes = (offsetHours * 60) + (offsetHours < 0 ? -offsetMinutes : offsetMinutes);

            const startDateTimeUTC = combineDateTime(currentUTC, start_window, offsetTotalMinutes);
            const endDateTimeUTC = combineDateTime(currentUTC, end_window, offsetTotalMinutes);

            let nextSendDateTime = null;

            if (currentUTC <= startDateTimeUTC) {
                nextSendDateTime = startDateTimeUTC;
            } else {
                nextSendDateTime = addDays(startDateTimeUTC, 1);
            }

            if (daytype === 'weekday') {
                while (nextSendDateTime.getUTCDay() === 0 || nextSendDateTime.getUTCDay() === 6) {
                    nextSendDateTime = addDays(nextSendDateTime, 1);
                }
            }

            return nextSendDateTime.toISOString();
        }

        function combineDateTime(date, time, offsetTotalMinutes) {
            const [hours, minutes, seconds] = time.split(':');
            const combinedDateTime = new Date(date.getTime());
            combinedDateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10) - offsetTotalMinutes, parseInt(seconds, 10));
            return combinedDateTime;
        }

        function addDays(date, days) {
            const result = new Date(date);
            result.setUTCDate(result.getUTCDate() + days);
            return result;
        }
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/execute', (req, res) => {
    try {
        console.log(`Started executing in app.js`);
        const { timezoneOffset, daytype, start_window, end_window } = req.body.inArguments[0];
        console.log(req.body);[0]
       // console.log(JSON.stringify(req));
        console.log(timezoneOffset);
        console.log(daytype);
        console.log(start_window);
        const nextSendTime = calculateNextSendTime(timezoneOffset, daytype, start_window, end_window);
        console.log(nextSendTime);
        res.status(200).json({ next_send: nextSendTime });
        console.log(JSON.stringify(res));
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Start the server
app.listen(port, () => {
    console.log(`custom activity running on port ${port}`);
});