class Follow {
    constructor(user_follow_id, podcast_id) {
        this.user_follow_id = user_follow_id;
        this.podcast_id = podcast_id;
    }

    static from(json) {
        return Object.assign(new Follow(), json);
    }
}

export default Follow;