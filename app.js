const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const itemsRoutes = require('./routes/items');


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// items routes
app.use('/items', itemsRoutes);


// 404 error handling
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});


// general error handler
app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({
        error: { message, status }
    });
});


module.exports = app;