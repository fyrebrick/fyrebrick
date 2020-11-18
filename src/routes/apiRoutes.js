const router = require("express").Router();
const OAuth = require('oauth');

router.all('/*',(req,res)=>{
    let uri = "https://api.bricklink.com/api/store/v1"+req.url;
    const oauth = new OAuth.OAuth(
        req.session.user.TOKEN_VALUE,
        req.session.user.TOKEN_SECRET,
        req.session.user.CONSUMER_KEY,
        req.session.user.CONSUMER_SECRET,
        "1.0",
        null,
        "HMAC-SHA1"
    )
    switch (req.method){
        case "GET":
            oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        case "POST":
            oauth.post(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        case "PUT":
            oauth.put(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        case "DELETE":
            oauth.delete(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        default:
            res.send({message:"This type of request is not supported"});
    }
});

// REFACTOR THESE
// if(req.params.v1==="change_single_remarks"){
//     await bricklinkPlus.api.inventory.updateInventory(req.body.id,{remarks:req.body.newRemarkName}).then((data) => {
//         res.send(data);
//     });
// }else if(req.params.v1==="change_quantity"){
//     await bricklinkPlus.api.inventory.updateInventory(req.body.id,{quantity:req.body.newQuantity}).then((data) => {
//         res.send(data);
//     });
// }else if(req.params.v1==="change_used"){
//     await bricklinkPlus.api.inventory.updateInventory(req.body.id,{new_or_used:req.body.newUsed}).then((data) => {
//         res.send(data);
//     });
// }else if(req.params.v1==="change_colour"){
//     await bricklinkPlus.api.inventory.updateInventory(req.body.id,{color_id:req.body.newColour,color_name:req.body.newName}).then((data) => {
//         res.send(data);
//     });
// }else if(req.params.v1==="orders_limit"){
//     await bricklinkPlus.api.order.getOrders({status: "pending,updated,processing,ready,paid,packed"}).then((data) => {
//         res.send(data);
//     });
// }



module.exports = router;
