const response = {};

response.sendSuccess = (res, data, msg) => {
    res.status(200).json({
        status: true,
        message: msg,
        data: data
    });
};
response.sendError = (res, error) => {
    res.status(400).json({
        status: false,
        message: error
    });
};
module.exports = response;