var mysql = require('mysql');
var pool = mysql.createPool({
    host: '**',
    user: '**',
    password: '**',
    database: '**',
    port: '**'
});
/**
 * 获取 mysql 的链接
 * @param sql
 * @param values
 * @returns {Promise<any>}
 */
let connection = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                resolve(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};
//查代码错误
const getRunTimeData = val => {
    let sql = `
    select DATE_FORMAT(createDate,'%Y-%m-%d') days ,COUNT(createDate) num  from runTimelog WHERE createDate >= "${
        val.startTime
    }" and createDate < "${val.endTime}" and projectId=${
        val.projectId
    } group by days`;
    return connection(sql, val);
};
//查接口错误
const getAPIData = val => {
    let sql = `
    select DATE_FORMAT(createDate,'%Y-%m-%d') days ,COUNT(createDate) num  from APILog WHERE createDate >= "${
        val.startTime
    }" and createDate < "${val.endTime}" and projectId=${
        val.projectId
    } group by days`;
    return connection(sql, val);
};
// 获取总条数
const getTotalNum = val => {
    let sql = `SELECT  count(*) FROM ${
        val.errType === 'code' ? 'runTimelog' : 'APILog'
    } where projectId=${val.projectId} ${
        val.timer.length
            ? 'and createDate > ' +
              ' " ' +
              val.timer[0] +
              ' " ' +
              ' and createDate < ' +
              ' " ' +
              val.timer[1] +
              ' " '
            : ''
    }`;
    return connection(sql, val);
};
/**
 * @param {String} errType  错误类型：code 代码错误，api 接口错误
 * @param {String} timer    [开始时间,结束时间] yyyy-mm-dd hh:mm:ss
 * @param {Number} page 页码
 * @param {Number} rows 每页条数
 */
let getList = function(value) {
    if (!value.errType) throw new Error('no errType');
    if (!value.page || !value.rows) throw new Error('No page or rows');
    let _sql = '';
    _sql = `SELECT * FROM ${
        value.errType === 'code' ? 'runTimelog' : 'APILog'
    } where projectId=${value.projectId} ${
        value.timer.length
            ? 'and createDate > ' +
              ' " ' +
              value.timer[0] +
              ' " ' +
              ' and createDate < ' +
              ' " ' +
              value.timer[1] +
              ' " '
            : ''
    } order by createDate desc limit ${value.rows * (value.page - 1)},${
        value.rows
    }`;
    return connection(_sql, value);
};

/**
 *  数据储存
 * @param value 为参数
 * @returns {Promise<any>}
 */
let addInfos = function(value) {
    let _array = [];
    let _par = '';
    let _val = '';
    for (let item in value) {
        _array.push(value[item]);
        _par += item + ',';
        _val += '?,';
    }
    _par = _par.substr(0, _par.length - 1);
    _val = _val.substr(0, _val.length - 1);
    let _sql = '';
    if (value.errType === '接口错误') {
        _sql = 'INSERT INTO APILog(' + _par + ') VALUES(' + _val + ')';
    } else {
        _sql = 'INSERT INTO runTimelog(' + _par + ') VALUES(' + _val + ')';
    }
    return connection(_sql, _array);
};

/**
 * 获取项目菜单
 * TANGIMING 2018-9-19
 */
const getProjectMenu = function() {
    let sql =
        'SELECT B.pid,A.prodName,B.prodName as childItem FROM (SELECT pid,prodName from project_list where ischild =0) as A left JOIN project_list As B ON A.pid = B.ischild';
    let _sql = 'SELECT * FROM project_list';
    return connection(_sql);
};
/**
 *
 * @param {String} logId 错误日志的id
 * @param {String} errType 错误类型：代码错误 code 、接口错误 api
 */
const getItemInfo = function(val) {
    let sql = `SELECT * FROM ${
        val.errType === 'code' ? 'runTimelog' : 'APILog'
    } where logId=${val.logId}`;
    return connection(sql);
};
module.exports = {
    getList,
    addInfos,
    getProjectMenu,
    getItemInfo,
    getTotalNum,
    getRunTimeData,
    getAPIData
};
