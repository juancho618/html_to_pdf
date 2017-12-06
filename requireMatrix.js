const http = require('http');
const fs = require('fs.extra');


const options = {
    hostname: 'SRV-ELO01',
    port: 9090,
    path: '/ix-CDC/ix?cmd=readdoc1&encrobjid=%23%23AES%23%23rdZcnKYNAgWNKCb7dUo0m8t9Sj4ntOJMOOlehjooqlm41HuKrpkgRAc0BndF5RRapa2g%2Bsd%2FX6CiUQeherIedZgucGak4dfPAMd31UbYDR8%3D&acode=attachment&fname=trucks+contracts+matrix++mail+merge+source++current.xlsm',
    method: 'GET',
    headers:{
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
}

const req = http.request(options, (res) =>{
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('base64');
    let data='';
    res.on('data', (chunk) => {
        data+=chunk;
        //console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log(data);
        fs.writeFileSync('data2.xlsm', data, 'base64');
        console.log('No more data in response.');
      });

});

req.end();

