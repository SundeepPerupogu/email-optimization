const express = require('express');
const bodyParser = require('body-parser');
const SendTimeCalculator = require('./public/customactivity');

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
    const { time_zone, start_window, end_window } = req.body.inArguments[0];
    try {
        const calculator = new SendTimeCalculator(start_window, end_window);
        calculator.validate();
        const nextSend = calculator.calculateNextSendTime(time_zone);
        console.log(JSON.stringify(res.body));
        res.status(200).send({ next_send: nextSend });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
//app.post('/validate', (req, res) => {
  //  console.log(`Validated`);
    //    res.sendStatus(200);

//});
app.get('/config', (req, res) => {
    res.sendFile(__dirname + '/public/config.html');
});
app.post('/publish', (req, res) => {
    try {
							
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
    console.log('Custom Activity Service is running on port ${port}');
});
