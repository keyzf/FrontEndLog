/*
 * @Author: CL
 * @Date: 2018-09-20 14:48:55
 * @Last Modified by: hzq
 * @Last Modified time: 2018-09-25 18:05:36
 * @文件说明:  前端错误日志首页
 */
<template>
    <div class="all">
        <!-- 菜单组件 -->
        <customMenu @on-click="menuClick"></customMenu>
        <div class="tabList">
            <mainPage v-if="slideType===0" :projectId='projectId' :projectInfo='objInfo'></mainPage>
            <home v-if="slideType===1"></home>
        </div>
    </div>
</template>

<script>

    import customMenu from './Menu';
    import mainPage from './mainPage'
    import home from './home';
    export default {
        name: 'errorShow',
        components: { customMenu,mainPage,home },
        data() {
            return {
                slideType:1,
                projectId: '', // 菜单id
                objInfo:{}
            };
        },
        methods: {
            // 左侧菜单点击事件
            menuClick(obj) {
                if(obj==='all'){
                    this.slideType=1;
                    return;
                }else{
                    this.slideType=0;
                }
                this.projectId = obj.item.pid;
                this.objInfo=JSON.parse(JSON.stringify(obj));
            },
            // 获取【tab】-【菜单数据】
            heartConnectList() {
                this.$http.get('/public_timer/heartConnect/list', {
                    params: {
                        page: 1,
                        rows: 10
                    }
                });
            },
        },
        mounted() {
            this.heartConnectList()
        }
    };
</script>
<style lang="less" scoped>
li {
    list-style: none;
}
.all {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tabList {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
}
</style>
