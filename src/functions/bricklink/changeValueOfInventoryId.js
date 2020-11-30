var OAuth = require('oauth');

let changeValue = async(sign,value,inventory_id,user) => {
    return new Promise((resolve,reject)=>{
        const oauth = new OAuth.OAuth(
            user.TOKEN_VALUE,
            user.TOKEN_SECRET,
            user.CONSUMER_KEY,
            user.CONSUMER_SECRET,
            "1.0",
            null,
            "HMAC-SHA1"
        );
        oauth.put(
            'https://api.bricklink.com/api/store/v1/inventories/'+inventory_id,
            user.TOKEN_VALUE,
            user.TOKEN_SECRET, //test user secret
            post_body='{"quantity":"'+sign+value+'"}',
            post_content_type="application/json",
            function (e, data){
                if(e)
                {
                    console.trace(e);
                    reject({message:e});
                }
                resolve({data:data});
            });
        }
    )
}

module.exports = changeValue;