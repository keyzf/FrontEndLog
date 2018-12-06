/*
 * @Author: c.y
 * @Date: 2018-09-30
 * @Last Modified by: c.y
 * @Last Modified time: 2018-09-30
 */

const verCodeConfig = require('./verCode/config');
const newWallet = require('./newWallet/config');
const oldWallet = require('./oldWallet/config');
const channelWalletConfig = require('./channelWallet/config');
const cloudsV1B = require('./clouds_v1_B/config');
const cloudsV1E = require('./clouds_v1_E/config');
const cloudsV1EC = require('./clouds_v1_EC/config');
const cloudsV2B = require('./clouds_v2_B/config');
const cloudsV2E = require('./clouds_v2_E/config');
const cloudsV2EC = require('./clouds_v2_EC/config');
const jettchWebsite = require('./jettch_website/config');
const mingQtWebsite = require('./mingqt_website/config');
const insFinlean = require('./ins_finlean/config');
const sibBiz = require('./sib_biz/config');
const sifPlat = require('./sif_plat/config');
const request = require('request');

// 项目的列表
let projectList = [
    newWallet,
    oldWallet,
    channelWalletConfig,
    cloudsV1B,
    cloudsV1E,
    cloudsV1EC,
    cloudsV2B,
    cloudsV2E,
    cloudsV2EC,
    jettchWebsite,
    mingQtWebsite,
    insFinlean,
    sibBiz,
    sifPlat
];

// 效验验证码功能
exports.checkVerCode = function (req, res) {
    // 转发请求
    let requestOpt = verCodeConfig.getOption(verCodeConfig.apiList.getVerCode, req.body);
    request(requestOpt, function (error, response, body) {
        // console.log(response.bdy)
        res.status(response.statusCode).send(body);
    });
};

// 判断所有项目是否正常
async function checkAllProject(projectList, req,  res) {
    let resultList = [];
    for (let i = 0; i < projectList.length; i++) {
        let projectName = projectList[i].projectName;
        let staticStatus = await projectList[i].getStaticFileState();
        let apiStatus = await projectList[i].getAPIState();
        resultList.push({
            projectName: projectName,
            apiStatus: apiStatus,
            staticStatus: staticStatus,
        })
    }
    res.send(resultList);
}


// 判断资源是否正常
exports.checkProject = function (req, res) {
    checkAllProject(projectList, req, res);
};
