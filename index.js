
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

// NEW - Show new comment form
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
});

// CREATE - Add new comment
app.post('/comments', (req, res) => {
    const { username, comment } = req.body;

    comments.push({
        id: uuid(),
        username,
        comment
    });

    res.redirect('/comments');
});

// SEARCH - Search comments
app.get('/comments/search', (req, res) => {
    const { q } = req.query;

    const searchQuery = (q || '').trim().toLowerCase();

    const results = comments.filter(c =>
        c.username.toLowerCase().includes(searchQuery) ||
        c.comment.toLowerCase().includes(searchQuery)
    );

    res.render('comments/search', {
        results,
        q: q || ''
    });
});

// FILTER - Select username
app.get('/comments/filter', (req, res) => {
    const { username } = req.query;

    const usernames = [...new Set(comments.map(c => c.username))];

    let results = comments;

    if (username && username !== 'all') {
        results = comments.filter(c => c.username === username);
    }

    res.render('comments/filter', {
        results,
        usernames,
        selectedUsername: username || 'all'
    });
});

// SHOW - Show single comment
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

// SERVER
app.listen(8000, () => {
    console.log('ON PORT 8000!');
});
