// Le code n'est pas optimisé mais il marche :)

const readline = require("readline")
const axios = require("axios");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

let protocol;
let name;
let countryList = ["[ALL]", "[CN]", "[US]", "[DE]", "[IT]", "[BD]", "[VN]", "[TH]", "[JP]", "[FR]", "[KR]", "[CA]", "[GB]", "[IR]", "[ID]", "[IN]", "[UA]", "[RU]", "[PL]", "[HU]", "[EC]", "[HK]", "[CO]", "[AU]", "[BR]", "[PH]", "[AR]", "[NP]", "[TR]", "[MX]", "[KH]", "[IQ]", "[PK]", "[CZ]", "[ZA]", "[SG]", "[TW]", "[ES]"]

console.clear()

// PROTOCOL
return new Promise(resolve => rl.question("Quel type de proxy vous voulez ? [HTTPS], [SOCKS5], [SOCKS4]: ", resolve)).then(type => {
    console.clear()

    if(type == "https" || type == "HTTPS") {
        protocol = "http"
        name = "https-proxies"
    }

    else if(type == "socks5" || type == "SOCKS5") {
        protocol = "socks5"
        name = "socks5-proxies"
    }

    else if(type == "socks4" || type == "SOCKS4") {
        protocol = "socks4"
        name = "socks4-proxies"
    } else {
        return console.log("Protocole incorrecte !")
    }

    // TIMEOUT
    return new Promise(resolve => rl.question("Quel timeout vous voulez pour vos proxy ? (max: 10000): ", resolve)).then(timeout => {
        console.clear()

        if(isNaN(timeout) || timeout.startsWith("-")) {
            console.log("Le timeout n'est pas un nombre (Fermeture du scrapper dans 5 secondes...)")
            return setTimeout(() => {
                console.clear()
                process.kill(process.pid, 'SIGTERM')
            }, 5000);
        }

        if(timeout > 10000) timeout = 10000

        // COUNTRY
        return new Promise(resolve => rl.question(`Quel pays vous voulez pour vos proxy ?: ${countryList.join(", ")}: `, resolve)).then(country => {
            console.clear()

            if(countryList.includes(!country)) {
                console.log("Aucun proxys avec ce pays n'est disponible")
                return setTimeout(() => {
                    console.clear()
                    process.kill(process.pid, 'SIGTERM')
                }, 5000);
            }

            axios({
                url: `https://api.proxyscrape.com/v2/?request=getproxies&protocol=${protocol}&timeout=${timeout}&country=${country}&ssl=all&anonymity=all`,
                method: "GET"
            })
            .then(async body => {

                await fs.writeFile(`${name}.txt`, "", (err) => {
                    if (err) console.log(err)
                })
        
                fs.appendFile(`${name}.txt`, body.data, (err) => {
                    if (err) console.log(err)
                })

                console.log(`Vos ${body.data.split("\n").length-1} proxys sont téléchargés ! (Fermeture du scrapper dans 5 secondes...)`)
                setTimeout(() => {
                    console.clear()
                    process.kill(process.pid, 'SIGTERM')
                }, 5000);
            })
        })
    })
})