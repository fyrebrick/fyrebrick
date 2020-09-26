
exports.default = async (req,res,options) =>
{
    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    res.send(res.statusCode);
};
