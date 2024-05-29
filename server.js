const express = require('express');
const bodyParser = require('body-parser');
const SendTimeCalculator = require('./customActivity');

const app = express();
app.use(bodyParser.json());

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
app.post('/validate', (req, res) => {
    console.log(`Validated`);
        res.sendStatus(200);

});
app.get('/config', (req, res) => {
    res.sendFile(__dirname + '/public/config.html');
});

app.listen(3000, () => {
    console.log('Custom Activity Service is running on port 3000');
});
