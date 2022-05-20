import { count } from 'console';
import fs, { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { json } from 'node:stream/consumers';

//let rawdata = fs.readFileSync('ikeasDeFranceWithPos.json');
//let ikeas = JSON.parse(rawdata);
//console.log(ikeas);

//rawdata = fs.readFileSync('ikeaFormatted.json');
//let ikeaData = JSON.parse(rawdata);
//console.log(ikeaData);
let output = []
let startTime = new Date().toISOString()


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


let countries = [
    "fr",
    "de",
    "gb",
    "es",
    "ch",
    "it",
    "ie",
    "be",
    "at",
    "cz",
    "us",
    "se",
    "pl",
    "sk",
    "si",
    "hu",
    "hr",
    "dk"
]
countries.forEach(country => {
    
    if(country != "end") {
    let rawdata = fs.readFileSync(`ikea${country}.json`);
    let ikeas = JSON.parse(rawdata);
    
    let url = `https://api.ingka.ikea.com/cia/availabilities/ru/${country}?itemNos=30373588&expand=StoresList,Restocks,SalesLocations`

    if(country == "us") {
        url = `https://api.ingka.ikea.com/cia/availabilities/ru/us?itemNos=90373590&expand=StoresList,Restocks,SalesLocations`
    }

    fetch(url, {
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
    //    element.body.json()
        element.availabilities.forEach((element, index) => {
            let ikeaCode = element.classUnitKey.classUnitCode
            //console.log(`${country}: ${ikeaCode} - ${index}`)
            if(/[0-9]{3}/.test(ikeaCode) && ikeaCode != "653" && ikeaCode != "622" && ikeaCode != "921" && ikeaCode != "658") {
                
                let obj = ikeas.find(o => o.value === ikeaCode);
                //console.log(`IKEA ${ikeaCode}: ${obj.name} - ${element.availableForCashCarry ? element.buyingOption.cashCarry.availability.quantity : 0}`)
                    if(obj != undefined) {
                    console.log(obj)
                    let objectToReturn = {
                        "name": obj.name,
                        "address": obj.storeAddress.displayAddress,
                        "position": [obj.storeAddress.position.latitude, obj.storeAddress.position.longitude],
                        "quantity": element.availableForCashCarry ? element.buyingOption.cashCarry.availability.quantity : 0
                    }
                    output.push(objectToReturn)
                }
            }
        })
    })
    } else {
    }
})

await sleep(1000)
let toWrite = {
    "data": output,
    "time": startTime,
}
console.log(JSON.stringify(toWrite))
writeFileSync('blahaj.json', JSON.stringify(toWrite))