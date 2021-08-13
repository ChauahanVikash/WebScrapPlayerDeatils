let request = require('request');
let cheerio = require('cheerio');

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
    //let anchorblocks = mainpage(cardsArray).find("a");
    
    console.log(cardsArray.length);
}