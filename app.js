const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware for JSON parsing
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory

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

// Server configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
