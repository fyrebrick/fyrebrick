const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const bricklinkPlus = require("bricklink-plus");
const item_types = ["MINIFIG","PART","SET","BOOK","GEAR","CATALOG","INSTRUCTION","UNSORTED_LOT","ORIGINAL_BOX"];


router.post('/getknowncolours',async(req,res)=>{
    let user = await User.findOne({_id:req.session._id});
    await bricklinkPlus.auth.setup({
        TOKEN_VALUE: user.TOKEN_VALUE,
        TOKEN_SECRET: user.TOKEN_SECRET,
        CONSUMER_KEY: user.CONSUMER_KEY,
        CONSUMER_SECRET: user.CONSUMER_SECRET
    });
    let data = await bricklinkPlus.api.item.getKnownColors(req.body.type,req.body.no);
    //console.log(data);
    let returnData = {meta:data.meta,data:[]};
    //[{color_id,quantity}]
    for (let i = 0, len = data.data.length; i < len; i++) {
        let color = bricklinkPlus.plus.color.getInfoFromColorId(data.data[i].color_id);
        returnData.data.push({
            rgb:color.rgb,
            name:color.name,
            colortype:color.colortype,
            color_id:data.data[i].color_id,
            quantity:data.data[i].quantity
        });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(returnData);
    
});

router.post('/search',async (req, res) => {
    let user = await User.findOne({_id:req.session._id});
    await bricklinkPlus.auth.setup({
        TOKEN_VALUE: user.TOKEN_VALUE,
        TOKEN_SECRET: user.TOKEN_SECRET,
        CONSUMER_KEY: user.CONSUMER_KEY,
        CONSUMER_SECRET: user.CONSUMER_SECRET
    })
   //find out if search is for keyword or item no
    const search = req.body.search;
    let returnData = {meta:{},data:[]};
    //first search item with search
    //find out what type it is.
    for (let i = 0, len = item_types.length; i < len; i++) {
        //console.log(item_types[i],search);
        const data = await bricklinkPlus.api.item.getItem(item_types[i],String(search));
        //console.log(data);
        if(data.data && data.data.no){
            console.log('found with type '+item_types[i]);
            //console.log(data);
            returnData.meta = data.meta;
            returnData.data.push(data.data);
            //console.log(returnData);
            res.setHeader('Content-Type', 'application/json');
            res.send(returnData);
            return;
            //found correct type
        }
    }
    //if not found anything try adding wildcard (this can mean more than 1 data)
    for (let i = 0, len = item_types.length; i < len; i++) {
        const data = await bricklinkPlus.api.item.getItem(item_types[i],String("***"+search+"***"));
        if(data.data && data.data.no){
            //found correct type, adding to returnData
            returnData.meta = data.meta;
            returnData.data.push(data.data);
        }
    }
    // found data returning
    //console.log(returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(returnData);

    //de
    //didnt found anything, trying keywords now
    // res.setHeader('Content-Type', 'application/json');
    // res.send(await bricklinkPlus.plus.search.byKeywords(search));

    // /**
    //  * @method byKeywords
    //  * @description simulates the bricklink website search engine
    //  * @param {String} keywords - all the keywords in 1 string
    //  * @return {Promise<DATA>}
    //  */
    // byKeywords: async (keywords)=> {
    //     return new Promise((resolve, reject)=>{
    //         let data = '';
    //         const url = encodeURI("https://www.bricklink.com/v2/search.page?q="+keywords+"&rpp=100&tab=P");
    //         const casper = casperJS.create();
    //         casper.start(url,()=>{
    //             this.waitForSelecter('#_idContentsTabC');
    //         })
    //         casper.then(()=>{
    //             data = this.getHtml();
    //         })
    //         casper.then(()=>{
    //             let $ = cheerio.load(data);
    //             console.log(data);
    //             let foundData = [];
    //             console.log($("td .pspItemNameLink").length);
    //             $("td .pspItemNameLink").each((i, elem) => {
    //                 console.log(i);
    //                 console.log($(elem).text());
    //                 if (!String($(elem).attr('href')).includes("[%catalogUrl%]")) {
    //                     let currentItem = {
    //                         "description": $(elem).text(),
    //                         "link": "https://www.bricklink.com"+$(elem).attr('href'),
    //                         "name": decodeURI($(elem).attr('href')).match(/name=(.+)&/gm)[0],
    //                         "category": decodeURI($(elem).attr('href')).match(/category=(.+)/gm)[0],
    //                         "id": decodeURI($(elem).attr('href')).match(/[G,P,B,M,S,O,I,C]=(.+)&name/gm)[0],
    //                     };
    //                     foundData.push(currentItem);
    //                 }
    //             });
    //             return foundData;
    //         })
    //         casper.start();
    //     });
    //
    // }


});

module.exports = router;
