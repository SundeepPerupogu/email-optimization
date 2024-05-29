const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const app = express();
const port = process.env.PORT || 3000;
//const SendTimeCalculator = require('./public/customactivity');
app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(express.static('public'));  // To serve index.html, customactivity.js, etc.

// Utility function to log and send errors
function handleError(res, error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
}

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
//    try {
        //const inArguments = req.body.arguments && req.body.arguments.execute && req.body.arguments.execute.inArguments;
       // if (!inArguments || inArguments.length === 0 || !inArguments[0].futureUtcTime || !inArguments[0].userTimeZone) {
       //     throw new Error('Invalid configuration: Missing required inArguments');
     //   }
   // } catch (error) {
  //      handleError(res, error);
//    }
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
