import Podcast from './podcast.js';
import Episode from './episode.js';
import Comment from './comment.js';
import Favorite from './favorite.js';
import Follow from './follow.js';
import User from './user.js';
import Buy from './buy.js';

class Api {

    // --- API PODCAST ---

    static getAllPodcast = async () => {
        let response = await fetch('/api/podcast');
        const podcastJson = await response.json();
        if (response.ok) {
            return podcastJson.map((pod) => Podcast.from(pod));
        } else {
            throw podcastJson;
        }
    }

    static getPodcastId = async (podcast_id) => {
        let response = await fetch('/api/podcast/' + podcast_id);
        const podcastJson = await response.json();
        if (response.ok) {
            return Podcast.from(podcastJson);
        } else {
            throw podcastJson;
        }
    }

    static getAllPodcastAuthor = async (author) => {
        let response = await fetch('/api/podcast/' + author);
        const podcastJson = await response.json();
        if (response.ok) {
            return podcastJson.map((pod) => Podcast.from(pod));
        } else {
            throw podcastJson;
        }
    }

    static getAllPodcastCategory = async (category) => {
        let response = await fetch('/api/podcast/' + category);
        const podcastJson = await response.json();
        if(response.ok) {
            return podcastJson.map((pod) => Podcast.from(pod));
        } else {
            throw podcastJson;
        }
    }

    static addPodcast = async (podcast) => {
        let response = await fetch('/api/podcast/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(podcast),
        });
        if (response.ok) {
            console.log(JSON.stringify(podcast));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static deletePodcast = async (podcast_id) => {
        let response = await fetch('/api/podcast/' + podcast_id, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                } else 
                    throw 'Error: cannot parse server response';
            }
        }
    }

    static updatePodcast = async (podcast_id, newPodcast) => {
        let response = await fetch('/api/podcast/' + podcast_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPodcast),
        });
        if(response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    // --- API EPISODE ---

    static getAllEpisode = async () => {
        let response = await fetch('/api/episode');
        const episodeJson = await response.json();
        if (response.ok) {
            return episodeJson.map((ep) => Episode.from(ep));
        } else {
            throw episodeJson;
        }
    }

    static getAllEpisodeFromPodcast = async (podcast_id) => {
        let response = await fetch('/api/podcast/' + podcast_id + '/episode');
        const episodeJson = await response.json();
        if (response.ok) {
            return episodeJson.map((ep) => Episode.from(ep));
        } else {
            throw episodeJson;
        }
    }

    static getEpisodeFromPodcastId = async (podcast_id, episode_id) => {
        let response = await fetch('/api/podcast/' + podcast_id + '/episode/' + episode_id);
        const episodeJson = await response.json();
        if(response.ok) {
            return Episode.from(episodeJson);
        } else {
            throw episodeJson;
        }
    }

    static addEpisode = async (episode) => {
        let response = await fetch('/api/podcast/:podcast_id/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(episode),
        });
        if (response.ok) {
            console.log(JSON.stringify(episode));
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static updateEpisode = async (podcast_id, episode) => {
        let response = await fetch('/api/podcast/' + podcast_id + '/episode/'+ episode.episode_id, {
            method: 'PUT',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(episode),
        });
        if(response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static deleteEpisode = async (episode_id) => {
        let response = await fetch(`/api/episode/${episode_id}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    // --- API BUY EPISODE ---

    static addBuyEpisode = async (buy) => {
        let response = await fetch('/api/buy/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(buy),
        });
        if(response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static getBuy = async (user_id, episode_id) => {
        let response = await fetch('/api/buy/' + user_id + '/' + episode_id);
        const buyJson = await response.json();
        if(response.ok) {
            return Buy.from(buyJson);
        } else {
            throw buyJson;
        }
    }

    // --- API COMMENT ---

    static getComment = async (podcast_id, episode_id) => {
        let response = await fetch('/api/comment/' + podcast_id + '/' + episode_id);
        const commentJson = await response.json();
        if(response.ok) {
            return commentJson.map((ex) => Comment.from(ex));
        } else {
            throw commentJson;
        }
    }

    static addComment = async (comment) => {
        let response = await fetch('/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });
        if(response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static updateComment = async (comment_id, comment) => {
        let response = await fetch('/api/comment/' + comment_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });
        if (response.ok) {
            console.log(JSON.stringify(comment));
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static deleteComment = async (comment_id) => {
        let response  = await fetch('/api/comment/' + comment_id, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                } else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    // --- API FAVORITE ---

    static getFavorite = async (user_favorite_id, episode_id) => {
        let response = await fetch('/api/favorite/' + episode_id + '/' + user_favorite_id);
        const favoriteJson = await response.json();
        if (response.ok) {
            return Favorite.from(favoriteJson);
        } else {
            throw favoriteJson; 
        }
    }

    static addFavorite = async (favorite) => {
        let response = await fetch('/api/favorite/' + favorite.episode_id + '/' + favorite.user_favorite_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(favorite),
        });
        if (response.ok) {
            console.log(JSON.stringify(favorite));
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static deleteFavorite = async (user_favorite_id, episode_id) => {
        let response = await fetch('/api/favorite/' + episode_id + '/' + user_favorite_id, {
            method: 'DELETE',
        });
        if (response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                } else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    // --- API FOLLOW ---

    static getFollow = async (user_follow_id, podcast_id) => {
        let response = await fetch('/api/follow/' + podcast_id + '/' + user_follow_id);
        const followJson = await response.json();
        if (response.ok) {
            return Follow.from(followJson);
        } else {
            throw followJson; 
        }
    }

    static addFollow = async (follow) => {
        let response = await fetch('/api/follow/' + follow.podcast_id + '/' + follow.user_follow_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(follow),
        });
        if (response.ok) {
            console.log(JSON.stringify(follow));
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static deleteFollow = async (user_follow_id, podcast_id) => {
        let response = await fetch('/api/follow/' + podcast_id + '/' + user_follow_id, {
            method: 'DELETE',
        });
        if (response.ok) {
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch (err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                } else
                    throw 'Error: cannot parse server response';
            }
        }
    }

    // --- API PROFILE ---

    static getFollowProfile = async (user_follow_id) => {
        let response = await fetch('/api/podcast/followed/' + user_follow_id);
        const podcastJson = await response.json();
        if(response.ok) {
            return podcastJson.map((ex) => Podcast.from(ex));
        } else {
            throw podcastJson;
        }
    }

    static getFavoriteProfile = async (user_favorite_id) => {
        let response = await fetch('/api/favorite/' + user_favorite_id);
        const episodeJson = await response.json();
        if(response.ok) {
            return episodeJson.map((ex) => Episode.from(ex));
        } else {
            throw episodeJson;
        }
    }

    // --- API LOGIN e LOGOUT ---

    static doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const username = await response.json();
            return username;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            } catch(err) {
                throw err;
            }
        }
    }
    
    static doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }

    // --- API USER ---

    static createUser = async (user) => {
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (response.ok) {
            console.log(JSON.stringify(user));
            return;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            } catch(err) {
                if (Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e) => errors += `${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                } else {
                    console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }

    static getUserById = async (user_id) => {
        let response = await fetch('/api/users/' + user_id);
        const userJson = await response.json();
        if (response.ok) {
            return User.from(userJson);
        } else {
            throw userJson;
        }
    }

    static getUserByUsername = async (username) => {
        let response = await fetch('/api/users/username' + username);
        const userJson = await response.json();
        if (response.ok) {
            return User.from(userJson);
        } else {
            throw userJson;
        }
    }
}

export default Api;