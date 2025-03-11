var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var axios = require('axios');

const connectDB = require("./db");
connectDB();
const Book = require("./models/Book");

var app = express();
var port = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main", // Load the main layout
    layoutsDir: path.join(__dirname, 'views/layouts/') // Ensure layouts path is present
}));

app.set("view engine", "handlebars");
app.use(express.static('static'));

app.use(function (req, res, next) {
    console.log("== Request received");
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
        const books = await Book.find({}).lean();
        res.render("home", { books });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.get('/stats', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3002/reading-stats');
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

app.get('/filtered', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3003/filter-books', {
      params: req.query
    });
    res.render('filtered', {
      books: response.data.books,
      message: response.data.message
    });
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    res.status(500).send("Failed to load filtered books.");
  }
});

app.get('/share-book/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3004/share/${req.params.id}`);
        const book = response.data.book;
        res.render('share', { book });
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Failed to load sharing page.");
    }
});

app.post('/generate-share', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:3004/generate-share', req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Error generating share content:", error);
        res.status(500).send("Failed to generate share content.");
    }
});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
});