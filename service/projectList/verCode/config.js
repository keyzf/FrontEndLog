/* 短信验证码的功能检查--业务官网
 * @Author: c.y
 * @Date: 2018-09-29
 * @Last Modified by: c.y
 * @Last Modified time: 2018-09-29
 */

// 设置基本请求参数
function setBaseOption() {
    return {
        url: 'https://www.jycash.cn', // 域名
        method: 'POST', // 请求方法
        json: true, // 发送json
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
}

exports.getOption = function (pathName, body) {
    let baseOption = setBaseOption();
    baseOption.url = baseOption.url + pathName;
    baseOption.body = body;
    return baseOption;
};

exports.apiList = {
    'getVerCode': '/ow/user/getVerCode' // 获取验证码
};