var OAuth = require('oauth');

let addToInventoryIds = async(items,qty,_index,user) => {
    return new Promise((resolve,reject)=> {
            qty = qty.trim().split("&");
            items = items.trim().split("&");
            let qtyMax = 0; //qtyMax is all qty's except the index one
            let dataInfo = [];
            const oauth = new OAuth.OAuth(
                user.TOKEN_VALUE,
                user.TOKEN_SECRET,
                user.CONSUMER_KEY,
                user.CONSUMER_SECRET,
                "1.0",
                null,
                "HMAC-SHA1"
            );
            qty.forEach((q, index) => {
                if (index != _index) {
                    qtyMax += Number(q);
                    oauth.delete(
                        'https://api.bricklink.com/api/store/v1/inventories/' + items[index],
                        user.TOKEN_VALUE,
                        user.TOKEN_SECRET, //test user secret
                        function (e, data) {
                            if(e){
                                console.trace(e);
                                reject({message:e});
                            }
                            dataInfo.push(data);
                            if(index===qty.length){
                                oauth.put(
                                    'https://api.bricklink.com/api/store/v1/inventories/' + items[Number(_index)],
                                    user.TOKEN_VALUE,
                                    user.TOKEN_SECRET, //test user secret
                                    post_body = '{"quantity":"+' + qtyMax + '"}',
                                    post_content_type = "application/json",
                                    function (e, data) {
                                        if (e) {
                                            console.trace(e);
                                            reject({message: e});
                                        }
                                        resolve({data: dataInfo});
                                    });
                            }
                        });

                }
            });

        }
    )
}

module.exports = addToInventoryIds;