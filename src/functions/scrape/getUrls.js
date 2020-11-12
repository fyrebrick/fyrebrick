
exports.default = async (req,res,options) =>
{
    http.get(options, function(res) {
        console.trace("Got response: " + res.statusCode);
    }).on('error', function(e) {
        console.trace("Got error: " + e.message);
    });
    res.send(res.statusCode);
};
