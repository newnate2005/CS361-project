const fs = require('fs');
const express = require('express');
const app = express();
const port = 3002; // Running microservice on a different port

// Loads the book data from the bookData.json file
const bookData = JSON.parse(fs.readFileSync('./bookData.json', 'utf-8'));

// Calculates the reading stats for a user
function calculateStats(books) {
    // The hold the most read author and the time reading that author's books
    let authorCount = {};
    let totalReadingTime = 0;

    books.forEach(book => {
        // Adds in each books author and increments each time it's added
        authorCount[book.author] = (authorCount[book.author] || 0) + 1;

        // Totals the reading time from the author with the most count
        totalReadingTime += book.length;
    });

    // Find most read author by finding the maximum count within the authorCount array
    let mostReadAuthor = Object.entries(authorCount).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0];

    // Outputs a message to easily read the stats
    return {
        message: {
            mostReadAuthor:   `This is your most read author: ${mostReadAuthor}`,
            totalReadingTime: `The amount of time reading: ${totalReadingTime}`
        }
    };
}

// API endpoint
app.get('/reading-stats', (req, res) => {
    const stats = calculateStats(bookData); // Computes the stats
    res.json(stats); // Sends the stats to server as a response
});

// Microservice start on port 3002
app.listen(port, () => {
    console.log(`Reading Stats Microservice running on port ${port}`);
});