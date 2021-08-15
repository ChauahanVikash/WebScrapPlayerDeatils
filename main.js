let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let path = require('path');
let jsonput = require("./jsonPlayer");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";


request(url , getData);

function getData(err , res , html){
    if(err){
        console.log(err);
    }else if(res.statusCode == 404){
        console.log('Page not Found');
    }
    else{
        dataExtract(html);
    }
}

function dataExtract(html){
    let datamine = cheerio.load(html);

    let data = datamine(".widget-items.cta-link");
    //let anchortag = data.find("a")
    let anchortag = datamine(data).find("a");

    let comp_url = "https://www.espncricinfo.com" + anchortag.attr("href");
    request(comp_url , allscores);
}

function allscores(err , res , html){
    if(err){
        console.log(err);
    }else if(res.statusCode == 404){
        console.log('Page not Found');
    }
    else{
        getScores(html);
    }
}

function getScores(html){
    let mainpage = cheerio.load(html);
    let cardsArray = mainpage(".match-cta-container");
    //console.log(cardsArray.length);
    //let anchorblocks = mainpage(cardsArray).find("a")
    for(let i = 0 ; i < cardsArray.length ; ++i){
        let atags = mainpage(cardsArray[i]).find("a");
        let scoreurl = mainpage(atags[2]).attr("href");
        let comp_scoreurl = "https://www.espncricinfo.com" + scoreurl ;
        request(comp_scoreurl , getPlayerdata);
        //console.log(scoreurl);
        //console.log(atags.length);
    }
    //console.log(cardsArray.length);
}
function getPlayerdata(err , res , html){
    if(err){
        console.log(err);
    }else if(res.statusCode == 404){
        console.log('Page not Found');
    }
    else{
        getStats(html);
    }
}

function getStats(html){
    let matchpage = cheerio.load(html);
    let teams = matchpage(".event .team");
    let ptags = matchpage(teams).find("p");
    let tables = matchpage(".table.batsman");
    let dir  = process.cwd(); 
    let iplfolderpath = path.join(dir , "ipl");
    if(fs.existsSync(iplfolderpath) == false){
        fs.mkdirSync(iplfolderpath);
    }
    // let name = matchpage(tables));
    // console.log(matchpage(ptags[0]).text());
    // console.log(name);
    for(let i = 0 ; i < ptags.length ; ++i){
        let teamname = matchpage(ptags[i]).text().trim();
        let opind = 0 ;
        if(i == 0){
            opind = 1 ;
        }
        let opponentname = matchpage(ptags[opind]).text().trim();
        let metadataArr = matchpage(".event .description").text().split(',');
        let venue = metadataArr[1].trim();
        let date = metadataArr[2].trim();
        //console.log(metadata);

        let teampath = path.join(iplfolderpath , teamname);
        if(fs.existsSync(teampath) == false){
            fs.mkdirSync(teampath);
        }
        let playerrow = matchpage(tables[i]).find("tbody tr");
        for(let j = 0 ; j <  playerrow.length - 1; ++j){
            let searchtool = matchpage(playerrow[j]).find("td");
            let playername = matchpage(searchtool[0]).text().trim();
            if(playername == ""){
                continue;
            }

            let runs = matchpage(searchtool[2]).text().trim();
            let balls = matchpage(searchtool[3]).text().trim();
            let fours = matchpage(searchtool[5]).text().trim();
            let sixes = matchpage(searchtool[6]).text().trim();
            let sr = matchpage(searchtool[7]).text();
            //console.log(playername +" | "+ venue +" | "+ date +" | "+runs +" | "+ balls+" | "+fours +" | "+sixes+" | "+sr);

            jsonput.playerdetails(teampath ,playername , opponentname, venue , date , runs , balls , fours , sixes , sr);
        }
        
        // console.log(matchpage(playerrow[0]).text());
        // console.log(matchpage(playerrow[1]).text());
        // console.log(matchpage(playerrow[2]).text());
        // console.log(matchpage(playerrow[3]).text());
        // console.log(matchpage(playerrow[4]).text());
        // console.log(matchpage(playerrow[5]).text());
        // console.log(matchpage(playerrow[6]).text());
        // console.log(matchpage(playerrow[7]).text());
        //console.log(venue , date , opponentname);
        console.log("'''''''''''''''''''''''''''''''''''''''''''''''''");

    }
    //console.log(tables.length); 
}