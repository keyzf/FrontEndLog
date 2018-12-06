/*  纷领云2.0业务员端
 * @Author: c.y
 * @Date: 2018-09-29
 * @Last Modified by: c.y
 * @Last Modified time: 2018-09-29
 */
const phantom = require('phantom');
const rp = require('request-promise');


// api 接口配置
const options = {
    method: 'POST',
    uri: 'https://be.finlean.com/fcwebapp/login',
    body: {"mblNo":"18190811201","password":"0c338734057d733ee6d6a92e41029ccd"},
    headers: {
        'User-Agent': 'Request-Promise',
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8"
    },
    resolveWithFullResponse:true,
    json: true // Automatically parses the JSON string in the response
};

/**
 *  获取静态资源状态
 * @returns {Promise<string>}
 */
async function getStaticFileState() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    // 打印静态资源列表
    // await page.on('onResourceRequested', function (requestData) {
    //     console.info('静态资源列表:', requestData.url);
    // });

    var status = await page.open('https://be.finlean.com/fc_tool/#/');
    // 获取网页节点
    var content = await page.property('content');

    await instance.exit();
    // 判断网页是正常的依据目前是 索引在html 节点中是否包含 登录两个字，如果是就认定为正常，否则为不正常
    if (content.indexOf("登录") != -1) {
        return 1;
    } else {
        return 0;
    }

}

async function getAPIState() {
    const  reqObj = await rp(options);
    console.log(reqObj.statusCode)
    if(reqObj.statusCode == 200){
        return 1;
    }else {
        return 0;
    }

}

// getStaticFileState();
// getAPIState();

module.exports.getStaticFileState = getStaticFileState;
module.exports.getAPIState = getAPIState;
module.exports.projectName = '纷领云2.0业务员端';





 