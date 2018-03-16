const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//Main app
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

//Method ovveride middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Flash middleware
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Index route
app.get('/', (req, res) => {
    const title = 'Welcome Yo';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Idea route/index page
app.get('/ideas', (req, res) => {
    //Find everything
    idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });

});


//Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    });
});

//Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text: 'Please add details'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        //res.send('passed');
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            })
    }
});

//Edit Form Process
app.put('/ideas/:id', (req, res) => {
    //res.send('PUT');
    idea.findOne({
        _id: req.params.id 
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            });
    });
});

//Edit Form Process
app.delete('/ideas/:id', (req, res) => {
    //res.send('DELETE');
    idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

