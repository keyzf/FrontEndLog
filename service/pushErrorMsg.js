const ALY = require('aliyun-sdk');
//配置推送的账号信息
const push = new ALY.PUSH({
    accessKeyId: 'LTAIfljBlNIDmvSC',
    secretAccessKey: 'S8xkAgJxLLSH3egiE1gXguffDFTuS4',
    endpoint: 'http://cloudpush.aliyuncs.com',
    apiVersion: '2016-08-01'
});
function pushNoticeMessage(info) {
    // if (
    //     info.projectUrl.indexOf('t.finlean') !== -1 ||
    //     info.projectUrl.indexOf('localhost') !== -1 ||
    //     info.projectUrl.indexOf('192.168') !== -1
    // ) {
    //     return false;
    // }
    console.log('//===================================================');
    let errMsgBody = '';
    if (info.errType === '接口错误') {
        //如果是接口错误则返回接口地址，否则返回url地址
        errMsgBody = info.APIURL;
    } else {
        errMsgBody = info.projectUrl;
    }
    // 开始安卓推送，包括Notice和Message====================================
    push.pushNoticeToAndroid(
        {
            AppKey: '25069506',
            Target: 'ALL', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
            TargetValue: 'ALL',
            Title: info.projectName + '：' + info.errType,
            Body: errMsgBody
        },
        function(err, res) {
            if (err) {
                console.log('Android Notice推送失败：' + err);
            } else {
                console.log('Android Notice推送成功：' + res);
            }
        }
    );
    push.pushMessageToAndroid(
        {
            AppKey: '25069506',
            Target: 'ALL', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
            TargetValue: 'ALL',
            Title: info.projectName + '：' + info.errType,
            Body: 'URL：' + errMsgBody + 'Message：' + info.message
        },
        function(err, res) {
            if (err) {
                console.log('Android Message推送失败：' + err);
            } else {
                console.log('Android Message推送成功：' + res);
            }
        }
    );
    //为IOS进行推送
    push.pushNoticeToiOS(
        {
            AppKey: '25069506',
            ApnsEnv: 'PRODUCT',
            Target: 'ALL', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
            TargetValue: 'ALL',
            Body: info.projectName + '：' + info.errType + '，' + errMsgBody
        },
        function(err, res) {
            if (err) {
                console.log('iOS Notice推送失败：' + err);
            } else {
                console.log('iOS Notice推送成功：' + res);
            }
        }
    );
    push.pushMessageToiOS(
        {
            AppKey: '25069506',
            Target: 'ALL', //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
            TargetValue: 'ALL',
            Title: info.projectName + '：' + info.errType,
            Body: 'URL：' + errMsgBody + 'Message：' + info.message
        },
        function(err, res) {
            if (err) {
                console.log('iOS Message推送失败：' + err);
            } else {
                console.log('iOS Message推送成功：' + res);
            }
        }
    );
}
module.exports = pushNoticeMessage;
