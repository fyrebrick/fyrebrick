const {Order} = require("fyrebrick-helper").models;
const {logger} = require("fyrebrick-helper").helpers;
const {Inventory} = require("fyrebrick-helper").models;
const frontend = require('../../frontend/orderList');
const {getColorInlineStyle} = require('../../frontend/color');
const {getImageSrcFromItem} = require('../../frontend/image');
const { jsPDF } = require('jspdf');
const {font,font2,font3,font4,font5} = require('../../helpers/objects/font');
require("../../../public/other/f1");
require("../../../public/other/f2");
require("../../../public/other/f3");
require("../../../public/other/f4");
const fs = require('fs');
const http = require('http');
const {v4:uuidv4} = require("uuid");
const fetch = require('node-fetch');
const printer = require("pdf-to-printer");
const countryTelData = require('country-telephone-data')
const pixelWidth = require('string-pixel-width');

const orders = {
    index: async (req,res,next) => {
        const orders = await Order.find({$and: [{consumer_key:req.session.user.CONSUMER_KEY},{$or:[{status:"PENDING"},{status:"UPDATED"},{status:"PROCESSING"},{status:"READY"},{status:"PAID"},{status:"PACKED"}]}]});
        res.render('orderList',{
            orders:orders,
            fn:frontend
        });
    },
    print:{
        barcode:async (req,res,next)=>{
            // image (176×87) to printer 192.168.1.64:9100
            const doc = new jsPDF({
                orientation: "landscape",
                unit:"px",
                format:[49*2.275862069,49.0]
            });
            const path = `./public/temp/${uuidv4()}.gif`;
            const url = "http://www.keepautomation.com/online_barcode_generator/linear.aspx?TYPE=7&DATA="+req.query.order_id+"&PROCESS-TILDE=false&UOM=0&X=2&Y=60&ROTATE=0&RESOLUTION=72&FORMAT=gif&LEFT-MARGIN=0&RIGHT-MARGIN=0&SHOW-TEXT=true&TEXT-FONT=Arial%7C15%7CRegular";
            const response = await fetch(url);
            const buffer = await response.buffer();
            await fs.writeFile(path, buffer, () => {
                console.log('finished downloading!');
                const imageAsBase64 = fs.readFileSync(path, 'base64');
                doc.addImage(imageAsBase64,0,0);
                const pdf = `./public/temp/${uuidv4()}.pdf`
                doc.save(pdf);
                res.contentType("application/pdf");
                printer
                    .print(pdf,{
                        printer: "test05"
                      })
                    .then(console.log)
                    .catch(console.error);
                res.send(fs.readFileSync(pdf));
            });
        },
        label: async(req,res,next) => {
            const doc = new jsPDF({
                format:"a4"
            });
            //doc.addFileToVFS('./public/other/FreeSerif (copy 1).ttf', font4);
            //doc.addFont('./public/other/FreeSerif (copy 1).ttf', "times-new-roman", "normal");
            doc.setFont("FreeSerif (copy 2)","normal");
            console.log(doc.getFontList());
            const pdf = `./public/temp/${uuidv4()}.pdf`
            const pdfgrid = Number(req.body.pdfgrid);
            const order_id = req.query.order_id;
            await renderLabel(doc,pdfgrid,order_id);
            doc.save(pdf);
            res.contentType("application/pdf");
            res.send(fs.readFileSync(pdf));
        },labels: async(req,res,next) => {
            const doc = new jsPDF({
                format:"a4"
            });            
            doc.setFont("FreeSerif (copy 2)","normal");
            const pathOfPdf =`temp/${uuidv4()}.pdf`;
            const pdf = `./public/${pathOfPdf}`;
            const list = JSON.parse(req.body.list);
            let currentIndex = 0;
            console.log(list);
            for (let index = 0; index < Math.floor(list.length/8); index++) {
                //for each full page of labels
                for(let i of [...Array(8).keys()]){
                    await renderLabel(doc, i+1,list[currentIndex]);
                    currentIndex++;
                };
                doc.addPage();
            }
            if((list.length%8)!==0){
                for(let i of [...Array(list.length%8).keys()]){
                    await renderLabel(doc, i+1,list[currentIndex]);
                    currentIndex++;
                };
            }
            doc.save(pdf);
            res.send('/'+pathOfPdf);
            
        }
    },
    all: async (req, res, next) => {
        const orders = await Order.find({consumer_key:req.session.user.CONSUMER_KEY});
        res.render('orderList',{
            orders:orders,
            fn:frontend
        });
    },
    order_id: async (req,res,next) => {
        const order = await Order.findOne({order_id:req.params.order_id});
        if(!order){
            logger.error(`Order id ${req.params.order_id} not found`);
            res.status(404).render('error',{
                status:'404 Not found',
                message:'we could not find this order id'
            });
            return;
        }
        const stock = {};
        let totalItems = 0;
        let itemProcessed = 0;
        order.items.forEach((batch)=>{
            totalItems+=batch.length;
        });
        if(totalItems===0){
            res.status(404).render('error',{
                status:'404 Not found',
                message:'This order has no items'
            });
        }
        //logger.debug(`iterating ${totalItems} items in order ${order.order_id}`);
        order.items.forEach(batch=>{
            batch.forEach(async item=>{
                const inventory = await Inventory.findOne({CONSUMER_KEY:req.session.user.CONSUMER_KEY, inventory_id:item.inventory_id});
                let qty = 0;
                if(inventory){
                    //logger.debug(`Current inventory id ${item.inventory_id} found, qty : ${inventory.quantity}`);
                    qty = inventory.quantity;
                }
                stock[item.inventory_id] = qty
                itemProcessed++;
                if(itemProcessed===totalItems){
                    render();
                }
            })
        })
        let package_icon = "";
        //TODO: HARD CODED - This should be as a settings option in the future !!
        switch(order?.shipping?.method){
            case "Bpost letter":
                package_icon = "fa-envelope"
                break;
            case "Bpost box":
            case "Parcel with tracking":
                package_icon = "fa-box"
            default:
                package_icon = "";
        }
        const render = ()=>{
            res.render('order',{
                order:order,
                stock:stock,
                fn:{
                    getColorInlineStyle,
                    getImageSrcFromItem,
                    orderifyRemarks:frontend.orderifyRemarks,
                    render_progress:frontend.render_progress
                },
                frontend:{
                    render_progress:frontend.render_progress,
                    order:order
                },
                package_icon:package_icon
            });
        }
    },
    put: async (req,res,next)=>{
        const item_id = req.body.inventory_id
        const order_id = req.params.order_id
        const order = await Order.findOne({consumer_key:req.session.user.CONSUMER_KEY,order_id:order_id})
        let value = {
            success:false,
            message:'No message was found'
        }
        if(!order){
            logger.error(`Order id ${order_id} was not found for user ${req.session.user.email}`);
            value.message='order id was not found';
            res.status(404).send(value);
            return;
        }
        order.items.forEach((batch)=>{
            batch.forEach(async(item)=>{
                if(item.inventory_id==item_id){
                    if(item.isChecked){
                        order.orders_checked--;
                    }else{
                        order.orders_checked++;
                    }
                    item.isChecked = !item.isChecked;
                    logger.info(`Setting item ${item.inventory_id} checked value to ${item.isChecked}`);
                    await Order.updateOne({consumer_key:req.session.user.CONSUMER_KEY,order_id:order_id},order,(err)=>{
                        if(err){
                            logger.error(`user ${req.session.user.email} tried updating checkbox of item ${item_id} in order ${order_id}`);
                            logger.error(`error message: ${err.message}`);
                            value.message = 'updating the item gave an error';
                            res.status(500).send(value);
                            return;
                        }else{
                            value.message = "item was successfully changed";
                            value.success = true;
                            value['order'] = order;
                            res.status(200).send(value);
                            return;
                        }
                    });
                }
            })
        })
    },
    removeDuplicates: async(req,res,next)=>{
        await superagent
            .post(`${process.env.FYREBRICK_UPDATER_API_URI}/orders/removeDuplicates`)
            .send({CONSUMER_KEY:req.session.user.CONSUMER_KEY})
            .set('accept','json')
            .end(async(err,result)=>{
                if(err){
                    res.status(500);
                    res.send({success:false});
                }else{
                    res.send({success:true});
                }
            });
    },
    tag:{
        deleteTag: async (req,res,next)=>{
            if(req.query.order_id && req.query.CONSUMER_KEY && req.query.id){
                try{
                    const order = await Order.findOne({order_id:req.query.order_id,consumer_key:req.query.CONSUMER_KEY});
                    let index = 0;
                    for(tag of order.tags){
                        if(tag.id===req.query.id){
                            order.tags.splice(index,1);
                            await Order.updateOne({_id:order._id},order,(err,data)=>{
                                if(err){
                                    res.status(500).send({success:false,body:data,err:err});
                                }else{
                                    res.send({success:true,body:order});
                                }
                            });
                            return;
                        }
                        if(order.tags.length === index+1){
                            res.status(404).send({success:true,body:undefined,err:"id cannot be found in order, this should be the id of the tag"});
                        }
                        index++;
                    }
                }catch(err){
                    res.status(500).send({success:false,body:undefined,err:err});
                }
            }else{
                const err = "query parameters invalid: "+((req.query.order_id)?"":"order_id, ")+((req.query.CONSUMER_KEY)?"":"CONSUMER_KEY, ")+((req.query.id)?"":"id ")+"not given";
                res.status(404).send({success:false,body:undefined,err:err});
            }
        },
        createTag: async (req, res, next)=>{
            if(req.query.order_id && req.query.CONSUMER_KEY && req.query.tag){
                try{
                    const order = await Order.findOne({order_id:req.query.order_id,consumer_key:req.query.CONSUMER_KEY});
                    if(order.tags.length===0){
                        order.tagCount = 0;
                    }
                    order.tags.push(JSON.parse(req.query.tag));
                    order.tagCount++;
                    await Order.updateOne({_id:order._id},order,(err,data)=>{
                        if(err){
                            res.status(500).send({success:false,body:data,err:err});
                            return;
                        }else{
                            res.send({success:true,body:order});
                            return;
                        }
                    });
                }catch(err){
                    res.status(500).send({success:false,body:undefined,err:err});
                }
            }else{
                const err = "query parameters invalid: "+((req.query.order_id)?"":"order_id, ")+((req.query.CONSUMER_KEY)?"":"CONSUMER_KEY, ")+((req.query.tag)?"":"tag ")+"not given";
                res.status(404).send({success:false,body:undefined,err:err});
            }
        },
        getTags: async (req,res,next)=>{
            if(req.query.order_id && req.query.CONSUMER_KEY){
                const order = await Order.findOne({order_id:req.query.order_id,consumer_key:req.query.CONSUMER_KEY});
                res.send({success:true,body:{
                    tags:order.tags,
                    tagCount:order.tagCount
                }});
            }else{
                const err = "query parameters invalid: "+((req.query.order_id)?"":"order_id, ")+((req.query.CONSUMER_KEY)?"":"CONSUMER_KEY ")+"not given";
                res.status(404).send({success:false,body:undefined,err:err});
            }
        }
    }
}


const renderLabel = async (doc,pdfgrid,order_id) => {
    let fontSizeBig = 24;
    const fontSizeSmall = 10;
    pdfgrid = Number(pdfgrid);
    const isOnFirstCol = pdfgrid%2===1;
    const row = Math.round(pdfgrid/2);
    console.log(order_id);
    const order = await Order.findOne({order_id:order_id});
    var rowpl = 0;
    let text;
    switch(row){
        case 1:
            rowpl = 15;
            break;
        case 2:
            rowpl = 90;
            break;
        case 3:
            rowpl = 160;
            break;
        case 4:
            rowpl = 240;
            break;
    }
    var colpl = (isOnFirstCol)?10:110;
    text = [
        ...order.shipping.address.name.full.split('\r\n'),
        ...order.shipping.address.full.split('\r\n'),
        countryTelData.allCountries[countryTelData.iso2Lookup[
            order.shipping.address.country_code.toLowerCase()==="uk"?"gb":order.shipping.address.country_code.toLowerCase()
        ]].name];
    for(t of text){
        while(pixelWidth(t,{size:fontSizeBig})>=270){
            console.log(pixelWidth(t,{size:fontSizeBig}),t,fontSizeBig);
            fontSizeBig = fontSizeBig-0.5;            
        }
    }
    doc.setFontSize(fontSizeBig);
    let lines = 0;
    for(t of text){
        doc.text(t,colpl,rowpl+lines);
        lines += 10;
    }
    doc.setFontSize(fontSizeSmall);
    doc.text(order.order_id,isOnFirstCol?5:207,rowpl+25,null,90);
}


module.exports = orders;