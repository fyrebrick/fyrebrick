const { dir } = require('console');
const fs = require('fs');
const model = require('fyrebrick-helper').models;
const p = require('path');
const archiver = require('archiver');
const rimraf = require("rimraf");

const gdpr = {
    remove: async (req,res,next) => {
        await model.Inventory.deleteMany({CONSUMER_KEY:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023107'});
        }});
        await model.Order.deleteMany({consumer_key:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023108'});
        }});
        await model.User.deleteOne({CONSUMER_KEY:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023109'});
        }});
        req.session = undefined;
        res.redirect('/');
    },
    download: async (req,res,next) => {
        /*session.user= email */
        if(!req.session.user.CONSUMER_KEY || !req.session.email){
            res.status(404);
            res.render('error', {status:404,message:"User not found.",extra:"Error G81023828"});
            return;
        }
        //1. create folder of user
        const directory = './temp/'+req.session.email;
        const path = p.join(p.resolve(),directory);
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        //2. find all relevant documents
        const inventory = await model.Inventory.find({CONSUMER_KEY:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023827'});
        }});
        const orders = await model.Order.find({consumer_key:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023826'});
        }});
        const user = await model.User.find({CONSUMER_KEY:req.session.user.CONSUMER_KEY},(err)=>{if (err) {
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023825'});
        }});

        //3. create files in temp
        //4. store all documents found inside the files
        await fs.appendFile(`./temp/${req.session.email}/inventory.json`, JSON.stringify(inventory, null, 2), function (err) {
            if (err) {
                res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023829'});
            }
          });
        await fs.appendFile(`./temp/${req.session.email}/orders.json`, JSON.stringify(orders, null, 2), function (err) {
            if (err) {
                res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023831'});
            }
        });
        await fs.appendFile(`./temp/${req.session.email}/user.json`, JSON.stringify(user, null, 2), function (err) {
            if (err) {
                res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023832'});
            }
        });
        //5. create a zip file from those written files
        var output = await fs.createWriteStream(`./temp/${req.session.email}-GDPR.zip`);
        var archive = await archiver('zip');

        output.on('close', function (err) {
            if(err){
                res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023833'});
            }else{
                res.setHeader("Content-Transfer-Encoding","binary");
                res.setHeader('Content-type','application/octet-stream');
                res.download(`./temp/${req.session.email}-GDPR.zip`);
            }
        });
        archive.on('error', function(err){
            res.status(500).render('error',{status:500,message:"Something went wrong with the request",extra:'Error G81023834'});
        });
        await archive.pipe(output);
        // append files from a sub-directory, putting its contents at the root of archive
        await archive.directory(path, false);
        await archive.finalize();
        //6. give the user back the zip file to download
        
        //7. delete the folder and everything with it
        rimraf(path, function (err) { 
            console.trace(err);
        });
    }
}

module.exports = gdpr;

// http://localhost:3000/my/gdpr/download?CUSTOMER_KEY=&email=kareldesmet97@gmail.com