/*  纷领云2.0客户端
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
    uri: 'https://be.finleancloud.com/fcclient/login/login',
    body: {
        'mblNo': '13518117514',
        'password': '72bb5a14c7ec791c818cbfacb18d06a1',
        'ostype': '03',
        'cn': 'y4saZ1',
        'resolution': '1080*1920',
        'isApp': '0',
        'sysType': 2,
        'anonySign': '8f6f75d36f0c62b43ed151dbb1636092'
    },
    headers: {
        'User-Agent': 'Request-Promise',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8'
    },
    resolveWithFullResponse: true,
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

    var status = await page.open('https://be.finleancloud.com/fc_cus/#/login?cn=y4saZ1');
    // 获取网页节点
    var content = await page.property('content');

    await instance.exit();
    // 判断网页是正常的依据目前是 索引在html 节点中是否包含 登录两个字，如果是就认定为正常，否则为不正常
    if (content.indexOf('登录') != -1) {
        return 1;
    } else {
        return 0;
    }

}

async function getAPIState() {
    const reqObj = await rp(options);
    // console.log(reqObj.statusCode);
    if (reqObj.statusCode == 200) {
        return 1;
    } else {
        return 0;
    }

}

// getStaticFileState();
// getAPIState();

module.exports.getStaticFileState = getStaticFileState;
module.exports.getAPIState = getAPIState;
module.exports.projectName = '纷领云2.0客户端';





 