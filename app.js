// Import required modules
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const app = express(); // Create an Express application
const path = require('path'); // Module for working with file and directory paths
const cors = require('cors'); // Middleware for enabling CORS (Cross-Origin Resource Sharing)

// Enable CORS to allow resource sharing across different origins
app.use(cors()); 

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static('public')); 

// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory again, using an absolute path
app.use(express.static(path.join(__dirname, 'public')));

// Initialize an object to hold activity-related methods
var activity = {};

// Function to initialize the activity
activity.initialize = function() {
    connection.trigger('ready'); // Trigger an event when the connection is ready
    // Attach event handler for form submission (commented out for now)
    // $('#custom-activity-form').on('submit', activity.calculateNextSendTime);
    console.log(`Started Initialize in activity.js`); // Log initialization
};

// Function to calculate the next send time based on user inputs
activity.calculateNextSendTime = function(event) {
    // Prevent default form submission behavior (commented out for now)
    // event.preventDefault();

    console.log(`Started executing function: calculateNextSendTime`); // Log function start
    // Get input values from the form
    var daytype = $('#daytype').val();
    var timezoneOffset = $('#timezoneOffset').val();
    var startWindow = $('#start_window').val();
    var endWindow = $('#end_window').val();
    console.log(daytype, timezoneOffset, startWindow);
    
    // Validate input time formats and ensure start and end times are different
    if (!validateTimeFormat(startWindow) || !validateTimeFormat(endWindow) || startWindow === endWindow) {
        alert('Invalid input. Please check the time format and ensure start and end windows are different.'); // Alert user
        return; // Exit function on validation failure
    }

    // Calculate the next send time using the provided inputs
    var nextSendTime = calculateNextSendTime(timezoneOffset, daytype, startWindow, endWindow);
    // Display the next send time result
    $('#result').text('Next Send Time: ' + nextSendTime);
};

// Function to calculate the next send time based on various parameters
function calculateNextSendTime(timezoneOffset='5.5', daytype='weekday', start_window='11:00:00Z', end_window='12:00:00Z') {
    const currentUTC = new Date(); // Get current UTC time
    // Split the timezone offset into hours and minutes
    const offsetParts = timezoneOffset.split('.');
    const offsetHours = parseInt(offsetParts[0], 10);
    const offsetMinutes = parseInt(offsetParts[1] || "0", 10);
    // Calculate total offset in minutes
    const offsetTotalMinutes = (offsetHours * 60) + (offsetHours < 0 ? -(offsetMinutes * 6) : (offsetMinutes * 6));
    console.log(`Started function calculateNextSendTime`); // Log function start

    // Combine current date with start and end times
    const startDateTimeUTC = combineDateTime(currentUTC, start_window, offsetTotalMinutes);
    const endDateTimeUTC = combineDateTime(currentUTC, end_window, offsetTotalMinutes);
    console.log('startDateTimeUTC is', startDateTimeUTC);
    console.log('endDateTimeUTC is', endDateTimeUTC);

    let nextSendDateTime = null; // Variable to hold the next send date/time
    console.log('nextSendDateTime is ', nextSendDateTime);

    // Determine the next send time based on current time and start time
    if (currentUTC <= startDateTimeUTC) {
        nextSendDateTime = startDateTimeUTC; // If current time is before start time
        console.log(`currentUTC <= startDateTimeUTC`);
    } else {
        nextSendDateTime = addDays(startDateTimeUTC, 1); // Move to the next day
        console.log(`currentUTC > startDateTimeUTC`);
    }

    // Adjust the next send time if it's a weekday
    if (daytype === 'weekday') {
        // Loop until nextSendDateTime is not a weekend (Saturday or Sunday)
        while (nextSendDateTime.getUTCDay() === 0 || nextSendDateTime.getUTCDay() === 6) {
            console.log(`As daytype === weekday`);
            console.log(nextSendDateTime.getUTCDay());
            nextSendDateTime = addDays(nextSendDateTime, 1); // Move to next day
        }
    }
    console.log(`Final nextSendDateTime`, nextSendDateTime);
    return nextSendDateTime.toISOString(); // Return in ISO format
}

// Helper function to combine a date with a time string
function combineDateTime(date, time, offsetTotalMinutes) {
    // Validate time format
    if (!time || typeof time !== 'string' || !time.includes(':')) {
        // Handle the error: either throw an error or return a default date
        const defdate = new Date(date);    
        return defdate;    
    }
    // Split the time into hours, minutes, and seconds
    const [hours, minutes, seconds] = time.split(':');
    const combinedDateTime = new Date(date.getTime()); // Create a new Date object
    console.log(`${hours} ${minutes} ${seconds}`);
    console.log(`Start function combineDateTime ${combinedDateTime}`);
    // Set UTC hours considering the offset
    combinedDateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10) - offsetTotalMinutes, parseInt(seconds, 10));
    console.log(`End function setUTCHours ${combinedDateTime}`);
    return combinedDateTime; // Return the combined date/time
}

// Helper function to add a specified number of days to a date
function addDays(date, days) {
    const result = new Date(date); // Create a copy of the date
    console.log(result);
    result.setUTCDate(result.getUTCDate() + days); // Add days
    console.log(result.getUTCDate());
    console.log(result);
    return result; // Return the modified date
}

// POST endpoint to execute the custom activity logic
app.post('/execute', (req, res) => {
    try {
        // Destructure input arguments from the request body
        const { timezoneOffset, daytype, start_window, end_window } = req.body.inArguments[0];
        const now = new Date(); // Get current date and time
        let nextSendTime = now.toLocaleString(); // Initialize nextSendTime with current time
        console.log('timezoneOffset is', timezoneOffset);
        console.log('daytype is', daytype);
        console.log('start_window', start_window);
        console.log('end_window', end_window);
        // Calculate the next send time based on the provided inputs
        nextSendTime = calculateNextSendTime(timezoneOffset, daytype, start_window, end_window);
        console.log('After the calculateNextSendTime function call');

        // Check if nextSendTime is valid
        if (nextSendTime) {
            console.log("Next send time is:", nextSendTime); // Log the result
        } else {
            console.log("Error in input params"); // Log error if invalid
            nextSendTime = "Error in input params"; // Set error message
        }
        
        const nextSendTimeDateType = new Date(nextSendTime); // Convert nextSendTime to Date object    
        console.log("Next send time in date time is:", nextSendTimeDateType.toISOString());
        
        // Check if nextSendTimeDateType is valid
        if (!nextSendTimeDateType) {
            return res.status(400).send(JSON.stringify({ error: "nextSendTimeDateType could not be generated" }));
        }
        
        console.log("Data type of nextSendTime: ", typeof nextSendTime);
        console.log("Data type of nextSendTimeDateType: ", typeof nextSendTimeDateType);
        
        // Send the calculated next send time as a JSON response
        return res.status(200).json({ "nextSendTime": nextSendTime });    
    } catch (error) {
        console.error('Error in /execute:', error); // Log the error
        res.status(500).json({ error: error.message }); // Send error response
    }
    console.log(res); // Log the response object
});

// POST endpoint for publishing
app.post('/publish', (req, res) => {
    try {
        console.log(`published..`); // Log publish action
        res.sendStatus(200); // Respond with 200 OK
    } catch (error) {
        handleError(res, error); // Handle any errors
    }
});

// POST endpoint for validation
app.post('/validate', (req, res) => {
    try {
        console.log(`Validated`); // Log validation action
        console.log(JSON.stringify(req.body)); // Log request body
        res.sendStatus(200); // Respond with 200 OK
    } catch (error) {
        handleError(res, error); // Handle any errors
    }
});

// POST endpoint for saving data
app.post('/save', (req, res) => {
    try {
        console.log(`Saving ..`); // Log saving action
        res.sendStatus(200); // Respond with 200 OK
    } catch (error) {
        handleError(res, error); // Handle any errors
    }
});

// POST endpoint for stopping an activity
app.post('/stop', (req, res) => {
    try {
        console.log(`Stopped`); // Log stop action
        res.sendStatus(200); // Respond with 200 OK
    } catch (error) {
        handleError(res, error); // Handle any errors
    }
});

// Server configuration
const PORT = process.env.PORT || 3000; // Set port from environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log server start
});
