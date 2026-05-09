class Template {
    constructor({ id, department_id, name, description, html_content, token, is_active, created_at, updated_at }) {
        this.id = id;
        this.department_id = department_id;
        this.name = name;
        this.description = description;
        this.html_content = html_content;
        this.token = token;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = Template;
