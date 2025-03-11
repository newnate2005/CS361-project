const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const { createCanvas } = require('canvas');

const app = express();
var port = process.env.PORT || 3004;

const mongoURI = "mongodb+srv://whitnath:WhiNa2669217312+@cluster0.qgi6l.mongodb.net/";
const dbName = "test";
const collectionName = "books";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/share/:id', async (req, res) => {
    const bookId = req.params.id;

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const book = await collection.findOne({ _id: new ObjectId(bookId) });

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json({ book });
    } catch (err) {
        console.error("Error fetching book details:", err);
        res.status(500).json({ error: "Failed to fetch book details." });
    } finally {
        await client.close();
    }
});

app.post('/generate-share', async (req, res) => {
    const { bookId, shareFields } = req.body;

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const book = await collection.findOne({ _id: new ObjectId(bookId) });

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        let shareContent = '';
        shareFields.forEach(field => {
            if (book[field]) {
                shareContent += `${field.charAt(0).toUpperCase() + field.slice(1)}: ${book[field]}\n`;
            }
        });

        // Generate shareable image
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20pt Arial';

        let yPosition = 50;
        shareFields.forEach(field => {
            if (book[field]) {
                ctx.fillText(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${book[field]}`, 50, yPosition);
                yPosition += 50;
            }
        });

        // Convert to image
        const buffer = canvas.toBuffer('image/png');
        const imageBase64 = buffer.toString('base64');

        res.json({ shareContent, imageBase64 });
    } catch (err) {
        console.error("Error generating share content:", err);
        res.status(500).json({ error: "Failed to generate share content." });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Sharing Microservice running on port ${port}`);
});