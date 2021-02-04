class Episode {
    constructor(name, audio, description, date, sponsor, price, podcast_id, episode_id) {
        this.name = name;
        this.audio = audio;
        this.description = description;
        this.date = date;
        this.sponsor = sponsor;
        this.price = price;
        this.podcast_id = podcast_id;
        this.episode_id = episode_id;
    }

    static from(json) {
        return Object.assign(new Episode(), json);
    }
    
}

export default Episode;