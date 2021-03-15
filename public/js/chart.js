$(document).ready(function(){

    gatherdata();

    function gatherdata (time="daily",use="n4totalLots",label="chart") {
        $.ajax({
            type:"GET",
            url:`/my/charts/main?use=${use}&time=${time}`,
            beforeSend:startLoading(),
            complete:stopLoading(),
            success:function(data){
                data = JSON.parse(data);
                renderChart(data,use,label,time);
            }
        })
    }


    function renderChart(data,use,label,timeRange="daily"){
        console.log(data,label,timeRange);
        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        //1. Sort the data by date
        const sortedData = data.sort(
            (a,b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
        console.log('//1')
        console.log(sortedData);
        //2. find first day of data table
        let currentTimeframe,currentLabelUsage;
        if(timeRange==="daily"){
            currentTimeframe = new Date(sortedData[0].timestamp).getDay();
            currentLabelUsage=DAYS;
        }else if(timeRange==="monthly"){
            currentTimeframe = new Date(sortedData[0].timestamp).getMonth();
            currentLabelUsage=MONTHS;
        }
        console.log('//2')
        console.log(currentLabelUsage,currentTimeframe);
        //3. create custom labels (e.g.: [Friday, saturday, sunday, monday, wednesday, thursday])
        let chartLabels = [];
        let keysForAmountProcessing = [];
        for (let i = currentTimeframe; i >= 0; i--) {
            console.log(i);
            chartLabels.unshift(currentLabelUsage[i]);
            keysForAmountProcessing.unshift(i);
        }
        for (let i = currentLabelUsage.length-1; i >= currentTimeframe+1; i--) {
            console.log(i);
            chartLabels.unshift(currentLabelUsage[i]);
            keysForAmountProcessing.unshift(i);
        }
        console.log('//3')
        console.log(chartLabels,keysForAmountProcessing);
        //4. Sort data by date in reverse
        const sortedDataReversed = data.sort(
            (a,b) => b.timestamp - a.timestamp
        )
        console.log('//4');
        console.log(sortedDataReversed);
        //5. Map the amount from the data 
        chartData = [];
        for(d of sortedData){
            chartData.unshift(d[use]);
        }
        console.log('//5');
        console.log(chartData);
        const config = {
            type: "line",
            data:{
                labels:chartLabels,
                datasets:[
                    {
                        label:label,
                        backgroundColor:"#ffa81c",
                        borderColor:"#ffa81c",
                        data:chartData,
                        fill: false
                    }
                ]
            },
            options: {
				responsive: true,
				title: {
					display: true,
					text: timeRange+' chart for '+use.slice(2)
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'timespan'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: use.slice(2)
						}
					}]
				}
            }
        }
        console.log(config);
        window.myLine = new Chart(document.getElementById('canvas').getContext('2d'), config);
    }   
});