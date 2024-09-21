const express = require('express');
const bodyParser = require('body-parser');
const { fetchDateData } = require('./app');

const app = express();
app.use(bodyParser.json());

app.post('/execute', (req, res) => {
    try {
        const dateData = fetchDateData();
        res.status(200).json({
            success: true,
            data: dateData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
