const prompt = require("prompt-sync")();

const plantSearch = prompt("Plant search: ");

const data = require('./body.js').replace("#PLACEHOLDER#", plantSearch);

const axios = require("axios").default;
const cheerio = require("cheerio");
const fs = require("fs");

const options = {
  method: 'POST',
  url: 'https://pfaf.org/user/plantsearch.aspx',
  headers: {
    cookie: 'ASP.NET_SessionId=vdnbevmqve2naaelonu0fijl',
    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001'
  },
  data: data
};

axios.request(options)
  .then(function (response) {
    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Find and extract the HTML content of the second table inside the tbody
    const tableRows = $('table#ContentPlaceHolder1_gvresults tbody tr');

    let headers = getHeaders($, tableRows[0]);
    let data = [];
    tableRows.each(function (index, element) {
      if (index == 0) return;
        let row = readRow($, element, headers);
        data.push(row);
    });

    // Output the JavaScript array
    console.log(data);

  });

function getHeaders($, row) {
    let headers = $(row).find('th').map(function(){ 
        return $(this).text().trim();
    }).get();
    headers.push('link');
    return headers;
}

function readRow($, row, headers) {
    let output = {}
    let elems = $(row).find('td');
    for (let i = 0 ; i < elems.length ; i++) {
        curHeader = headers[i];
        output[ curHeader ] = $(elems[i]).text().trim();
        $(elems[i]).find('a').each(function (index, element) {
            output[ 'link' ] = $(element).attr('href');
        });
        
    }
    return output;
}