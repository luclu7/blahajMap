import fs from 'fs';
import fetch from 'node-fetch';
import { json } from 'node:stream/consumers';

let rawdata = fs.readFileSync('ikeasDeFranceWithPos.json');
let ikeas = JSON.parse(rawdata);
//console.log(ikeas);

//rawdata = fs.readFileSync('ikeaFormatted.json');
//let ikeaData = JSON.parse(rawdata);
//console.log(ikeaData);

fetch("https://api.ingka.ikea.com/cia/availabilities/ru/fr?itemNos=30373588&expand=StoresList,Restocks,SalesLocations", {
    "credentials": "omit",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0",
        "Accept": "application/json;version=2",
        "Accept-Language": "fr,en-US;q=0.7,en;q=0.3",
        "X-Client-ID": "b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site"
    },
    "referrer": "https://www.ikea.com/",
    "method": "GET",
    "mode": "cors"
}).then(res => res.json())
.then(element => {
    let output = []
//    element.body.json()
    element.availabilities.forEach(element => {
        let ikeaCode = element.classUnitKey.classUnitCode
        if(/[0-9]{3}/.test(ikeaCode)) {
            
            let obj = ikeas.find(o => o.value === ikeaCode);
            //console.log(`IKEA ${ikeaCode}: ${obj.name} - ${element.availableForCashCarry ? element.buyingOption.cashCarry.availability.quantity : 0}`)
            let objectToReturn = {
                "name": obj.name,
                "address": obj.storeAddress.displayAddress,
                "position": [obj.storeAddress.position.latitude, obj.storeAddress.position.longitude],
                "quantity": element.availableForCashCarry ? element.buyingOption.cashCarry.availability.quantity : 0
            }
            output.push(objectToReturn)
        }
    })
    
    console.log(JSON.stringify(output))
    fs.writeFileSync('blahaj.json', JSON.stringify(output));
})



