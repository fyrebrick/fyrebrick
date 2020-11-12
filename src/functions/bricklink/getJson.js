var OAuth = require('oauth');

let getJson = async (req,res,user,onlyJson=false,linkOveride="",status="")=> {
    return new Promise(async (resolve, reject) => {
        {
            if (req.params.v1 === 'inventories') {
                status = req.params.v1;
            }
            const oauth = new OAuth.OAuth(
                user.TOKEN_VALUE,
                user.TOKEN_SECRET,
                user.CONSUMER_KEY,
                user.CONSUMER_SECRET,
                "1.0",
                null,
                "HMAC-SHA1"
            );
            let link = 'https://api.bricklink.com/api/store/v1/';
            let statusLink = 'https://api.bricklink.com/api/store/v1/orders?direction=in';
            let inventoryLink = 'https://api.bricklink.com/api/store/v1/inventories?';
            if (linkOveride !== "") {
                link = link;
            } else {
                if (req.params.v1) {
                    link += req.params.v1;
                }
                if (req.params.v2) {
                    link += '/' + req.params.v2;
                }
                if (req.params.v3) {
                    link += '/' + req.params.v3;
                }
                if (req.params.v4) {
                    link += '/' + req.params.v4;
                }
                if (req.params.v4) {
                    link += '/' + req.params.v4;
                }
                if (req.params.v4) {
                    link += '/' + req.params.v4;
                }
            }
            let statusObj;
            switch (status) {
                case "EMPTY_JSON":
                    resolve({meta: "EMTPY_JSON", data: []});
                    return;
                case "inventories":
                    if(req.query.search){
                        link = inventoryLink;
                    }
                    break;
                case "":
                    break;
                default:
                    link = statusLink;
            }
            oauth.get(
                link,
                user.TOKEN_VALUE,
                user.TOKEN_SECRET, //test user secret
                function (e, data) {
                    if (e) console.error(e);
                    let obj = JSON.parse(new Object(data));
                    if (obj.meta.description.includes("TOKEN_IP_MISMATCHED")) {
                        let j = {
                            "data": [{
                                "color_name": obj.meta.description,
                                "quantity": obj.meta.description,
                                "color_id": "",
                                "new_or_used": obj.meta.description,
                                "order_id": "Error",
                                "buyer_name": obj.meta.description
                            }]
                        };
                        resolve(j);
                        return;
                    }
                    if (req.params.v3 === 'items') {
                        if (obj.data.length > 1) {
                            let newData = obj.data[0];
                            obj.data[1].forEach((o) => {
                                newData.push(o);
                            });
                            let newObject = {
                                "meta": obj.meta,
                                "data": newData
                            };
                            if (onlyJson) {
                                return newObject;
                            }
                            resolve(newObject);
                        } else {
                            let j = {
                                "meta": obj.meta,
                                "data": obj.data[0]
                            };
                            resolve(j);
                            return;
                        }
                    } else if (req.params.v1 === "inventories" && req.query.search) {
                            let search = req.query.search.toLowerCase();
                            let newData = [];
                            for (let i = 0, len = obj.data.length; i < len; i++) {
                                if (obj.data[i].remarks) {
                                    if(req.query.exact==="Y"){
                                        if (obj.data[i].remarks.toLowerCase()===search) {
                                            newData.push(obj.data[i]);
                                        }
                                    }else{
                                        if (obj.data[i].remarks.toLowerCase().includes(search)) {
                                            newData.push(obj.data[i]);
                                        }
                                    }
                                }
                            }
                            resolve({
                                "meta": obj.meta,
                                "data": newData
                            });
                    } else if (status && status !== "inventories") {
                        statusObj = {meta: obj.meta, data: []};
                        obj.data.forEach((order) => {
                            if (order.status === status) {
                                statusObj.data.push(order);
                            }
                        });
                        resolve(statusObj);
                        return;
                    } else {
                        resolve(data);
                        return;
                    }
                });
        }

    });
};
module.exports = getJson;
