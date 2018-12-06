<template>
    <div class="home">
        <Card :padding='0'>
            <div class="title-box">
                <div class="title-content">
                    <p>Finlean Background Technology Center - Overview</p>
                    <p>纷领科技中心 - 项目后台检测系统 ， 总览</p>
                    <p>你可以通过左侧的菜单来选择查看项目的运行情况</p>
                    <p>Version ： 0.0.1</p>
                </div>
                <img src="../assets/homeloading.gif" alt="loading">
            </div>
        </Card>
        <div class="middle-box">
            <div class="pin-box">
                <div id="pinChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
            <div class="latest-box">
                <ul class="sqlList" style="background:  rgb(100, 147, 135);;color: #fff;">
                    <li>
                        <div>地址</div>
                        <div>接口错误/代码错误</div>
                        <div>错误信息</div>
                        <div>时间</div>
                        <div>操作</div>
                    </li>
                </ul>
                <ul v-if="errList.length" class="sqlList listHover" style="border-top:none;">
                    <li v-for="item in errList" :key="item.logId">
                        <div>{{item.projectUrl}}</div>
                        <div>{{item.errType}}</div>
                        <div>{{item.message}}</div>
                        <div>{{$tool.formatDate(item.createDate)}}</div>
                        <div class="xiangqing" @click='golink(item)'>详情</div>
                    </li>
                    <Spin fix v-if="listLoad"></Spin>
                </ul>
                <div v-else class="noData">
                    暂无数据
                    <Spin fix v-if="listLoad"></Spin>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <div class="block-box">
                <div id="blockCharts" :style="{width: '100%', height: '100%'}"></div>
            </div>
            <div class="line-box">
                <div id="lineCharts" :style="{width: '100%', height: '100%'}"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import echarts from 'echarts';
    import 'echarts/theme/macarons.js';

export default {
    name:'home',
    data(){
        return {
            errList:[],
            listLoad:false,
        }
    },
    methods: {
        drawPin(){
            let myChart = echarts.init(
                document.getElementById('pinChart'),
                'macarons'
            );
            myChart.clear();
            myChart.setOption({
                title : {
                    text: 'Bugs Collection',
                    subtext: 'RunTime & API',
                    x:'center'
                },
                 tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:['RunTime','API']
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'RunTime'},
                            {value:310, name:'API'},
                        ]
                    }
                ]
            },true);
        },
        drawBlock(){
            let myChart = echarts.init(
                document.getElementById('blockCharts'),
                'macarons'
            );
            myChart.clear();
            myChart.setOption( {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['纷领云-移动端', '纷领云-客户经理端','纷领云-平台端','纷领钱包-EC端','纷领钱包-E端','纷领钱包-平台端']
                },
                grid: {
                    left: 50,
                    right: 32,
                    bottom: 32
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value'
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                series : [
                    {
                        name:'纷领云-移动端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'纷领云-客户经理端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[120, 132, 101, 134, 90, 1330, 210]
                    },
                    {
                        name:'纷领云-平台端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[220, 182, 191, 234, 290, 330, 1320]
                    },
                    {
                        name:'纷领钱包-EC端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[150, 212, 201, 154, 1320, 330, 410]
                    },
                    {
                        name:'纷领钱包-E端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[820, 832, 901, 934, 1290, 1330, 1320]
                    },
                    {
                        name:'纷领钱包-平台端',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[820, 832, 901, 934, 1290, 330, 1320]
                    }
                ]
            },true);
        },
        drawLine(){
            let myChart = echarts.init(
                document.getElementById('lineCharts'),
                'macarons'
            );
            myChart.clear();
            myChart.setOption( {
                title : {
                    x: 10,
                    text: '走向',
                    subtext: 'RunTime & API'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['RunTime','API']
                },
                calculable : true,
                grid: {
                    left: 50,
                    right: 32,
                    bottom: 32
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'RunTime',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[10, 12, 21, 54, 260, 830, 710]
                    },
                    {
                        name:'API',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[30, 182, 434, 791, 390, 30, 10]
                    },
                ]
            },true);
        },
        getError() {
            this.listLoad = true;
            this.$http
                .post('/frontLogApi/getError', {
                    page: 1,
                    projectId:10003,
                    errType: 'code',
                    rows: 6,
                    timer: []
                })
                .then(res => {
                    this.errList = res.data.data;
                    this.totalNum = res.data.total[0]['count(*)'];
                    this.listLoad = false;
                });
        },
    },
    mounted () {
        this.drawPin();
        this.drawBlock();
        this.drawLine();
        this.getError();
    }
}
</script>
<style lang="less" scoped>
.home {
    padding: 16px;
    height: 100vh;
    .title-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 0 16px;
        height: 120px;
        line-height: 120px;
        overflow: hidden;
        background-color: #649087;
        .title-content {
            p {
                &:first-child {
                    padding-bottom: 8px;
                    font-size: 28px;
                    font-weight: bold;
                    color: #f0f8ff;
                }
                line-height: 24px;
                font-size: 14px;
                color: #f8f8ff;
            }
        }
        img {
            width: 160px;
        }
    }
    .middle-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 16px;
        .pin-box {
            width: 30%;
            height: 282px;
            border: 1px solid #dddddd;
        }
        .latest-box {
            margin-left: 16px;
            width: 69%;
            height: 300px;
            .sqlList {
                border: 1px solid #ddd;
                .xiangqing {
                    color: rgb(100, 147, 135);
                }
                li {
                    > div:nth-child(1) {
                        width: 30%;
                    }
                    > div:nth-child(2) {
                        width: 10%;
                    }
                    > div:nth-child(3) {
                        width: 20%;
                    }
                    > div:nth-child(4) {
                        width: 25%;
                    }
                    > div:nth-child(5) {
                        width: 15%;
                    }
                    > div {
                        text-align: center;
                    }
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    border-bottom: 1px solid #ddd;
                    height: 40px;
                }

                li:last-child {
                    border-bottom: none;
                }
            }
            .listHover {
                position: relative;
                height: 240px;
                li {
                    cursor: pointer;
                }
                li:hover {
                    background: #ddd;
                    transition: all 0.3s solid;
                }
            }
            .noData {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 240px;
                color: #666;
                border: 1px solid #ddd;
            }
        }
    }
    .bottom-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 16px;
        .block-box {
            border: 1px solid #dddddd;
            width: 50%;
            height: 400px;
        }
        .line-box {
            margin-left: 16px;
            border: 1px solid #dddddd;
            width: 49%;
            height: 400px;
        }
    }
}
</style>


