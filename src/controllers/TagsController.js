const { request } = require("express");
const knex = require("../database/knex")

class TagsController {
    async index(request, response) {
        const {user_id} = request.params;

        const tags = await knex("TagsMovies")
            .where({ user_id })

        return response.json(tags)
    }
}

module.exports = TagsController;

