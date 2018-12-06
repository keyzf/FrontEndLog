<template>
    <div class="mainPage">
        <div class="rightList">
            <div class="echar">
                <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
            <Tabs @on-click="changeTab" v-model="errType">
                <TabPane label="代码错误" icon="ios-people" name="code"></TabPane>
                <TabPane label="接口错误" icon="logo-steam" name="api"></TabPane>
                <TabPane label="菜单" icon="logo-steam" name="menu"></TabPane>
            </Tabs>
            <Row>
                <Col span="12">
                <DatePicker v-model="timer" format="yyyy-MM-dd" type="daterange" placement="right-start" placeholder="请选择时间" style="width: 200px;margin-right:16px;" @on-change="timerChange"></DatePicker>
                <Button type="primary" @click='getError'>查询</Button>
                </Col>
            </Row>
            <ul class="sqlList" style="background:  rgb(100, 147, 135);;color: #fff;">
                <li>
                    <div>地址</div>
                    <div>设备</div>
                    <div>接口错误/代码错误</div>
                    <div>错误信息</div>
                    <div>时间</div>
                    <div>操作</div>
                </li>
            </ul>
            <ul v-if="errList.length" class="sqlList listHover" style="border-top:none;">
                <li v-for="item in errList" :key="item.logId">
                    <div>{{item.projectUrl}}</div>
                    <div>{{item.device}}</div>
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
            <Page :current="page" :total="totalNum" @on-change="pageChange" />
        </div>
        <Spin fix v-if="menuLoad"></Spin>
    </div>
</template>
<script>
    import echarts from 'echarts';
    import 'echarts/theme/macarons.js';
export default {
    name: 'errorShow',
    data() {
        return {
            menuLoad: false, // 菜单加载
            listLoad: false, // 列表加载
            timer: [], // 时间
            errList: [], // 错误列表
            totalNum: 100, // 总数量
            errType: 'code', // 类型： code 代码错误 / api 接口错误
            page: 1, // 页码
            rows: 10 // 每页条数
        };
    },
    props:{
        projectId:{
            default:''
        },
        projectInfo:{
            require:true,
            default:()=>{
                return {}
            }
        }
    },
    watch:{
        projectId(val,oldVal){
            this.init();
        }
    },
    methods: {
        // tab选项切换
        changeTab(name) {
            this.page = 1;
            this.errType = name;
            this.timer = [];
            this.getError();
        },
        // 时间选择器change事件
        timerChange(val) {
            this.timer = val;
        },
        // 获取【错误】列表数据
        getError() {
            this.listLoad = true;
            this.$http
                .post('/frontLogApi/getError', {
                    projectId: this.projectId,
                    page: this.page,
                    errType: this.errType,
                    rows: this.rows,
                    timer: this.timer
                })
                .then(res => {
                    this.errList = res.data.data;
                    this.totalNum = res.data.total[0]['count(*)'];
                    this.$nextTick(() => {
                        this.menuLoad = false;
                        this.listLoad = false;
                    });
                });
        },

        // 获取统计折现数据
        getLine(obj) {
            let now = new Date();
            let sevenDaysBeforeNow = now - 6 * 24 * 60 * 60 * 1000;
            this.$http.post('/frontLogApi/getChartsData',{
                startTime:this.$tool.formatDate(sevenDaysBeforeNow,'YYYY-MM-DD'),
                endTime:this.$tool.formatDate(Number(now)+24 * 60 * 60 * 1000,'YYYY-MM-DD'),
                projectId:this.projectId
            }).then(res=>{
                this.drawLine(obj,res.data);
            })
        },
        // 页码change事件
        pageChange(val) {
            this.page = val;
            this.getError();
        },
        // 详情跳转
        golink(item) {
            let url =
                location.origin +
                '/#/errorDtl?logId=' +
                item.logId +
                '&errType=' +
                this.errType;
            window.open(url);
        },
        // echarts渲染
        drawLine(obj,data) {
            let APIBugs=[];
            let runTimeBugs=[];
            let days=7;
            let dateArr=[];
            for(let i=0;i<days;i++){
                let day=this.$tool.formatDate(Number(new Date())-24*60*60*1000*i,'YYYY-MM-DD');
                dateArr.unshift(day);
            }
            dateArr.forEach(val=>{
                let runTimeDay=data.runTimeData.find(_val=>{
                    return _val.days===val
                })
                runTimeBugs.push(runTimeDay?runTimeDay.num:0)
                let APIDay=data.APIData.find(_val=>{
                    return _val.days===val
                })
                APIBugs.push(APIDay?APIDay.num:0)
            })
            let myChart = echarts.init(
                document.getElementById('myChart'),
                'macarons'
            );
            myChart.clear();
            myChart.setOption({
                title: {
                    text: this.projectInfo.sub.prodName,
                    x: 40,
                    y: 'top',
                    padding: 0,
                    subtext: this.projectInfo.sub.prodName + '-' + this.projectInfo.item.prodName
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 40,
                    right: 32,
                    bottom: 24
                },
                legend: {
                    data: ['代码错误', '接口错误'],
                    itemGap: 50
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: dateArr,
                        position: 'left'
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '代码错误',
                        type: 'line',
                        data: runTimeBugs,
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        }
                    },
                    {
                        name: '接口错误',
                        type: 'line',
                        data: APIBugs,
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        }
                    }
                ]
            },true);
        },
        //初始化方法
        init(){
            this.timer=[];
            this.page=1;
            this.errType = 'code';
            this.getLine();
            this.getError();
        }
    },
    mounted() {
        this.init();
    }
}
</script>
<style lang="less" scoped>
.mainPage {
    &/deep/.rightList {
        width: 100%;
        padding: 0 16px;
        min-width: 1400px;
        overflow-y: auto;
        .ivu-tabs {
            width: 100%;
        }
    }
    .echar {
        height: 300px;
        text-align: center;
        line-height: 300px;
        font-size: 50px;
        padding: 16px;
    }
    .sqlList {
        border: 1px solid #ddd;
        .xiangqing {
            color: rgb(100, 147, 135);
        }
        li {
            > div:nth-child(1) {
                width: 25%;
            }
            > div:nth-child(2) {
                width: 10%;
            }
            > div:nth-child(3) {
                width: 10%;
            }
            > div:nth-child(4) {
                width: 30%;
            }
            > div:nth-child(5) {
                width: 15%;
            }
            > div:nth-child(6) {
                width: 10%;
            }
            > div {
                text-align: center;
            }
            display: flex;
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
        height: 401px;
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
        height: 401px;
        color: #666;
        border: 1px solid #ddd;
    }
    .ivu-row {
        padding-bottom: 20px;
    }
    .ivu-page {
        padding: 20px 0;
        float: right;
    }
    &/deep/.ivu-tabs-tabpane {
        overflow: hidden;
    }
    &/deep/.ivu-tabs-nav .ivu-tabs-tab-active {
        color: rgb(100, 147, 135);
    }
    &/deep/.ivu-tabs-ink-bar {
        background-color: rgb(100, 147, 135);
    }
    .ivu-btn-primary {
        background-color: rgb(100, 147, 135);
        border-color: rgb(100, 147, 135);
    }
    &/deep/.ivu-page-item-active {
        border-color: rgb(100, 147, 135);
        a {
            color: rgb(100, 147, 135);
        }
    }
    &/deep/.ivu-page-item:hover {
        border-color: rgb(100, 147, 135);
    }
    &/deep/.ivu-page-item:hover a {
        color: rgb(100, 147, 135);
    }
    &/deep/.ivu-page-next:hover {
        border-color: rgb(100, 147, 135);
    }
    &/deep/.ivu-page-next:hover a {
        color: rgb(100, 147, 135);
    }
    &/deep/ .ivu-page-prev:hover {
        border-color: rgb(100, 147, 135);
    }
    &/deep/ .ivu-page-prev:hover a {
        color: rgb(100, 147, 135);
    }
}
</style>


