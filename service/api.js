// 引入自己写的数据库配置文件
const db = require('./db/mysql.js');
const projectIndex = require('./projectList/projectIndex');

// 引入express框架依赖
const express = require('express');
const request = require('request');

// 引入处理post数据的依赖
const bodyParser = require('body-parser');
const app = express();

//错误推送
const pushNoticeMessage = require('./pushErrorMsg.js');
// 解析应用程序/json
app.use(bodyParser.json());
// 解析应用程序/ X-WWW格式URL编码
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./dist'));


// 跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
});

// 获取客户IP
const getClientIp = function (req) {
    let ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress ||
        '';
    ip = ip.match(/\d+.\d+.\d+.\d+/);
    ip = ip ? ip.join('.') : null;
    return ip;
};


// 获取错误日志
app.post('/frontLogApi/getError', (req, res) => {
    db.getList(req.body)
        .then(data => {
            db.getTotalNum(req.body).then(total => {
                res.send({data, total});
            });
        })
        .catch(err => res.send(err));
});

// 保存错误日志
app.post('/frontLogApi/saveError', (req, res) => {
    delete req.body.jttechSign;
    req.body.clientIp = getClientIp(req);
    db.addInfos(req.body)
        .then(() => {
            res.send('saveError success');
            // 开始推送
            pushNoticeMessage(req.body);
        })
        .catch(err => res.send(err));
});
//获取项目菜单列表
app.post('/frontLogApi/getProjectMenuList', (req, res) => {
    db.getProjectMenu()
        .then(data => {
            let fatherProjectArr = [];
            data.forEach(val => {
                if (val.ischild === 0) {
                    let obj = {
                        prodName: val.prodName,
                        pid: val.pid,
                        child: []
                    };
                    fatherProjectArr.push(obj);
                }
            });
            fatherProjectArr.forEach(val => {
                data.forEach(item => {
                    if (item.ischild === val.pid) {
                        val.child.push(item);
                    }
                });
            });
            res.send(fatherProjectArr);
        })
        .catch(err => res.send(err));
});
//点击item查询详细信息
app.post('/frontLogApi/getItemInfo', (req, res) => {
    db.getItemInfo(req.body)
        .then(data => {
            res.send(data[0]);
        })
        .catch(err => res.send(err));
});
//获取图表数据
app.post('/frontLogApi/getChartsData', (req, res) => {
    (async function getData() {
        let runTimeData = await db.getRunTimeData(req.body);
        let APIData = await db.getAPIData(req.body);
        let result = {
            runTimeData,
            APIData
        };
        res.send(result);
    })().catch(err => res.send(err));
});
// 验证短信
app.post('/frontLogApi/checkVerCode', (req, res) => {
    projectIndex.checkVerCode(req, res);
});
// 判断资源是否正常
app.post('/frontLogApi/checkProject', (req, res) => {
    projectIndex.checkProject(req, res);
});

module.exports = app;
