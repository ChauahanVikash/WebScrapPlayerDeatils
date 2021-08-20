let fs = require("fs");
let path = require("path");
let excelRnW = require("./excelRnW")

function playerdetails(teampath ,playername , opponentname, venue , date , runs , balls , fours , sixes , sr){

    let playerobj = {
        "playername" : playername ,
        "opponentname" : opponentname ,
        "venue" : venue ,
        "date" : date ,
        "runs" : runs ,
        "balls" : balls , 
        "fours" : fours , 
        "sixes" : sixes , 
        "sr" : sr 
    }
    let playerfilepath = path.join(teampath , playername + ".xlsx");
    console.log(playerfilepath);
    if(fs.existsSync(playerfilepath) == false ){
        arr = [playerobj];
        excelRnW.excelWriter(playerfilepath , arr , playername);
        //for json read write
        //fs.writeFileSync( playerfilepath , JSON.stringify(arr) )
    }
    else{
        let jsondata = excelRnW.excelreader(playerfilepath , playername);
        jsondata.push(playerobj);
        excelRnW.excelWriter(playerfilepath , jsondata , playername);

        // let content =  fs.readFileSync(playerfilepath);
        // let data = JSON.parse(content);
        // data.push(playerobj);
        // fs.writeFileSync( playerfilepath, JSON.stringify(data));
    }
}

module.exports = {
    playerdetails : playerdetails
}