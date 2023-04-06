const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const Album = require("./models/Album");

const app = express();

app.use(express.urlencoded({extended: true}))
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const connectionUrl = process.env.CONNECTION_URL;

// MongoDB connection 
mongoose.connect(connectionUrl, {dbName: 'music_albums'})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Render the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Render create album page
app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-album-form.html"));
});

// Render update album page
app.get('/update/:title', async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "update-form.html"));
})

// Render Album details page
app.get('/album/:title', async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "album-details.html"));
})

// Retrieve all albums
app.get('/albums', async (req, res) => {
    try {
        const albums = await Album.find();
        res.json(albums);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Retrieve a specific album by title
app.get('/albums/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const albums = await Album.find({ title: title });
        if (albums.length === 0) {
            res.status(404).json({ error: `No album found with title '${title}'` });
        } else {
            res.json(albums);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Create a new album
app.post('/albums', async (req, res) => {
    try {
        const albumExists = await Album.findOne({ title: req.body.title });
        if (albumExists) {
            return res.status(409).json({ message: 'Album aready exisits' });
        }
        const album = new Album(req.body);
        const savedAlbum = await album.save();
        res.status(201).redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update an album by id
app.put('/albums/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body);
        const album = await Album.findByIdAndUpdate(id, req.body, { new: true });
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.status(200).json(album);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete an album by id
app.delete('/albums/:id', async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json({ message: 'Album deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});