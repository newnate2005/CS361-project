const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
var port = process.env.PORT || 3005;

const mongoURI = "mongodb+srv://whitnath:WhiNa2669217312+@cluster0.qgi6l.mongodb.net/";
const dbName = "test";
const collectionName = "books";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Serve default images
app.use('/default_images', express.static(path.join(__dirname, 'default_images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get book image
app.get('/image/:bookId', async (req, res) => {
    const bookId = req.params.bookId;

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

        if (book.image) {
            return res.sendFile(path.join(__dirname, book.image));
        }

        // Serve genre-specific or generic default image
        const genreImagePath = path.join(__dirname, 'default_images', 'genre', `${book.genre}.png`);
        if (fs.existsSync(genreImagePath)) {
            return res.sendFile(genreImagePath);
        }

        const genericImagePath = path.join(__dirname, 'default_images', 'generic.png');
        return res.sendFile(genericImagePath);
    } catch (err) {
        console.error("Error fetching book image:", err);
        res.status(500).json({ error: "Failed to fetch book image." });
    } finally {
        await client.close();
    }
});

// Update book image
app.post('/image/:bookId', upload.single('image'), async (req, res) => {
    const bookId = req.params.bookId;

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(bookId) },
            { $set: { image: req.file.path } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "Book not found or no changes made." });
        }

        res.status(200).json({ message: "Book image updated successfully." });
    } catch (err) {
        console.error("Error updating book image:", err);
        res.status(500).json({ error: "Failed to update book image." });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Image Service running on port ${port}`);
});