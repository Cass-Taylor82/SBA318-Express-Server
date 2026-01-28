const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('2025 RTT-12 Yearbook');
});

app.listen(PORT, () => {
    console.log('Server in running on http://localhost:{PORT}');
});