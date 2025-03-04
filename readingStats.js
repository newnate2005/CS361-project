const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3002;

const mongoURI = "mongodb+srv://whitnath:WhiNa2669217312+@cluster0.qgi6l.mongodb.net/"; // Replace with your actual MongoDB URI
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
        console.log("Books fetched:", books); // Add this to check the data
        return books;
    } finally {
        await client.close();
    }
}

// Calculates the reading stats for a user
function calculateStats(books) {
    let authorCount = {};
    let totalReadingTime = 0;

    books.forEach(book => {
        if (book.author && book.length) {
            authorCount[book.author.trim().toLowerCase()] = (authorCount[book.author.trim().toLowerCase()] || 0) + 1;

            const readingTime = parseInt(book.length);
            if (!isNaN(readingTime)) {
                totalReadingTime += readingTime;
            }
        }
    });

    let mostReadAuthor = Object.entries(authorCount).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0];

    console.log("Stats:", { mostReadAuthor, totalReadingTime }); // Add this to log stats
    return {
        mostReadAuthor: mostReadAuthor || "No data",  // Provide a default message if no author found
        totalReadingTime: totalReadingTime || 0  // Ensure the reading time is 0 if no books processed
    };
}

// API endpoint to fetch and return stats
app.get('/reading-stats', async (req, res) => {
    try {
        const books = await fetchBooksFromDB();
        const stats = calculateStats(books);

        // Pass the stats data to the stats.handlebars template
        res.render('stats', {
            mostReadAuthor: stats.message.mostReadAuthor,
            totalReadingTime: stats.message.totalReadingTime
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Failed to fetch reading stats" });
    }
});

app.listen(port, () => {
    console.log(`Reading Stats Microservice running on port ${port}`);
});
