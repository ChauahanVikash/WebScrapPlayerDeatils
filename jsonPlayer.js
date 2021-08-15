let fs = require("fs");
let path = require("path");

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
    let playerfilepath = path.join(teampath , playername + ".json");
    console.log(playerfilepath);
    if(fs.existsSync(playerfilepath) == false ){
        arr = [playerobj];
        fs.writeFileSync( playerfilepath , JSON.stringify(arr) )
    }
    else{
        let content =  fs.readFileSync(playerfilepath);
        let data = JSON.parse(content);
        data.push(playerobj);
        fs.writeFileSync( playerfilepath, JSON.stringify(data));
    }
}

module.exports = {
    playerdetails : playerdetails
}