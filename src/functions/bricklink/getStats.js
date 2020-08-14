var OAuth = require('oauth');

//only used inside the program!!
exports.default = async (user)=> {
    return new Promise(async (resolve, reject) => {
        {
            const oauth = new OAuth.OAuth(
                user.TOKEN_VALUE,
                user.TOKEN_SECRET,
                user.CONSUMER_KEY,
                user.CONSUMER_SECRET,
                "1.0",
                null,
                "HMAC-SHA1"
            );
            oauth.get(
                'https://api.bricklink.com/api/store/v1/inventories',
                user.TOKEN_VALUE,
                user.TOKEN_SECRET,
                function (e, data) {
                    if (e) console.error(e);
                    let obj = JSON.parse(new Object(data));
                    if (obj.meta.description.includes("TOKEN_IP_MISMATCHED")) {
                        reject(-1);
                        return;
                    }else{
                        let value = {
                            total_bricks:0,
                            total_unique_bricks:obj.data.length,
                            most_common_bricks:[0],
                            most_common_brick_colours:[]
                        };
                        obj.data.forEach((item)=>{
                           value.total_bricks += item.quantity;
                           let brick_colour_not_found = true;
                           value.most_common_brick_colours.forEach((c,index)=>{
                              if(c.color_name===item.color_name){
                                  brick_colour_not_found = false;
                                  value.most_common_brick_colours[index].quantity += item.quantity;
                              }
                           });
                           if(brick_colour_not_found){
                               value.most_common_brick_colours.push({
                                   color_name:item.color_name,
                                   quantity:item.quantity
                               });
                           }
                        });
                        resolve(value);
                    }
                }
            );
        };
    });
}
