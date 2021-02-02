const {Store} = require('fyrebrick-helper').models;
const _ = require('lodash');
module.exports = charts = {
    index:async(req,res,next)=>{
        res.render('charts',{allCountries},);
    },
    global:async(req,res,next)=>{
            const allStores = await Store.find();
            const items = (dataset) => _.orderBy(dataset, ['n4total'+req.params.type.substr(0,1).toUpperCase()+req.params.type.substr(1)],['desc']);
            let topGlobal = items(allStores);
            topGlobal = topGlobal.slice(0,1000);
            let html = "";
            topGlobal.forEach((store,index)=>{
                store = JSON.parse(JSON.stringify(store));
                html += "<tr>";
                    try{
                        let update = index-store.rank.global[req.params.type][0].rank;
                        if(update<0){
                            update = `<span>${store.rank.global[req.params.type][0].rank}</span><i class='fas fa-sort-down' style='color:#f71d1d;'>${update}</i>`;
                        }else if(update>0){
                            update = `<span>${store.rank.global[req.params.type][0].rank}</span><i class='fas fa-sort-up' style='color:#15c74c;'>${update}</i>`;
                        }else{
                            update = `<span>${store.rank.global[req.params.type][0].rank}</span><i class='fas fa-minus' style='color:#15c74c;'>${update}</i>`;
                        }
                        html += `<td>${update}</td>`;
                    }catch(e){
                        html += `<td><span>${index+1}</span> <i class='fas fa-minus' style='color:#15c74c;'></i></td>`;
                    }
                    html += `<td>${store['n4total'+req.params.type.substr(0,1).toUpperCase()+req.params.type.substr(1)].toLocaleString()}</td>`;
                    html += "<td>"+store.name+"</td>";
                    html += `<td><div class="flag"><img src="${allCountries[allCountryIDs.indexOf(store.countryID)].countryImg}"></div> <span>${allCountries[allCountryIDs.indexOf(store.countryID)].countryName}</span></td>`;
                html += "</tr>";
            });
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('charset','utf-8');
            res.send(html);
    },
    national:async(req,res,next)=>{
            const allStores = await Store.find({countryID:req.params.countryID});
            const items = (dataset) => _.orderBy(dataset, ['n4total'+req.params.type.substr(0,1).toUpperCase()+req.params.type.substr(1)],['desc']);
            let topNational = items(allStores);
            topNational = topNational.slice(0,1000);
            //tr td.rank td.data td.name td.country /tr
            let html = "";
            topNational.forEach((store,index)=>{
                store = JSON.parse(JSON.stringify(store));
                html += "<tr>";
                    try{
                        let update = index+1-store.rank.national[req.params.type][0].rank;
                        if(update<0){
                            update = `<span>${store.rank.national[req.params.type][0].rank}</span><i class='fas fa-sort-down' style='color:#f71d1d;'>${update}</i>`;
                        }else if(update>0){
                            update = `<span>${store.rank.national[req.params.type][0].rank}</span><i class='fas fa-sort-up' style='color:#15c74c;'>${update}</i>`;
                        }else{
                            update = `<span>${store.rank.national[req.params.type][0].rank}</span><i class='fas fa-minus' style='color:#15c74c;'></i>`;
                        }
                        html += `<td>${update}</td>`;
                    }catch(e){
                        html += `<td><span>${index+1}</span> <i class='fas fa-minus' style='color:#15c74c;'></i></td>`;
                    }
                    html += `<td>${store['n4total'+req.params.type.substr(0,1).toUpperCase()+req.params.type.substr(1)].toLocaleString()}</td>`;
                    html += `
                    <td id='${store._id}'>
                        ${store.name}
                        <script>
                            $(document).ready(function(){
                                try{
                                    $('#${store._id}').html('${store.name}');
                                }catch(e){
                                    
                                }
                            })
                        </script>
                    </td>`
                    html += `<td><div class="flag"><img src="${allCountries[allCountryIDs.indexOf(store.countryID)].countryImg}"> </div><span>${allCountries[allCountryIDs.indexOf(store.countryID)].countryName}</span></td>`;
                html += "</tr>";
            });
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('charset','utf-8');
            res.send(html);
    }
}
const allCountryIDs = ["AR","BR","CA","CL","CO","CR","SV","MX","PE","US","VE","AT","BY","BE","BG","HR","CZ","DK","EE","FO","FI","FR","DE","GI","GR","HU","IS","IE","IT","LV","LT","LU","MT","MD","MC","NL","NO","PL","PT","RO","RU","SM","RS","SK","SI","ES","SE","CH","UA","UK","UA","CN","HK","IN","ID","JP","KZ","MO","MY","NZ","PK","PH","SG","KR","TW","TH","VN","BH","CY","IL","LB","MA","OM","QA","ZA","IR","AE"];
const allCountries = [{
    countryID: "AR",
    countryName: "Argentina",
    countryImg: "https://www.bricklink.com/images/flagsM/AR.gif"
}, {
    countryID: "BR",
    countryName: "Brazil",
    countryImg: "https://www.bricklink.com/images/flagsM/BR.gif"
}, {
    countryID: "CA",
    countryName: "Canada",
    countryImg: "https://www.bricklink.com/images/flagsM/CA.gif"
}, {
    countryID: "CL",
    countryName: "Chile",
    countryImg: "https://www.bricklink.com/images/flagsM/CL.gif"
}, {
    countryID: "CO",
    countryName: "Colombia",
    countryImg: "https://www.bricklink.com/images/flagsM/CO.gif"
}, {
    countryID: "CR",
    countryName: "Costa Rica",
    countryImg: "https://www.bricklink.com/images/flagsM/CR.gif"
}, {
    countryID: "SV",
    countryName: "El Salvador",
    countryImg: "https://www.bricklink.com/images/flagsM/SV.gif"
}, {
    countryID: "MX",
    countryName: "Mexico",
    countryImg: "https://www.bricklink.com/images/flagsM/MX.gif"
}, {
    countryID: "PE",
    countryName: "Peru",
    countryImg: "https://www.bricklink.com/images/flagsM/PE.gif"
}, {
    countryID: "US",
    countryName: "USA",
    countryImg: "https://www.bricklink.com/images/flagsM/US.gif"
}, {
    countryID: "VE",
    countryName: "Venezuela",
    countryImg: "https://www.bricklink.com/images/flagsM/VE.gif"
}, {
    countryID: "AT",
    countryName: "Austria",
    countryImg: "https://www.bricklink.com/images/flagsM/AT.gif"
}, {
    countryID: "BY",
    countryName: "Belarus",
    countryImg: "https://www.bricklink.com/images/flagsM/BY.gif"
}, {
    countryID: "BE",
    countryName: "Belgium",
    countryImg: "https://www.bricklink.com/images/flagsM/BE.gif"
}, {
    countryID: "BG",
    countryName: "Bulgaria",
    countryImg: "https://www.bricklink.com/images/flagsM/BG.gif"
}, {
    countryID: "HR",
    countryName: "Croatia",
    countryImg: "https://www.bricklink.com/images/flagsM/HR.gif"
}, {
    countryID: "CZ",
    countryName: "Czech Republic",
    countryImg: "https://www.bricklink.com/images/flagsM/CZ.gif"
}, {
    countryID: "DK",
    countryName: "Denmark",
    countryImg: "https://www.bricklink.com/images/flagsM/DK.gif"
}, {
    countryID: "EE",
    countryName: "Estonia",
    countryImg: "https://www.bricklink.com/images/flagsM/EE.gif"
}, {
    countryID: "FO",
    countryName: "Faroe Islands",
    countryImg: "https://www.bricklink.com/images/flagsM/FO.gif"
}, {
    countryID: "FI",
    countryName: "Finland",
    countryImg: "https://www.bricklink.com/images/flagsM/FI.gif"
}, {
    countryID: "FR",
    countryName: "France",
    countryImg: "https://www.bricklink.com/images/flagsM/FR.gif"
}, {
    countryID: "DE",
    countryName: "Germany",
    countryImg: "https://www.bricklink.com/images/flagsM/DE.gif"
}, {
    countryID: "GI",
    countryName: "Gibraltar",
    countryImg: "https://www.bricklink.com/images/flagsM/GI.gif"
}, {
    countryID: "GR",
    countryName: "Greece",
    countryImg: "https://www.bricklink.com/images/flagsM/GR.gif"
}, {
    countryID: "HU",
    countryName: "Hungary",
    countryImg: "https://www.bricklink.com/images/flagsM/HU.gif"
}, {
    countryID: "IS",
    countryName: "Iceland",
    countryImg: "https://www.bricklink.com/images/flagsM/IS.gif"
}, {
    countryID: "IE",
    countryName: "Ireland",
    countryImg: "https://www.bricklink.com/images/flagsM/IE.gif"
}, {
    countryID: "IT",
    countryName: "Italy",
    countryImg: "https://www.bricklink.com/images/flagsM/IT.gif"
}, {
    countryID: "LV",
    countryName: "Latvia",
    countryImg: "https://www.bricklink.com/images/flagsM/LV.gif"
}, {
    countryID: "LT",
    countryName: "Lithuania",
    countryImg: "https://www.bricklink.com/images/flagsM/LT.gif"
}, {
    countryID: "LU",
    countryName: "Luxembourg",
    countryImg: "https://www.bricklink.com/images/flagsM/LU.gif"
}, {
    countryID: "MT",
    countryName: "Malta",
    countryImg: "https://www.bricklink.com/images/flagsM/MT.gif"
}, {
    countryID: "MD",
    countryName: "Moldova",
    countryImg: "https://www.bricklink.com/images/flagsM/MD.gif"
}, {
    countryID: "MC",
    countryName: "Monaco",
    countryImg: "https://www.bricklink.com/images/flagsM/MC.gif"
}, {
    countryID: "NL",
    countryName: "Netherlands",
    countryImg: "https://www.bricklink.com/images/flagsM/NL.gif"
}, {
    countryID: "NO",
    countryName: "Norway",
    countryImg: "https://www.bricklink.com/images/flagsM/NO.gif"
}, {
    countryID: "PL",
    countryName: "Poland",
    countryImg: "https://www.bricklink.com/images/flagsM/PL.gif"
}, {
    countryID: "PT",
    countryName: "Portugal",
    countryImg: "https://www.bricklink.com/images/flagsM/PT.gif"
}, {
    countryID: "RO",
    countryName: "Romania",
    countryImg: "https://www.bricklink.com/images/flagsM/RO.gif"
}, {
    countryID: "RU",
    countryName: "Russia",
    countryImg: "https://www.bricklink.com/images/flagsM/RU.gif"
}, {
    countryID: "SM",
    countryName: "San Marino",
    countryImg: "https://www.bricklink.com/images/flagsM/SM.gif"
}, {
    countryID: "RS",
    countryName: "Servia",
    countryImg: "https://www.bricklink.com/images/flagsM/RS.gif"
}, {
    countryID: "SK",
    countryName: "Slovakia",
    countryImg: "https://www.bricklink.com/images/flagsM/SK.gif"
}, {
    countryID: "SI",
    countryName: "Slovenia",
    countryImg: "https://www.bricklink.com/images/flagsM/SI.gif"
}, {
    countryID: "ES",
    countryName: "Spain",
    countryImg: "https://www.bricklink.com/images/flagsM/ES.gif"
}, {
    countryID: "SE",
    countryName: "Sweden",
    countryImg: "https://www.bricklink.com/images/flagsM/SE.gif"
}, {
    countryID: "CH",
    countryName: "Switzerland",
    countryImg: "https://www.bricklink.com/images/flagsM/CH.gif"
}, {
    countryID: "UA",
    countryName: "Ukraine",
    countryImg: "https://www.bricklink.com/images/flagsM/UA.gif"
}, {
    countryID: "UK",
    countryName: "United Kingdom",
    countryImg: "https://www.bricklink.com/images/flagsM/UK.gif"
}, {
    countryID: "UA",
    countryName: "Australia",
    countryImg: "https://www.bricklink.com/images/flagsM/UA.gif"
}, {
    countryID: "CN",
    countryName: "China",
    countryImg: "https://www.bricklink.com/images/flagsM/CN.gif"
}, {
    countryID: "HK",
    countryName: "Hong Kong",
    countryImg: "https://www.bricklink.com/images/flagsM/HK.gif"
}, {
    countryID: "IN",
    countryName: "India",
    countryImg: "https://www.bricklink.com/images/flagsM/IN.gif"
}, {
    countryID: "ID",
    countryName: "Indonesia",
    countryImg: "https://www.bricklink.com/images/flagsM/ID.gif"
}, {
    countryID: "JP",
    countryName: "Japan",
    countryImg: "https://www.bricklink.com/images/flagsM/JP.gif"
}, {
    countryID: "KZ",
    countryName: "Kazakhstan",
    countryImg: "https://www.bricklink.com/images/flagsM/KZ.gif"
}, {
    countryID: "MO",
    countryName: "Macau",
    countryImg: "https://www.bricklink.com/images/flagsM/MO.gif"
}, {
    countryID: "MY",
    countryName: "Malaysia",
    countryImg: "https://www.bricklink.com/images/flagsM/MY.gif"
}, {
    countryID: "NZ",
    countryName: "New Zealand",
    countryImg: "https://www.bricklink.com/images/flagsM/NZ.gif"
}, {
    countryID: "PK",
    countryName: "Pakistan",
    countryImg: "https://www.bricklink.com/images/flagsM/PK.gif"
}, {
    countryID: "PH",
    countryName: "Philippines",
    countryImg: "https://www.bricklink.com/images/flagsM/PH.gif"
}, {
    countryID: "SG",
    countryName: "Singapore",
    countryImg: "https://www.bricklink.com/images/flagsM/SG.gif"
}, {
    countryID: "KR",
    countryName: "South Korea",
    countryImg: "https://www.bricklink.com/images/flagsM/KR.gif"
}, {
    countryID: "TW",
    countryName: "Taiwan",
    countryImg: "https://www.bricklink.com/images/flagsM/TW.gif"
}, {
    countryID: "TH",
    countryName: "Thailand",
    countryImg: "https://www.bricklink.com/images/flagsM/TH.gif"
}, {
    countryID: "VN",
    countryName: "Vietnam",
    countryImg: "https://www.bricklink.com/images/flagsM/VN.gif"
}, {
    countryID: "BH",
    countryName: "Bahrain",
    countryImg: "https://www.bricklink.com/images/flagsM/BH.gif"
}, {
    countryID: "CY",
    countryName: "Cyprus",
    countryImg: "https://www.bricklink.com/images/flagsM/CY.gif"
}, {
    countryID: "IL",
    countryName: "Isreal",
    countryImg: "https://www.bricklink.com/images/flagsM/IL.gif"
}, {
    countryID: "LB",
    countryName: "Lebanon",
    countryImg: "https://www.bricklink.com/images/flagsM/LB.gif"
}, {
    countryID: "MA",
    countryName: "Morocco",
    countryImg: "https://www.bricklink.com/images/flagsM/MA.gif"
}, {
    countryID: "OM",
    countryName: "Oman",
    countryImg: "https://www.bricklink.com/images/flagsM/OM.gif"
}, {
    countryID: "QA",
    countryName: "Qatar",
    countryImg: "https://www.bricklink.com/images/flagsM/QA.gif"
}, {
    countryID: "ZA",
    countryName: "South Africa",
    countryImg: "https://www.bricklink.com/images/flagsM/ZA.gif"
}, {
    countryID: "IR",
    countryName: "Turkey",
    countryImg: "https://www.bricklink.com/images/flagsM/IR.gif"
}, {
    countryID: "AE",
    countryName: "United Arab Emirates",
    countryImg: "https://www.bricklink.com/images/flagsM/AE.gif"
}];