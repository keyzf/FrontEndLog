/*
 * @Author: hzq
 * @Date: 2018-09-25 14:54:33
 * @Last Modified by: hzq
 * @Last Modified time: 2018-09-25 15:00:59
 * @文件说明: 工具封装为$tool
 */
import formatDate from './formatDate';
let tool = { formatDate };
const install = Vue => {
    if (install.installed) return;
    install.installed = true;
    Object.defineProperties(Vue.prototype, {
        $tool: {
            get() {
                return tool;
            }
        }
    });
};
export default { install };
