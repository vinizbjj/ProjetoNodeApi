const { Router } = require("express");

const usersRoutes = Router();

usersRoutes.post("/", (request, response) => {
    const { name, email, password, avatar } = request.body;

    response.json({ name, email, password, avatar })
});

module.exports = usersRoutes