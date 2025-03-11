// filterBooks.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
var port = process.env.PORT || 3003;

// Use your connection string (make sure it's URL-encoded if needed)
const mongoURI = "mongodb+srv://whitnath:WhiNa2669217312%2B@cluster0.qgi6l.mongodb.net/bookshelf?retryWrites=true&w=majority";
const dbName = "test";
const collectionName = "books";

const cors = require('cors');
app.use(cors());


app.get('/filter', async (req, res) => {
    console.log("Filter request received:", req.query);

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        let filter = {};

        if (req.query.genre) {
            filter.genre = { $regex: new RegExp(req.query.genre, "i") };
        }
        if (req.query.author) {
            filter.author = { $regex: new RegExp(req.query.author, "i") }; // Case-insensitive match
        }
        if (req.query.timesRead) {
            filter.timesRead = parseInt(req.query.timesRead, 10);
        }

        console.log("Applying filter:", filter); // Log final filter

        const filteredBooks = await collection.find(filter).toArray();
        console.log("Filtered books result:", filteredBooks); // Log query results

        res.json(filteredBooks);
        client.close();
    } catch (error) {
        console.error("Error filtering books:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/filter-books', async (req, res) => {
  // Accept query parameters for filtering:
  // e.g., /filter-books?author=tolkien&genre=fiction&timesRead=3&keyword=ring
  const { author, genre, timesRead, keyword } = req.query;

  // Build query object
  let query = {};

  if (author) {
    query.author = { $regex: author, $options: 'i' };
  }
  if (genre) {
    query.genre = { $regex: genre, $options: 'i' };
  }
  if (timesRead) {
    // Assume timesRead is an exact match; you could also build a range query if desired
    query.timesRead = parseInt(timesRead);
  }
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { author: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }

  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const books = await collection.find(query).toArray();

    if (books.length === 0) {
      return res.json({ message: "No books found matching the filter criteria", books: [] });
    }
    res.json({ books });
  } catch (err) {
    console.error("Error fetching filtered books:", err);
    res.status(500).json({ error: "Failed to filter books." });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Filter Books Microservice running on port ${port}`);
});
