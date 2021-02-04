class Podcast {
    constructor(image, author, title, description, category, user_id, podcast_id) {
        this.image = image;
        this.author = author;
        this.title = title;
        this.description = description;
        this.category = category;
        this.user_id = user_id;
        this.podcast_id = podcast_id;
    }

    static from(json) {
        return Object.assign(new Podcast(), json);
    }
}

export default Podcast;