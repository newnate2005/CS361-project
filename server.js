var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var axios   = require('axios');

const connectDB = require("./db");
connectDB();
const Book = require("./models/Book");

var app = express();
var port = process.env.PORT || 3001;

// Define microservice base URLs via environment variables, with local defaults:
const STATS_SERVICE_URL = process.env.STATS_SERVICE_URL || 'http://localhost:3002';
const FILTERS_SERVICE_URL = process.env.FILTERS_SERVICE_URL || 'http://localhost:3003';
const SHARE_SERVICE_URL = process.env.SHARE_SERVICE_URL || 'http://localhost:3004';

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, 'views/layouts/')
}));

app.set("view engine", "handlebars");
app.use(express.static('static'));

app.use(function (req, res, next) {
    // console.log("== Request received");
    next();
});

app.post("/add-book", async (req, res) => {
    try {
        const { title, author, length, timesRead, review, genre, image } = req.body;
        if (!title) return res.status(400).send("Title is required");

        const newBook = new Book({ 
            title, 
            author, 
            length, 
            timesRead: timesRead || 0, 
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
        const books = await Book.find({}).lean();
        res.render("home", { books });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// Reading Stats Route
app.get('/stats', async (req, res) => {
    try {
      const response = await axios.get(`${STATS_SERVICE_URL}/reading-stats`);
      console.log("Request to stats");
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

// Filtered Books Route
app.get('/filtered', async (req, res) => {
  try {
    const response = await axios.get(`${FILTERS_SERVICE_URL}/filter-books`, {
      params: req.query
    });
    console.log("Request to filters");
    res.render('filtered', {
      books: response.data.books,
      message: response.data.message
    });
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    res.status(500).send("Failed to load filtered books.");
  }
});

// Share Book Route
app.get('/share-book/:id', async (req, res) => {
    try {
        const response = await axios.get(`${SHARE_SERVICE_URL}/share/${req.params.id}`);
        const book = response.data.book;
        console.log("Request to share");
        res.render('share', { book });
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Failed to load sharing page.");
    }
});

app.post('/generate-share', async (req, res) => {
    try {
        const response = await axios.post(`${SHARE_SERVICE_URL}/generate-share`, req.body);
        res.json(response.data);
        console.log("Request to share");
    } catch (error) {
        console.error("Error generating share content:", error);
        res.status(500).send("Failed to generate share content.");
    }
});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
