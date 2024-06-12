const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const app = express();
const port = process.env.PORT || 3000;
//const SendTimeCalculator = require('./backend/customActivity.py');
app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(express.static('public'));  // To serve index.html, customactivity.js, etc.

// Utility function to log and send errors
function handleError(res, error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
}

function convertToUTC(userTimeZoneOffset = "-09:30", triggerTime = "08:00", dayType = "Weekday") {
    // Convert time zone offset to minutes
    let offsetSign = userTimeZoneOffset[0] === '+' ? 1 : -1;
    let offsetParts = userTimeZoneOffset.substring(1).split(':');
    let offsetMinutes = offsetSign * (parseInt(offsetParts[0]) * 60 + parseInt(offsetParts[1]));
  
    // Get current date
    let now = new Date();
  
    // Parse the trigger time
    let triggerParts = triggerTime.split(':');
    let triggerHours = parseInt(triggerParts[0]);
    let triggerMinutes = parseInt(triggerParts[1]);
  
    // Create a Date object for the trigger time today
    let triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), triggerHours, triggerMinutes);
  
    // Adjust trigger time to UTC
    triggerDate.setMinutes(triggerDate.getMinutes() - offsetMinutes);
  
    // If the trigger time has already passed today, set it to the same time tomorrow
    if (dayType === 'weekday') {
      while (triggerDate.getDay() === 0 || triggerDate.getDay() === 6) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }
    }
  
    // Format the UTC trigger time
    let utcHours = String(triggerDate.getUTCHours()).padStart(2, '0');
    let utcMinutes = String(triggerDate.getUTCMinutes()).padStart(2, '0');
    let utcTime = `${utcHours}:${utcMinutes}`;
  
    // This part is for browsers and would not be used in Node.js
    // Since we don't have document object in Node.js, we can comment it out.
    // document.getElementById("result").innerText = `Next trigger time in UTC: ${utcTime} and Date would be ${triggerDate.toUTCString()}`;
  
    // You can return the formatted UTC time for further use in your Node.js application
    return { utcTime, triggerDate };
  }
  
  // Example usage in Node.js
  const result = convertToUTC();
  console.log(`Next trigger time in UTC: ${result.utcTime} and Date would be ${result.triggerDate.toUTCString()}`);
  

app.post('/execute', (req, res) => {
    const { time_zone, start_window, end_window } = req.body.inArguments[0];
    try {
           const calculator = new SendTimeCalculator(start_window, end_window);
        calculator.validate();
        const nextSend = calculator.calculateNextSendTime(time_zone);
        console.log(JSON.stringify(res.body));
        res.status(200).send({ next_send: nextSend });
	    
//        res.json({ timeDifference: timeDifference.toString() });
//	        console.log(JSON.stringify(res.body));

    } catch (error) {
        res.status(400).send({ error: error.message });
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
    console.log(JSON.stringify(req.body));
        res.sendStatus(200);
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
