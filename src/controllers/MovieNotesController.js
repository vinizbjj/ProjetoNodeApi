const knex = require("../database/knex");

class MovieNotesController {
    async create(request, response) {
        const { title, description, rating, TagsMovies } = request.body;
        const { user_id } = request.params;

        const note_id = await knex("MovieNotes").insert({
            title,
            description,
            rating,
            user_id
        });

        const tagsInsert = TagsMovies.map(name => {
            return {
                note_id,
                user_id,
                name,
            }
        });

        await knex("TagsMovies").insert(tagsInsert);

        response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const movie = await knex("MovieNotes").where({ id }).first();
        const tags = await knex("TagsMovies").where({ note_id: id }).orderBy("name");


        return response.json({
            ...movie,
            tags
        })

    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("MovieNotes").where({ id }).delete();

        return response.json();
    }

}

module.exports = MovieNotesController;