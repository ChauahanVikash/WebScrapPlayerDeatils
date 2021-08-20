let xlsx = require("xlsx")

function excelreader(filepath , sheetname){
    let wb = xlsx.readFile(filepath);
    let exceldata = wb.Sheets[sheetname];
    let json_conv_data = xlsx.utils.sheet_to_json(exceldata);
    return json_conv_data;
}

function excelWriter(filepath ,jsondata, sheetname){
    let wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(jsondata);
    xlsx.utils.book_append_sheet(wb , ws , sheetname);
    xlsx.writeFile(wb , filepath);
}

module.exports = {
    excelWriter : excelWriter ,
    excelreader : excelreader
}