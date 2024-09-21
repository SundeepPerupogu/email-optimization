const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

app.post('/execute', (req, res) => {
    // In a real implementation, you'd process the request here
    const dateData = {
        targetDate: req.body.targetDate || new Date().toISOString().split('T')[0] // Default to today's date
    };
    
    res.status(200).json({
        success: true,
        data: dateData
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
