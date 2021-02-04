// imports
const express = require('express');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const dao = require('./dao.js');
const userDao = require('./user-dao.js')
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.getUser(username, password).then(({user, check}) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!check) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

// serialize and de-serialize the user (user object <-> session)
// serializzazione: prende l'utente e utilizza l'id dell'utente
// per associarlo a un id di sessione appena creato
passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});
  
// deserializzazione: una volta che arriva il cookie con l'id di sessione
// recupera l'id dell'utente che corrisponde a quel cookie
// e poi con getUserById recupera l'utente
passport.deserializeUser(function(id, done) {
    userDao.getUserById(id).then(user => {
        done(null, user);
    });
});

// init express
const app = express();
const port = process.env.PORT || 3000;

// set up the middleware
app.use(morgan('tiny'));

// process body content as JSON
app.use(express.json());

// set-up the client component as a static website
app.use(express.static('client'));

app.get('/', (req, res) => res.redirect('/'));

// set up the session
app.use(session({
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false,
    // 30 giorni
    cookie: {maxAge: 2592000000}
}));
  
// init passport
app.use(passport.initialize());
app.use(passport.session());

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}

// ------- REST API -------------

// --- LOGIN ---

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, function(err) {
            if (err) { return next(err); }
            // req.user contains the authenticated user
            return res.json(req.user);
        });
    }) (req, res, next);
});

app.post('/api/login', passport.authenticate('local'),
    // Se questa funzione è richiamata allora l'utente è loggato
    function (req, res) {
        res.json(req.user);
    });

// --- LOGOUT ---

// DELETE /api/sessions/current 
app.delete('/api/sessions/current', function(req, res){
    req.logout();
    res.end();
});

// --- PODCAST ---

// GET /api/podcast
app.get('/api/podcast', function (req, res) {
    dao.getAllPodcast()
        // il .then verra' chiamato se la promise nel 'dao.js'
        // andra' a buon fine, se no sara' chiamato il .catch
        .then((podcasts) => res.json(podcasts))
        .catch((err) => {
            res.status(500).json({ errors: [{ 'msg': err }], });
        });
});

// GET /api/podcast/:podcast_id
app.get('/api/podcast/:podcast_id', function (req, res) {
    dao.getPodcastId(req.params.podcast_id)
        .then((podcast) => {
            if (podcast.err) {
                res.json(404).json(podcast);
            } else {
                res.json(podcast);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

// GET /api/podcast/author/:author
app.get('/api/podcast/author/:author', function (req, res) {
    dao.getAllPodcastAuthor(req.params.author)
        .then((podcast) => {
            if (podcast.error) {
                res.json(404).json(podcast);
            } else {
                res.json(podcast);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

// GET /api/podcast/category/:category
app.get('/api/podcast/category/:category', function (req, res) {
    dao.getAllPodcastCategory(req.params.category)
        .then((podcast) => {
            if (podcast.error) {
                res.json(404).json(podcast);
            } else {
                res.json(podcast);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

// POST /api/podcast
app.post('/api/podcast', [
    body('image').notEmpty(),
    body('author').notEmpty(),
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty(),
    body('user_id').notEmpty(),
    isLoggedIn
], (req, res) => {

    const podcast = req.body;
    dao.addPodcast(podcast)
        .then((id) => res.status(201).header('Location', `/podcast/${id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});

// PUT /api/podcast/:podcast_id
app.put('/api/podcast/:podcast_id', [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('image').notEmpty(),
    body('category').notEmpty(),
    isLoggedIn
], (req, res) => {

    const podcast = req.body;
    dao.updatePodcast(req.params.podcast_id, podcast)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// DELETE /api/podcast/:podcast_id
app.delete('/api/podcast/:podcast_id', isLoggedIn, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    dao.deletePodcast(req.params.podcast_id)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// --- EPISODE ---

app.get('/api/episode', function (req, res) {
    dao.getAllEpisode()
        .then((episodes) => res.json(episodes))
            .catch((err) => {
                res.status(500).json({ errors: [{ 'msg': err }], });
            });
});

// GET /api/podcast/:podcast_id/episode
app.get('/api/podcast/:podcast_id/episode', function (req, res) {
    dao.getAllEpisodeFromPodcast(req.params.podcast_id)
        .then((episodes) => res.json(episodes))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }]
            });
        });
});

// GET /api/podcast/:podcast_id/episode/:episode_id
app.get('/api/podcast/:podcast_id/episode/:episode_id', function (req, res) {
    dao.getEpisodeFromPodcastId(req.params.episode_id, req.params.podcast_id)
        .then((episode) => res.json(episode))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }]
            });
        });
});

// POST /api/podcast/:episode_id
app.post('/api/podcast/:episode_id', [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('audio').notEmpty(),
    body('date').notEmpty(),
    isLoggedIn
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const episode = req.body;
    dao.addEpisode(episode)
        .then((id) => res.status(201).header('Location', `/podcast/${id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});

// PUT /api/podcast/:podcast_id/episode/:episode_id
app.put('/api/podcast/:podcast_id/episode/:episode_id', [
    body('name').notEmpty(),
    body('audio').notEmpty(),
    body('description').notEmpty(),
    isLoggedIn
],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const episode = req.body;
    dao.updateEpisode(req.params.episode_id, episode)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// DELETE /api/episode/:episode_id
app.delete('/api/episode/:episode_id', isLoggedIn, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    dao.deleteEpisode(req.params.episode_id)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// --- BUY EPISODE ---

// POST /api/buy
app.post('/api/buy', isLoggedIn, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const buy = req.body;
    dao.addBuyEpisode(buy)
        .then(() => res.status(201).end())
        .catch((err) => res.status(503).json({ error: err }));
});

// GET /api/buy/:user_id/:episode_id
app.get('/api/buy/:user_id/:episode_id', (req, res) => {
    dao.getBuy(req.params.user_id, req.params.episode_id)
        .then((buy) => res.json(buy))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// --- COMMENT ---

// GET /api/comment/:podcast_id/:episode_id
app.get('/api/comment/:podcast_id/:episode_id', (req, res) => {
    dao.getComment(req.params.podcast_id, req.params.episode_id)
        .then((comment) => res.json(comment))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// POST /api/comment
app.post('/api/comment', [ 
    body('text').notEmpty(), 
    isLoggedIn
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const comment = req.body;
    dao.addComment(comment)
        .then(() => res.status(201).end())
        .catch((err) => res.status.json({ error: err }));
});

// UPDATE /api/comment/:comment_id
app.put('/api/comment/:comment_id', [
    body('text').notEmpty(),
    isLoggedIn
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const comment = req.body;
    dao.updateComment(req.params.comment_id, comment.text)
        .then((result) => {
            if(result)
                res.status(404).json(result);
            else 
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
})

// DELETE /api/comment/:comment_id
app.delete('/api/comment/:comment_id', isLoggedIn,(req, res) => {
    dao.deleteComment(req.params.comment_id)
        .then((result) => {
            if(result)
                res.status(404).json(result);
            else 
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// --- FAVORITE ---

// GET /api/favorite/:episode_id/:user_favorite_id
app.get('/api/favorite/:episode_id/:user_favorite_id', (req, res) => {
    dao.getFavorite(req.params.user_favorite_id, req.params.episode_id)
        .then((favorite) => res.json(favorite))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// POST /api/favorite/:episode_id/:user_favorite_id
app.post('/api/favorite/:episode_id/:user_favorite_id', isLoggedIn,(req, res) => {
    const favorite = {
        user_favorite_id: req.params.user_favorite_id,
        episode_id: req.body.episode_id
    }
    dao.addFavorite(favorite)
        .then((favorite) => res.status(201).header('Location', `/favorite/${favorite.episode_id}/${favorite.user_favorite_id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});

// DELETE /api/favorite/:episode_id/:user_favorite_id
app.delete('/api/favorite/:episode_id/:user_favorite_id', isLoggedIn,(req, res) => {
    dao.deleteFavorite(req.params.user_favorite_id, req.params.episode_id)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// --- FOLLOW ---

// GET /api/follow/:podcast_id/:user_follow_id
app.get('/api/follow/:podcast_id/:user_follow_id', (req, res) => {
    dao.getFollow(req.params.user_follow_id, req.params.podcast_id)
        .then((follow) => res.json(follow))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// POST /api/follow/:podcast_id/:user_follow_id
app.post('/api/follow/:podcast_id/:user_follow_id', isLoggedIn,(req, res) => {
    const follow = {
        user_follow_id: req.params.user_follow_id,
        podcast_id: req.body.podcast_id
    }
    console.log(follow);
    dao.addFollow(follow)
        .then((follow) => res.status(201).header('Location', `/follow/${follow.podcast_id}/${follow.podcast_id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});

// DELETE /api/follow/:podcast_id/:user_follow_id
app.delete('/api/follow/:podcast_id/:user_follow_id', isLoggedIn,(req, res) => {
    dao.deleteFollow(req.params.user_follow_id, req.params.podcast_id)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// --- PROFILE ---

// GET /api/podcast/followed/:user_follow_id
app.get('/api/podcast/followed/:user_follow_id', (req, res) => {
    dao.getFollowProfile(req.params.user_follow_id)
        .then((follow) => res.json(follow))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// GET /api/favorite/:user_id_favorite
app.get('/api/favorite/:user_id_favorite', (req, res) => {
    dao.getFavoriteProfile(req.params.user_id_favorite)
        .then((favorite) => res.json(favorite))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// --- USER ---

// GET /api/users/:user_id
app.get('/api/users/:user_id', (req, res) => {
    userDao.getUserById(req.params.user_id)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// GET /api/users/username/:username
app.get('/api/users/username/:username', (req, res) => {
    userDao.getUserByUsername(req.params.username)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// POST /api/users
app.post('/api/users', [
    body('username').notEmpty(),
    body('email').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // create a user object from the signup form
    const user = {
        username: req.body.username.trim(),
        email: req.body.email.toLowerCase().trim(),
        password: req.body.password,
        creator: req.body.creator
    };
    userDao.getUserByEmail(user.email)
        .then((response) => {
            if (response.error) {
                // user not found
                userDao.createUser(user)
                    .then((result) => res.status(201).header('Location', `/users/${result}`).end())
                    .catch((error) => res.status(503).json({ error: 'Database error during the signup' }));
            } else {
                // use alredy registered
                res.status(422).json({ errors: [{ msg: 'User already registered', param: user.email }] });
            }
        })
});

// All the other requests will be served by our client-side app
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client/index.html'));
});

// Activate server
app.listen(port, () => console.log('Server ready'));