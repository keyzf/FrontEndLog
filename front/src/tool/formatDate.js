/*
 * @Author: hzq
 * @Date: 2018-09-25 14:53:41
 * @Last Modified by: hzq
 * @Last Modified time: 2018-09-25 15:02:08
 * @文件说明: 日期格式化
 */
const formatDate = (date, _fmt) => {
    if (!date) {
        return null;
    }
    date = new Date(date);
    let fmt = _fmt || 'YYYY-MM-DD HH:mm:ss 星期E';
    if (fmt === undefined) {
        return Number(date);
    } else {
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds()
        };
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length > 1
                    ? RegExp.$1.length > 2
                        ? '\u661f\u671f'
                        : '\u5468'
                    : '') + week[date.getDay() + '']
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return fmt;
    }
};

export default formatDate;
