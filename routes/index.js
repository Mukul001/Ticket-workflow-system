var express = require('express')
var router = express.Router()

module.exports = function (app) {
    const basicRoute = require('../routes/basicRoutes');

    app.get('/', (req, res) => {
        return res.send(
             "Welcome to Ticket system."
        )
    })

    app.use('/api', 
        [
            basicRoute
        ]
    );
};