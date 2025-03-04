var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');

const connectDB = require("./db");
connectDB();
const Book = require("./models/Book");

const axios = require('axios');

var app = express();
var port = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main", // Load the main layout
    layoutsDir: path.join(__dirname, 'views/layouts/') // Ensure layouts path is present
}));

app.set("view engine", "handlebars");
app.use(express.static('static'));

app.use(function (req, res, next) {
    console.log("== Request received");
    // console.log(" -- method:", req.method);
    // console.log(" -- url:", req.url);
    next();
});

app.post("/add-book", async (req, res) => {
    console.log("Received POST /add-book with body:", req.body);
    try {
        const { title, author, length, timesRead, review, genre, image } = req.body;
        if (!title) return res.status(400).send("Title is required");

        const newBook = new Book({ 
            title, 
            author, 
            length, 
            timesRead: timesRead || 0, // default to 0 if not provided
            review, 
            genre, 
            image 
        });
        await newBook.save();
        res.status(201).send("Book added successfully");
    } catch (err) {
        console.error("Error in POST /add-book:", err);
        res.status(500).send("Error adding book");
    }
});


app.put("/update-book/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, length, timesRead, review, genre, image } = req.body;
      if (!title) return res.status(400).send("Title is required");
      
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { title, author, length, timesRead, review, genre, image },
        { new: true }
      ).lean();
      
      res.status(200).json(updatedBook);
    } catch (err) {
      console.error("Error updating book:", err);
      res.status(500).send("Error updating book");
    }
});  

app.delete("/delete-book/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Book.findByIdAndDelete(id);
      res.status(200).send("Book deleted successfully");
    } catch (err) {
      console.error("Error deleting book:", err);
      res.status(500).send("Error deleting book");
    }
});  

app.get("/", async (req, res) => {
    try {
        const books = await Book.find({}).lean();  // Convert to plain objects
        console.log("Books retrieved:", books);
        res.render("home", { books });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});


app.get('/stats', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3002/reading-stats');
      console.log("Stats received from microservice:", response.data); // Log what you get
      res.render('stats', {
        mostReadAuthor: response.data.mostReadAuthor,
        totalReadingTime: response.data.totalReadingTime,
        mostReadGenre: response.data.mostReadGenre
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).send("Failed to load reading stats.");
    }
});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});