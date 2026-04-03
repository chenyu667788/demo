const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/demos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  Evonet Demos Site`);
    console.log(`  端口: ${PORT}`);
    console.log(`  访问地址: http://localhost:${PORT}`);
    console.log(`========================================`);
});
