class Buy {
    constructor(user_id, episode_id) {
        this.user_id = user_id;
        this.episode_id = episode_id;
    }

    static from(json) {
        return Object.assign(new Buy(), json);
    }
}

export default Buy;