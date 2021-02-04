class User {
    constructor(username, email, password, creator, user_id) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.creator = creator;
        this.user_id = user_id;
    }

    static from(json) {
        return Object.assign(new User(), json);
    }
}

export default User;