var https = require('https');
// var cheerio = require('cheerio');

https.get('https://be.finlean.com/fc_tool/#/', function (req, res) {
    var result = '';
    req.on('data', function (data) {
        result += data;
    });
    req.on('end', function () {
        console.info(result);
        // parseHtml(result);
    });
});

const options = {
    hostname: 'be.finleancloud.com',  // 如果被https 对象调用默认就是https 且端口默认为 443
    path: '/fcwebapp/login',
    method: 'POST',
    headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8"
    }
};
// options    "https://be.finleancloud.com/fcwebapp/login"
const req = https.request(options, (res) => {
    console.log('状态码：', res.statusCode);
    console.log('相应头：', res.headers);

    // 相应返回的数据
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});


req.on('error', (e) => {
    console.error(e);
});
var _par = {"mblNo":"18981941021","password":"512c2e190a29e47922f69b6c640f749b"}
req.end(JSON.stringify(_par),function (){
    console.log("发送成功");
});
