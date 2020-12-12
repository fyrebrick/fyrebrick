const logger = require("../configuration/logger");

module.exports.getImageSrcFromItem = (data) => {
    let src;
    //https://img.bricklink.com/ItemImage/SN/0/621-1.png
    switch (data.item.type) {
        case 'SET':
            src="https://img.bricklink.com/ItemImage/SN/" + data.color_id + "/" + data.item.no + ".png";
            break;
        case "MINIFIG":
            src = "https://img.bricklink.com/ItemImage/MN/"+data.color_id+"/"+data.item.no+".png";
            break;
        case "PART":
            src = "https://img.bricklink.com/ItemImage/PN/"+data.color_id+"/"+data.item.no+".png";
            break;
        case 'INSTRUCTION':
            src= "https://img.bricklink.com/ItemImage/IN/" + data.color_id + "/" + data.item.no + ".png";
            break;
        case 'BOOK':
            src= "https://img.bricklink.com/ItemImage/BN/" + data.color_id + "/" + data.item.no + ".png";
            break;
        case 'GEAR':
            src="https://img.bricklink.com/ItemImage/GN/" + data.color_id + "/" + data.item.no + ".png";
            break;
        case 'CATALOG':
            src = "https://img.bricklink.com/ItemImage/CN/" + data.color_id + "/" + data.item.no + ".png";
            break;
        default:
            return null;
    }
    return src
}