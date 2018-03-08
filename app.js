const express = require('express');

const app = express();

/*//How middleware works
app.use((req, res, next) => {
    //console.log(Date.now());
    //req.name = 'Issa N';
    next();
});*/

//Index route
app.get('/', (req, res) => {
    res.send('INDEX');
});

//Index route
app.get('/about', (req, res) => {
    res.send('Aboot2');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

