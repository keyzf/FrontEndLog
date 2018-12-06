/*
 * @Author: CL
 * @Date: 2018-09-19 13:55:43
 * @Last Modified by: hzq
 * @Last Modified time: 2018-09-25 14:58:25
 * @文件说明:  报错详情
 */
<template>
    <div>
        <div class="errorShow">
            <!-- v-if="errorList.length" -->
            <!-- <ul class="left" v-if="!pageNum">
                <div class="errTab">
                    <div :class="{tabChoose:currTab==='code'}" @click="tabClick('code')">代码错误</div>
                    <div :class="{tabChoose:currTab==='api'}" @click="tabClick('api')">接口错误</div>
                </div>
                <li v-for="err in errorList" :key="err.logId" :class="{currLi:err.logId===currErr.logId}" @click="clickError(err)">
                    <div class="liLeft">
                        <div v-if="err.statusCode" class="errType">{{err.statusCode}}：</div>
                        <div class="message" :title="err.message">{{err.message}}</div>
                    </div>
                    <div class="liRight">
                        <div>{{$tool.formatDate(err.createDate,'MM-DD HH:mm')}}</div>
                    </div>
                </li>
            </ul> -->
            <div class="center">
                <h4>概要信息</h4>
                <ul>
                    <li>
                        <span>时间</span>
                        <span>{{$tool.formatDate(currErr.createDate)}}</span>
                    </li>
                    <li>
                        <span>项目</span>
                        <span>{{currErr.projectName}}</span>
                    </li>
                    <li>
                        <span>地址</span>
                        <span>{{currErr.projectUrl}}</span>
                    </li>
                    <li>
                        <span>错误类型</span>
                        <span class="red">{{currErr.errType}}</span>
                    </li>
                </ul>
                <div v-if="currErr.stack">
                    <h4>堆栈信息</h4>
                    <pre>{{currErr.stack}}</pre>
                </div>
                <h4>错误信息</h4>
                <ul v-if="currTab==='code'">
                    <li>
                        <span>文件</span>
                        <span>{{currErr.filename||'-'}}</span>
                    </li>
                    <li>
                        <span>信息</span>
                        <span class="red">{{currErr.message}}</span>
                    </li>
                </ul>
                <ul v-else>
                    <li>
                        <span>接口地址</span>
                        <span class="red">{{currErr.APIURL}}</span>
                    </li>
                    <li>
                        <span>状态码</span>
                        <span class="red">{{currErr.statusCode}}</span>
                    </li>
                    <li>
                        <span>参数</span>
                        <span class="red">{{currErr.data}}</span>
                    </li>
                    <li>
                        <span>错误信息</span>
                        <span class="red">{{currErr.message}}</span>
                    </li>
                    <li>
                        <span>错误编码</span>
                        <span class="red">{{currErr.errCode}}</span>
                    </li>
                </ul>
                <h4>Cookies</h4>
                <pre>{{currErr.cookies||'{}'}}</pre>
                <h4>LocalStorage</h4>
                <pre>{{currErr.localStorage}}</pre>
                <h4>SessionStorage</h4>
                <pre>{{currErr.sessionStorage}}</pre>
            </div>
            <div class="right">
                <h4>设备信息</h4>
                <ul>
                    <li>
                        <span>浏览器</span>
                        <span>{{currErr.browser}}</span>
                    </li>
                    <li>
                        <span>浏览器版本</span>
                        <span>{{currErr.browserVersion}}</span>
                    </li>
                    <li>
                        <span>操作系统</span>
                        <span>{{currErr.system}}</span>
                    </li>
                    <li>
                        <span>设备</span>
                        <span>{{currErr.device}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="loading" v-show="isLoad">
            <div class="spin"></div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'errorDtl',
        data() {
            return {
                // 错误数据列表
                errorList: [],
                // 当前展示的错误信息对象
                currErr: {},
                // 页数
                pageNum: 1,
                // 当前选中的错误类型：代码(code)、接口(api)
                currTab: 'code',
                isLoad: false
            };
        },
        methods: {
            tabClick(flag) {
                this.currTab = flag;
                this.getError();
            },
            getError() {
                this.isLoad = true;
                this.$http
                    .post('/frontLogApi/getItemInfo', {
                        logId: this.$route.query.logId,
                        errType: this.$route.query.errType
                    })
                    .then(res => {
                        this.currErr = res.data;
                        this.isLoad = false;
                        // if (data.length) {
                        //     this.errorList = data;
                        //     this.currErr = data[0];
                        //     this.currErr.cookies = JSON.parse(data[0].cookies);
                        //     this.currErr.localStorage = JSON.parse(
                        //         data[0].localStorage
                        //     );
                        //     this.currErr.sessionStorage = JSON.parse(
                        //         data[0].sessionStorage
                        //     );
                        //     this.$nextTick(() => (this.isLoad = false));
                        // }
                    });
            }
            // clickError(err) {
            //     this.currErr = err;
            //     if (
            //         typeof err.localStorage !== 'object' &&
            //         err.localStorage !== '{}'
            //     ) {
            //         this.currErr.localStorage = JSON.parse(err.localStorage);
            //     }
            //     if (
            //         typeof err.sessionStorage !== 'object' &&
            //         err.sessionStorage !== '{}'
            //     ) {
            //         this.currErr.sessionStorage = JSON.parse(err.sessionStorage);
            //     }
            // },
        },
        created() {
            this.getError();
        }
    };
</script>
<style lang='less' scoped>
    .errorShow {
        display: flex;
        .red {
            color: #f00;
        }
        .left {
            width: 20%;
            min-height: 100vh;
            max-height: 100vh;
            overflow: auto;
            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
            }
            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 20px;
                background: #515a6e;
            }
            .errTab {
                display: flex;
                margin-bottom: 10px;
                div {
                    flex: 1;
                    height: 45px;
                    line-height: 45px;
                    text-align: center;
                    cursor: pointer;
                    &:hover {
                        background-color: #f8f8f8;
                    }
                }
                .tabChoose {
                    border-bottom: 5px solid #515a6e;
                }
            }
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f8f8f8;
                cursor: pointer;
                &:hover {
                    background-color: #f8f8f8;
                }
                .liLeft {
                    display: flex;
                    width: 75%;
                    font-size: 14px;
                    .errType {
                        color: #333;
                    }
                    .message {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #6c6c72;
                    }
                }
                .liRight {
                    font-size: 12px;
                    color: #9d9da1;
                }
            }
            .currLi {
                box-shadow: inset 10px 0 0 #515a6e;
                background-color: #f8f8f8;
            }
        }
        .center,
        .right {
            padding: 0 30px;
            font-size: 14px;
            h4 {
                margin-bottom: 10px;
                margin-top: 30px;
                font-size: 16px;
                font-weight: normal;
            }
            ul {
                li {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #f2f3f3;
                    color: #4a4a4a;
                    span {
                        &:first-child {
                            width: 100px;
                            color: #9d9da1;
                        }
                        &:last-child {
                            flex: 1;
                            word-wrap: break-word;
                            word-break: break-all;
                        }
                    }
                }
            }
        }
        .center {
            position: relative;
            padding-bottom: 30px;
            width: 65%;
            &::after,
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 100%;
                min-height: 100vh;
                background-color: #f2f3f3;
            }
            &::after {
                left: 100%;
            }
            pre {
                width: 100%;
                padding: 15px;
                font-size: 14px;
                color: #f00;
                border: 1px solid #f2f3f3;
                white-space: pre-wrap;
                box-sizing: border-box;
                font-family: -webkit-body;
            }
        }
        .right {
            width: 30%;
        }
    }
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: rgba(255, 255, 255, 0.8);
        .spin {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #00a680;
            animation: ani-spin-bounce 1s 0s ease-in-out infinite;
        }
    }
    @keyframes ani-spin-bounce {
        0% {
            transform: scale(0);
        }
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
</style>
