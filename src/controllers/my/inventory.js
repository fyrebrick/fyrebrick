

const inventory = {
    index:{
        get:(req,res,next)=>{
            res.render('inventory/inventory');
        }
    },
    add:{
        get:(req,res,next)=>{
            res.render('inventory/add');
        }
    },
    search:{
        get:(req,res,next)=>{
            res.render('inventory/search');
        },
        post:(req,res,next)=>{

        }
    },  
    investigate:{
        get:(req,res,next)=>{
            res.render('inventory/investigate');
        }
    }
}

module.exports.inventory = inventory;