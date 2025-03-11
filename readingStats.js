const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3002;

const mongoURI = "mongodb+srv://whitnath:WhiNa2669217312+@cluster0.qgi6l.mongodb.net/";
const dbName = "test"; 
const collectionName = "books"; 

// Connect to MongoDB and fetch books
async function fetchBooksFromDB() {
    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db(dbName);
        const booksCollection = db.collection(collectionName);
        const books = await booksCollection.find({}).toArray();
        // console.log("Books fetched:", books);
        return books;
    } finally {
        await client.close();
    }
}

// Calculates the reading stats for a user
function calculateStats(books) {
    let authorCount = {};
    let genreCount = {};
    let totalReadingTime = 0;
  
    books.forEach(book => {
      // Process author and reading time if available
      if (book.author && book.length) {
        const authorKey = book.author.trim().toLowerCase();
        authorCount[authorKey] = (authorCount[authorKey] || 0) + 1;
        
        const readingTime = parseInt(book.length);
        if (!isNaN(readingTime)) {
          totalReadingTime += readingTime;
        }
      }
      // Process genre if available and non-empty
      if (book.genre && book.genre.trim() !== "") {
        const genreKey = book.genre.trim().toLowerCase();
        genreCount[genreKey] = (genreCount[genreKey] || 0) + 1;
      }
    });
  
    // Log the tallies for debugging
    console.log("Author Count:", authorCount);
    console.log("Genre Count:", genreCount);
  
    // Determine most read author
    let mostReadAuthor = Object.entries(authorCount).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["", 0]
    )[0];
    mostReadAuthor = mostReadAuthor ? mostReadAuthor.toUpperCase() : "NO DATA";
  
    // Determine most read genre
    let mostReadGenre = Object.entries(genreCount).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["", 0]
    )[0];
    mostReadGenre = mostReadGenre ? mostReadGenre.toUpperCase() : "NO DATA";
  
    console.log("Calculated Stats:", { mostReadAuthor, totalReadingTime, mostReadGenre });
  
    return {
      mostReadAuthor: `Most read author: ${mostReadAuthor}`,
      totalReadingTime: `Average mount of time spent reading: ${totalReadingTime} MINUTES`,
      mostReadGenre: `Most read genre: ${mostReadGenre}`
    };
}  

// API endpoint to fetch and return stats
app.get('/reading-stats', async (req, res) => {
    try {
        const books = await fetchBooksFromDB();
        const stats = calculateStats(books);
        res.json(stats);
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Failed to fetch reading stats" });
    }
});

app.listen(port, () => {
    console.log(`Reading Stats Microservice running on port ${port}`);
});
