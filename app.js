const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(res => {
    console.log('MongoDB Connected');
})
.catch(err => {
    console.log(err);
});

//Load idea model
require('./models/Idea');
const idea = mongoose.model('ideas');

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
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



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


//Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Process form
app.post('/ideas', (req, res) => {
    console.log(req.body);
    res.send('ok')
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

