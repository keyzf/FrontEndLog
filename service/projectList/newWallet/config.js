/* 新版纷领钱包的配置文件
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
    uri: 'https://loan.finleanwallet.cn/commerce/v2/login',
    body: {"anonySign": "5ccb9145c516b7840e4b2bc883b8f23d","areaCode": "510100","chanNo":"","childChan":""
        ,"cn": "S4Xn","isApp": "0","mblNo": "18981941021","ostype": "Android","password": "3fefa24019bf56aa9ac8bf6add84b2cc",
        "resolution": "1080*1920",},
    headers: {
        'User-Agent': 'Request-Promise',
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8"
    },
    resolveWithFullResponse:true,
    json:true
};

/**
 *  获取静态资源状态
 * @returns {Promise<string>}
 */
async function getStaticFileState() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    // 打印静态资源列表
    await page.on('onResourceRequested', function (requestData) {
        console.info('静态资源列表:', requestData.url);
    });

    var status = await page.open('https://loan.finleanwallet.cn/finlean_wallets/#/f-login?cn=S4Xn');
    // 获取网页节点
    var content = await page.property('content');

    await instance.exit();
    // 判断网页是正常的依据目前是 索引在html 节点中是否包含 登录两个字，如果是就认定为正常，否则为不正常
    console.log(content.indexOf("登录"));
    if (content.indexOf("登录")!= -1) {
        return 1;
    } else {
        return 0;
    }

}

/**
 * 接口校验
 * @returns {Promise<void>}
 */
async function getAPIState() {
    const  reqObj = await rp(options);
    console.log(reqObj.statusCode);
    if(reqObj.statusCode == 200){
        return 1;
    }else {
        return 0;
    }
}

module.exports.getStaticFileState = getStaticFileState;
module.exports.getAPIState = getAPIState;
module.exports.projectName = '纷领钱包新C';