
const path = require('path');
const { v4: uuid } = require('uuid');
const express = require('express');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Fake database
let comments = [
    {
        id: uuid(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuid(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuid(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuid(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
];

// INDEX - Show all comments
app.get('/comments', (req, res) => {
    res.render('comments/index', { comments });
});

// NEW - Form to create a comment
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
});

// CREATE - Create a new comment
app.post('/comments', (req, res) => {
    const { username, comment } = req.body;

    comments.push({
        username,
        comment,
        id: uuid()
    });

    res.redirect('/comments');
});

// SHOW - Show a specific comment
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;

    const comment = comments.find(c => c.id === id);

    if (!comment) {
        return res.status(404).send('Comment not found');
    }

    res.render('comments/show', { comment });
});

// EDIT - Show edit form
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;

    const comment = comments.find(c => c.id === id);

    if (!comment) {
        return res.status(404).send('Comment not found');
    }

    res.render('comments/edit', { comment });
});

// UPDATE - Update comment
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const foundComment = comments.find(c => c.id === id);

    if (!foundComment) {
        return res.status(404).send('Comment not found');
    }

    foundComment.comment = comment;

    res.redirect('/comments');
});

// DELETE - Delete comment
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;

    const foundIndex = comments.findIndex(c => c.id === id);

    if (foundIndex === -1) {
        return res.status(404).send('Comment not found');
    }

    comments.splice(foundIndex, 1);

    res.redirect('/comments');
});

// Server
app.listen(8000, () => {
    console.log("ON PORT 8000!");
});
