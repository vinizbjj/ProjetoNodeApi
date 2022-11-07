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

    async index(request, response) {
        const { title, user_id, tags } = request.query;

        let movies;

        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim());

            movies = await knex("TagsMovies")
                .select([
                    "MovieNotes.id",
                    "MovieNotes.title",
                    "MovieNotes.user_id",
                ])
                .where("MovieNotes.user_id", user_id)
                .whereLike("MovieNotes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("MovieNotes", "MovieNotes.id", "TagsMovies.note_id")
                .orderBy("MovieNotes.title")

        } else {
            movies = await knex("MovieNotes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title")
        }

        const userTags = await knex("TagsMovies").where({ user_id });
        const notesWithTags = movies.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }

        })

        return response.json(notesWithTags)
    }

}

module.exports = MovieNotesController;