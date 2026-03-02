const success = (data) => {
    return {
        status: "success",
        data,
        error: null,
    };
}

const error = (message) => {
    return {
        status: "error",
        data: null,
        error: message,
    };
}

module.exports = {
    success,
    error,
};
