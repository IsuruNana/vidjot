const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

/*//How middleware works
app.use((req, res, next) => {
    //console.log(Date.now());
    //req.name = 'Issa N';
    next();
});*/

//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

//Index route
app.get('/', (req, res) => {
    const title = 'Welcome Yo';
    res.render('index', {
        title: title
    });
});

//Index route
app.get('/about', (req, res) => {
    res.render('about');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

