var OAuth = require('oauth');

let investigate = async (user)=> {
    return new Promise((resolve, reject) => {
        const oauth = new OAuth.OAuth(
            user.TOKEN_VALUE,
            user.TOKEN_SECRET,
            user.CONSUMER_KEY,
            user.CONSUMER_SECRET,
            "1.0",
            null,
            "HMAC-SHA1"
        );
        let investData;
        oauth.get(
            'https://api.bricklink.com/api/store/v1/inventories',
            user.TOKEN_VALUE,
            user.TOKEN_SECRET, //test user secret
            function (e, data) {
                if (e) {
                    console.trace(e);
                    reject({message: e});
                }
                const itemList = JSON.parse(data);
                investData = {meta: itemList.meta, data: []};
                let currentIndexForInvestData = 0;
                itemList.data.forEach(
                    (item) => {
                        if (item.item.type === "PART") {
                            let addedToInvestDataThisCycle = false;
                            let addedThisItemToInvestDataThisCycle = false;
                            //current item, will check if any other item (exluding self) is same, add to investData if so
                            itemList.data.forEach(
                                (comparingItem) => {
                                    if (item.inventory_id !== comparingItem.inventory_id) { //exclude self
                                        if (
                                            item.item.no === comparingItem.item.no &&
                                            item.new_or_used === comparingItem.new_or_used &&
                                            item.color_id === comparingItem.color_id &&
                                            item.description === comparingItem.description
                                        ) {
                                            let itemNotYetUsedAsComparingItem = true;
                                            //check if comparingItem already was an Item
                                            investData.data.forEach((dataOfInvestData) => {
                                                dataOfInvestData.forEach((checkItem) => {
                                                    if (
                                                        item.item.no === checkItem.item.no &&
                                                        item.new_or_used === checkItem.new_or_used &&
                                                        item.color_id === checkItem.color_id &&
                                                        item.description === checkItem.description
                                                    ) {
                                                        itemNotYetUsedAsComparingItem = false;
                                                    }
                                                });
                                            });
                                            if (itemNotYetUsedAsComparingItem) {
                                                //if almost the same item, add this item to a new array in data array(investData)
                                                addedToInvestDataThisCycle = true;
                                                if (!addedThisItemToInvestDataThisCycle) {
                                                    investData.data.push([item]);
                                                    addedThisItemToInvestDataThisCycle = true;
                                                }
                                                investData.data[currentIndexForInvestData].push(comparingItem);
                                            }
                                        }
                                    }
                                }
                            );
                            //next item in inventory list
                            if (addedToInvestDataThisCycle) {
                                //if something has been added to the investData, the currentIndex will be changed
                                currentIndexForInvestData++;
                            }
                        }
                    }
                );
                resolve(investData);
            });
    });
}
module.exports = investigate;
