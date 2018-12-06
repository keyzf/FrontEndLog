
 /*
* @Author: c.y
* @Date: 2018-09-29
* @Last Modified by: c.y
* @Last Modified time: 2018-09-29
*/
 const phantom = require('phantom');

 (async function() {
     const instance = await phantom.create();
     const page = await instance.createPage();
     await page.on('onResourceRequested', function(requestData) {
         console.info('Requesting', requestData.url);
     });

     const status = await page.open('https://be.finlean.com/fc_tool/#/');
     const content = await page.property('content');
     console.log(content);

     await instance.exit();
 })();