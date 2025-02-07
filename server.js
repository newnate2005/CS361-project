var path = require('path')
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3001;
app.use(express.urlencoded({extended:true}))

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main", // Load the main layout
    layoutsDir: path.join(__dirname, 'views/layouts/') // Ensure layouts path is present
}));

app.set("view engine", "handlebars");
app.use(express.static('static'));

app.use(function (req, res, next) {
    console.log("== Request received");
    console.log(" -- method:", req.method);
    console.log(" -- url:", req.url);
    next();
});

app.get('/', function (req, res, next) {
    res.render("home"); 
});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});