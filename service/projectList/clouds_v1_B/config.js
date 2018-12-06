/* 纷领云1.0平台端
 * @Author: c.y
 * @Date: 2018-09-29
 * @Last Modified by: c.y
 * @Last Modified time: 2018-09-29
 */
const phantom = require('phantom');
const rp = require('request-promise');


// api 登录接口配置
const options = {
    method: 'POST',
    uri: 'https://bm.finlean.com/supportcenter/b1/login',
    body: {"mblNo": "18190811201", "password": "615f70a53707532be897710b49aa4c7a"},
    headers: {
        'User-Agent': 'Request-Promise',
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8"
    },
    resolveWithFullResponse:true,
    json: true // Automatically parses the JSON string in the response
};

/**
 *  默认路由界面 获取静态资源状态
 * @returns {Promise<string>}
 */
async function getStaticFileState() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    // 打印静态资源列表
    // await page.on('onResourceRequested', function (requestData) {
    //     console.info('静态资源列表:', requestData.url);
    // });

    var status = await page.open('https://bm.finlean.com/b_manage/#/login');
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
    if(reqObj.statusCode == 200){
        return 1;
    }else {
        return 0;
    }

}
// getAPIState()

module.exports.getStaticFileState = getStaticFileState;
module.exports.getAPIState = getAPIState;
module.exports.projectName = '纷领云1.0平台端';




