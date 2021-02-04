"use strict";

const db = require('./db.js');
const fs = require('fs');
const { resolve } = require('path');

const createPodcast = function (dbPodcast) {
    return ({
        image: dbPodcast.image, 
        author: dbPodcast.author, 
        title: dbPodcast.title, 
        description: dbPodcast.description, 
        category: dbPodcast.category,
        user_id: dbPodcast.user_id,
        podcast_id: dbPodcast.podcast_id
    });
}

const createEpisode = function (dbEpisode) {
    return ({
        name: dbEpisode.name,
        audio: dbEpisode.audio,
        description: dbEpisode.description,
        date: dbEpisode.date,
        sponsor: dbEpisode.sponsor,
        price: dbEpisode.price,
        podcast_id: dbEpisode.podcast_id,
        episode_id: dbEpisode.episode_id
    });
}

const createComment = function (dbComment) {
    return ({
        comment_id: dbComment.comment_id,
        podcast_id: dbComment.podcast_id,
        episode_id: dbComment.episode_id,
        user_id: dbComment.user_id,
        text: dbComment.text
    });
}

// --- PODCAST ---

// Restituisce tutti i podcast
exports.getAllPodcast = function() {
    // resolve -> parametro usato quando la promise va a buon fine
    // reject -> parametro usato quando la promise fallisce
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Podcast';
        db.all(sql, (err, rows) => {
            if(err) {
                reject(err); 
                return;
            }
            const podcast = rows.map((row) => createPodcast(row));
            resolve(podcast);
        });
    });
}

// Restituisce il podcast con relativo ID
exports.getPodcastId = function(podcast_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Podcast WHERE podcast_id = ?';
        db.get(sql, [podcast_id], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'Podcast not found.'});
            else {
                const podcast = createPodcast(row);
                resolve(podcast);
            }
        });
    });
}

// Restituisce tutti i podcast con relativo Autore
exports.getAllPodcastAuthor = function(author) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Podcast WHERE author = ?';
        db.get(sql, [author], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'Podcast not found.'});
            else {
                const podcast = createPodcast(row);
                resolve(podcast);
            }
        });
    });
}

// Restituisce tutti i podcast con relativa Categoria
exports.getAllPodcastCategory = function(category) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Podcast WHERE category = ?';
        db.get(sql, [category], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'Podcast not found.'});
            else {
                const podcast = createPodcast(row);
                resolve(podcast);
            }
        });
    });
}

// Aggiunta di un podcast
exports.addPodcast = function(podcast) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Podcast(image, author, title, description, category, user_id) VALUES(?,?,?,?,?,?)';
        db.run(sql, [podcast.image, podcast.author, podcast.title, podcast.description, podcast.category, podcast.user_id], function (err) {
            if(err)
                reject(err);
            else 
                resolve(this.lastID);
        });
    });
}

// Modifica di un podcast con un id
exports.updatePodcast = function(pod_id, newPodcast) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Podcast SET image = ?, title = ?, description = ?, category = ? WHERE podcast_id = ?';
        db.run(sql, [newPodcast.image, newPodcast.title, newPodcast.description, newPodcast.category, pod_id], function (err) {
            if(err)
                reject(err);
            else if (this.changes === 0)
                resolve({error: 'Podcast not found.'});
            else {
                resolve();
            }
        });
    });
}

// Eliminazione di un podcast
exports.deletePodcast = function(podcast_id) {
    return new Promise((resolve, reject) => {
        const sql1 = 'DELETE FROM Podcast WHERE podcast_id = ?';
        db.run(sql1, [podcast_id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0) {
                resolve({ error: 'Podcast not found.' });
            } else {
                const sql2 = 'DELETE FROM Episode WHERE podcast_id = ?';
                db.run(sql2, [podcast_id], function (err) {
                    if (err) reject(err);
                    else {
                        const sql3 = 'DELETE FROM Comment WHERE podcast_id = ?';
                        db.run(sql3, [podcast_id], function (err) {
                            if (err) reject(err);
                            else {
                                const sql4 = 'DELETE FROM Follow WHERE podcast_id = ?';
                                db.run(sql4, [podcast_id], function (err) {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

// --- EPISODE ---

exports.getAllEpisode = function() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Episode'; 
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            const episode = rows.map((row) => createEpisode(row));
            resolve(episode);
        });
    });
}

// Restituisce tutti gli episodi di un podcast
exports.getAllEpisodeFromPodcast = function(podcast_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Episode WHERE podcast_id = ? ORDER BY datetime() asc';
        db.all(sql, [podcast_id], (err, rows) => {
            if(err) {
                reject(err); 
                return;
            }
            const episode = rows.map((row) => createEpisode(row));
            resolve(episode);
        });
    });
}

// Restituisce episodio con relativo id
exports.getEpisodeFromPodcastId = function(episode_id, podcast_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Episode WHERE episode_id = ? and podcast_id = ?';
        db.get(sql, [episode_id, podcast_id], (err, row) => {
            if(err) 
                reject(err);
            else {
                const episode = createEpisode(row);
                resolve(episode);
            }
        });
    });
}

// Aggiunta di un episodio
exports.addEpisode = function(episode) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Episode(name, audio, description, date, sponsor, price, podcast_id) VALUES(?,?,?,DATE(?),?,?,?)';
        db.run(sql, [episode.name, episode.audio, episode.description, episode.date, episode.sponsor, episode.price, episode.podcast_id], function (err) {
            if(err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Modifica di un episodio con un id
exports.updateEpisode = function(ep_id, newEpisode) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Episode SET name = ?, audio = ?, description = ?, sponsor = ?, price = ? WHERE episode_id = ?';
        db.run(sql, [newEpisode.name, newEpisode.audio, newEpisode.description, newEpisode.sponsor, newEpisode.price, ep_id], function (err) {
            if(err){
                reject(err);
            } else if (this.changes === 0)
                resolve({error: 'Episode not found.'});
            else {
                resolve();
        }
        });
    });
}

// Eliminazione episodio
exports.deleteEpisode = function(episode_id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Episode WHERE episode_id = ?';
        db.run(sql, [episode_id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0)
                resolve({error: 'Episode not found.'});
            else {
                const sql2 = 'DELETE FROM Comment WHERE episode_id = ?';
                db.run(sql2, [episode_id], function (err) {
                    if (err) reject(err);
                    else {
                        const sql3 = 'DELETE FROM Favorite WHERE episode_id = ?';
                        db.run(sql3, [episode_id], function (err) {
                            if (err) reject(err);
                            else {
                                const sql4 = 'DELETE FROM Buy WHERE episode_id = ?';
                                db.run(sql4, [episode_id], function (err) {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

// --- BUY EPISODE ---

// Aggiunge l'episodio acquistato da un certo utente
exports.addBuyEpisode = function (buy) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Buy(user_id, episode_id) VALUES(?,?)';
        db.run(sql, [buy.user_id, buy.episode_id], function(err) {
            if(err) {
                reject(err);
            } else {
                resolve(buy);
            }
        });
    });
}

// Restituisce l'id dell'utente e dell'episodio di un acquisto
exports.getBuy = function (user_id, episode_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Buy WHERE user_id=? AND episode_id=?';
        db.get(sql, [user_id, episode_id], (err, row) => {
            if(err) {
                reject(err);
            } else if(row == undefined) {
                resolve({ error: 'Buy not found.' });
            } else {
                resolve(row);
            }
        });
    });
}

// --- COMMENT ---

// Restituisce un commento di un episodio di un determinato podcast
exports.getComment = function (podcast_id, episode_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Comment WHERE podcast_id = ? AND episode_id = ?';
        db.all(sql, [podcast_id, episode_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const comment = rows.map((row) => createComment(row));
                resolve(comment);
            }
        });
    });
}

// Aggiunge un commento a un episodio di un determinato podcast
exports.addComment = function (comment) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Comment(podcast_id, episode_id, user_id, text) VALUES(?,?,?,?)';
        db.run(sql, [comment.podcast_id, comment.episode_id, comment.user_id, comment.text], function(err) {
            if(err) {
                reject(err);
            } else {
                resolve(comment);
            }
        });
    });
}

// Modifica un commento con specifico ID
exports.updateComment = function (comment_id, text) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Comment SET text = ? WHERE comment_id = ?';
        db.run(sql, [text, comment_id], function (err) {
            if(err) {
                reject(err);
            } else if(this.changes === 0) {
                resolve({ error: 'Comment not found.' });
            } else {
                resolve();
            }
        })
    });
}

// Cancella un commento con specifico ID
exports.deleteComment = function (comment_id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Comment WHERE comment_id = ?';
        db.run(sql, [comment_id], function(err) {
            if(err) {
                reject(err);
            }
            else if(this.changes === 0) {
                resolve({ error: 'Comment not found.' });
            } else {
                resolve();
            }
        });
    });
}

// --- FAVORITE ---

// Restituisce i preferiti dato l'id di un episodio e l'id dell'utente
exports.getFavorite = function (user_favorite_id, episode_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Favorite WHERE (user_favorite_id=? AND episode_id=?)';
        db.get(sql, [user_favorite_id, episode_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Favorite not found.' });
            }
            else {
                resolve(row);
            }
        });
    });
}

// Aggiunge il preferito
exports.addFavorite = function (favorite) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Favorite(user_favorite_id, episode_id) VALUES(?,?)';
        db.run(sql, [favorite.user_favorite_id, favorite.episode_id], function (err) {
            if(err) {
                reject(err);
            } else {
                resolve(favorite);
            }
        });
    });
}

// Rimuove il preferito
exports.deleteFavorite = function (user_favorite_id, episode_id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM favorite WHERE (user_favorite_id = ? AND episode_id = ?)';
        db.run(sql, [user_favorite_id, episode_id], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0) {
                resolve({ error: 'Favorite not found.' });
            }
            else {
                resolve();
            }
        });
    });
}

// --- FOLLOW ---

// Restituisce i follow dato l'id di un podcast e l'id dell'utente
exports.getFollow = function (user_follow_id, podcast_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Follow WHERE (user_follow_id=? AND podcast_id=?)';
        db.get(sql, [user_follow_id, podcast_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Follow not found.' });
            }
            else {
                resolve(row);
            }
        });
    });
}

// Aggiunge il follow a un podcast
exports.addFollow = function (follow) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Follow(user_follow_id, podcast_id) VALUES(?,?)';
        db.run(sql, [follow.user_follow_id, follow.podcast_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(follow);
            }
        });
    });
}

// Rimuove il follow a un podcast
exports.deleteFollow = function (user_follow_id, podcast_id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Follow WHERE (user_follow_id = ? AND podcast_id = ?)';
        db.run(sql, [user_follow_id, podcast_id], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0) {
                resolve({ error: 'Follow not found.' });
            }
            else {
                resolve();
            }
        });
    });
}

// --- PROFILE ---

exports.getFollowProfile = function (user_follow_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM (SELECT * FROM Podcast INNER JOIN Follow ON Follow.podcast_id = Podcast.podcast_id) WHERE user_follow_id=?';
        db.all(sql, [user_follow_id], (err, rows) => {
            if(err) 
                reject(err);
            else {
                const podcast = rows.map((row) => createPodcast(row));
                resolve(podcast);
            }
        });
    });
}

exports.getFavoriteProfile = function (user_favorite_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM (SELECT * FROM Episode INNER JOIN Favorite ON Favorite.episode_id = Episode.episode_id) WHERE user_favorite_id=?';
        db.all(sql, [user_favorite_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const episode = rows.map((row) => createEpisode(row));
                resolve(episode);
            }
        });
    });
}