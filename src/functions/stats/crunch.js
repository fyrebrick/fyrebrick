let other = require('./other');

exports.common_brick_colours = (_data,top,hours,skips=0) => {
    let olddata = _data;
    let sortedData = [];
    top = Number(top);
    hours = Number(hours);
    //sorting
    olddata.forEach((a) => {
        sortedData.push(a.sort((a, b) => (a.quantity > b.quantity) ? 1 : -1));
    });


    //limit allData for amount of given hours to view
    let limitedArray = sortedData.slice(sortedData.length-hours);

    // pushing all data with same colour_name
    let allData = [];
    limitedArray.forEach((d) => {
        d.forEach((_d) => {
            let foundCurrentDataColour = false;
            allData.forEach((a, index) => {
                if (a.label === _d.color_name) {
                    foundCurrentDataColour = true;
                    allData[index].data.push(_d.quantity);
                }
            })
            if (!foundCurrentDataColour) {
                allData.push({
                    label: _d.color_name,
                    fill: false,
                    borderColor: other.getColorCode(_d.color_name),
                    data: [_d.quantity]
                })
            }
        });
    });
    //creating array with stringDates as label for chart
    let i = (hours>olddata.length)?olddata.length:hours;
    let array = new Array(i);
    for (i ; i > 0; i--) {
        let date = new Date;
        date.setMinutes(0);
        date.setHours(date.getHours() - (i - 1));
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        let stringDate = date.toLocaleDateString('en-UK', options) + " " + date.toLocaleTimeString('nl-BE', {
            hour: '2-digit',
            minute: '2-digit'
        });
        array[array.length - i] = stringDate;
    }

    //top x chosen
    return {
        labels: array,
        datasets: allData.splice(allData.length-top)
    };
}