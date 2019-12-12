const handler = (err, req, res, next) => {
    let error = {
        status: err.status || 500,
        message: err.message || 'Errors with server!',
    };

    if (err.name === 'ValidationError') {
        error.errors = err.errors;
    }

    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }

    res.status(error.status).json(error);
};

module.exports = handler;
