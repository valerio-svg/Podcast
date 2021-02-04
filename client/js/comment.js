class Comment {
    constructor(comment_id, podcast_id, episode_id, user_id, text) {
        this.comment_id = comment_id;
        this.podcast_id = podcast_id;
        this.episode_id = episode_id;
        this.user_id = user_id;
        this.text = text;
    }

    static from(json) {
        return Object.assign(new Comment(), json);
    }
}

export default Comment;