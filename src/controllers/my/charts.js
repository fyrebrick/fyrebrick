const {Store, User} = require('fyrebrick-helper').models;

const charts = {
    main: async (req,res,next)=>{
        const user = await User.findOne({CONSUMER_KEY:req.session.user.CONSUMER_KEY});
        let store = await Store.findOne({username:user.userName});
        store = JSON.parse(JSON.stringify(store));
        const sortedData = store.store_chart.sort(
            (a,b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
        //console.log(sortedData);
        if(req.query.time==="daily"){
            let dateCursor = new Date();
            let arrayCursor = 0;
            let correctData = [];
            let stopLooping = false;
            while(correctData.length<7||stopLooping){
                //1. check if last array in sorted is same as cursor date
                console.log(dateCursor.toDateString(),new Date(sortedData[arrayCursor].timestamp).toDateString(),arrayCursor);
                if(dateCursor.toDateString()===new Date(sortedData[arrayCursor].timestamp).toDateString()){
                    console.log("correct")
                    //Is the same day adding to correctData
                    correctData.unshift(sortedData[arrayCursor]);
                    dateCursor.setDate(dateCursor.getDate() - 1 );
                }else if(arrayCursor+1===sortedData.length){
                    let checkDate = new Date();
                    checkDate.setDate(checkDate.getDate()-7);
                    if(dateCursor.getDate()===checkDate){
                        //past 1 week stopping loop.
                    }else{
                        console.log("uncorrect")
                        correctData.unshift({
                            timestamp:dateCursor,
                            n4totalLots:null,
                            n4totalItems:null,
                            n4totalViews:null
                        });
                    }

                    dateCursor.setDate(dateCursor.getDate() - 1 );
                    arrayCursor=0;
                    //couldnt find this date in the array so going to next date
                }
                arrayCursor++;
            }
            //sortedData.slice(sortedData.length-7
            console.log(correctData);
            res.send(JSON.stringify(correctData));
        }else{
            res.send(null);
        }
        
        
    }
}
module.exports = charts;