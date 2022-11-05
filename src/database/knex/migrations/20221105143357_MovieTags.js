
exports.up = knex => knex.schema.createTable("TagsMovies", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("note_id").references("id").inTable("MovieNotes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("MovieNotes");