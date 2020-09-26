var https = require('https');

exports.default = async ()=>{
    return new Promise ((resolve,reject)=>{
        //scraping
        let stats = [];
        https.get('https://www.bricklink.com/browseStores.asp?countryID=BE', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', async () => {
                let regex = /store\.asp\?p=([a-zA-Z_0-9\.\-]*)/gm;
                let groups = data.match(regex);
                let allStores = [];
                groups.forEach((i)=>{
                    allStores.push(i.split("store.asp?p=")[1]);
                });
                let stats = [];
               await allStores.forEach(async (store, index)=> {
                   await getStoreInfo(store).then((data)=>{
                       stats.push(data);
                       if(stats.length===allStores.length){try{

                           stats.sort((a, b) => (a.n4totalLots < b.n4totalLots) ? 1 : -1);
                       }catch(err){
                           console.trace(err);
                       }
                           resolve(stats);
                           return;
                       }
                   });
                });
            });

        }).on("error", (err) => {
            reject(null);
        });
    })
};

async function getStoreInfo(store){
    return new Promise ((resolve, reject) => {
        https.get('https://store.bricklink.com/' + store + '?p=' + store, async(resp) => {
            let storeData = '';
            resp.on('data', async(chunk) => {
                storeData += chunk;
            });
            resp.on('end', async() => {
                if (storeData) {
                    try{
                        let html = storeData;
                        let names = html.match(/name:[\t]*'(.+)',/g); //[0].split("'")[1];
                        let name = names[0].split("'")[1];
                        let username = names[1].split("'")[1];
                        let _n4totalLots = html.match(/\tn4totalLots:((.)*),/g)[0].split(/(\d+)/g);
                        let n4totalLots = Number(_n4totalLots.slice(_n4totalLots.length - 2, _n4totalLots.length - 1));
                        let _n4totalItems = html.match(/\tn4totalItems:((.)*),/g)[0].split(/(\d+)/g);
                        let n4totalItems = Number(_n4totalItems.slice(_n4totalItems.length - 2, _n4totalItems.length - 1));
                        let _n4totalViews = html.match(/\tn4totalViews:((.)*),/g)[0].split(/(\d+)/g);
                        let n4totalViews = Number(_n4totalViews.slice(_n4totalViews.length - 2, _n4totalViews.length - 1));
                        let obj = {
                            name: name,
                            username: username,
                            n4totalLots: n4totalLots,
                            n4totalItems: n4totalItems,
                            n4totalViews: n4totalViews
                        };
                        resolve(obj);
                    }catch(err){
                        console.trace(err);
                    }
                } else {
                    console.log("no store found for ", store);
                }

            });

        }).on("error", (err) => {
            resolve(getStoreInfo(store).then((data)=>{return data}));
        });
    })

}
