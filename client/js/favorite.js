class Favorite {
    constructor(user_favorite_id, episode_id) {
        this.user_favorite_id = user_favorite_id;
        this.episode_id = episode_id;
    }

    static from(json) {
        return Object.assign(new Favorite(), json);
    }
}

export default Favorite;