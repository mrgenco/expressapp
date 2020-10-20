const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Init App
const app = express();

mongoose.connect('mongodb://localhost/expressdb', { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
})


// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false })); 
//Used to parse JSON bodies
app.use(express.json()); 

// Home Route
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                heading: 'This is h1',
                articles: articles
            });
        }

    });
});
// Add Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'JCR - ER Add Article'
    });
});

app.post('/articles/add', function(req,res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/')
        }
    });

});

// Start Server
app.listen(3000, function () {
    console.log('Server started on port 3000...');
});