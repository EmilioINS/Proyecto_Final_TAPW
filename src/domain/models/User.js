class User {
    constructor({ id, name, email, password_hash, created_at }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
        this.created_at = created_at;
    }
}

module.exports = User;
