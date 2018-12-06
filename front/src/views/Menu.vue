/*
 * @Author: CL
 * @Date: 2018-09-18 17:59:21
 * @Last Modified by: hzq
 * @Last Modified time: 2018-09-25 16:49:35
 * @文件说明:  菜单
 */
<template>
    <div class='menu-title'>
        <div class="logo">
            <img src="../assets/logo.gif" alt="logo">
            <div>Front-end Log Monitoring</div>
        </div>
        <Row class="menu" v-if="menuList.length">
            <Col span="8">
            <Menu theme="light" active-name="all" :open-names="[menuList[0].pid]" accordion @on-select=getMenuItem>
                <MenuItem name="all">
                <Icon type="ios-bug" size='16' />
                总览
                </MenuItem>
                <div v-for="i in menuList" :key="i.pid">
                    <Submenu v-if="i.child.length" :name="i.pid">
                        <template slot="title">
                            <Icon type="ios-paper" /> {{i.prodName}}
                        </template>
                        <MenuItem v-for="j in i.child" :key="j.pid" :name="j.pid">{{j.prodName}}</MenuItem>
                    </Submenu>
                    <MenuItem v-else :name="i.pid">{{i.prodName}}</MenuItem>
                </div>
            </Menu>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                menuList: []
            };
        },
        methods: {
            //获取菜单
            getMenu() {
                this.$http.post('/frontLogApi/getProjectMenuList', {}).then(res => {
                    this.menuList = res.data;
                    // this.getMenuItem(this.menuList[0].child[0].pid);
                });
            },
            getMenuItem(id) {
                if(id==='all') {
                    this.$emit('on-click', 'all');
                    return;
                }
                let jIndex = null;
                let sub = this.menuList.find(i => {
                    jIndex = i.child.findIndex(j => {
                        return j.pid === id;
                    });
                    return jIndex !== -1;
                });
                sub = this.$copy(sub);
                let item = this.$copy(sub.child[jIndex]);
                delete sub.child;
                this.onClick({ sub, item });
            },
            onClick(obj) {
                this.$emit('on-click', obj);
            }
        },
        created() {
            this.getMenu();
        }
    };
</script>

<style lang='less' scoped>
.menu-title {
    background: rgb(247, 247, 247);
    .logo {
        margin-bottom: 20px;
        text-align: center;
        color: rgb(100, 147, 135);
        img {
            width: 100%;
            height: 100%;
        }
        i {
            font-size: 40px;
        }
        > div {
            margin-top: -20px;
            font-weight: bold;
            font-size: 14px;
        }
    }
    & /deep/ .menu {
        .ivu-menu-light {
            background: rgb(247, 247, 247);
            width: 258px !important;
        }
        .ivu-menu {
            color: rgb(100, 147, 135);
        }
        //hover 颜色
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item:hover,
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-submenu-title:hover {
            // background: #35d3af !important;
            background: rgb(210, 210, 210) !important;
            color: rgb(100, 147, 135);
        }
        // 二级菜单头部颜色
        &
            /deep/.ivu-menu-light.ivu-menu-vertical
            .ivu-menu-opened
            .ivu-menu-submenu-title {
            // background: #00a680 !important;
            background: rgb(247, 247, 247) !important;
        }
        // 二级菜单背景色
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-opened {
            // background: rgb(232, 232, 232) !important;
        }
        //二级菜单选中颜色
        .ivu-menu-light.ivu-menu-vertical
            .ivu-menu-submenu
            .ivu-menu-item-active,
        .ivu-menu-light.ivu-menu-vertical
            .ivu-menu-submenu
            .ivu-menu-item-active:hover {
            background: rgb(210, 210, 210) !important;
            color: rgb(100, 147, 135);
        }
        .ivu-menu-light.ivu-menu-vertical
            .ivu-menu-item-active:not(.ivu-menu-submenu) {
            background: rgb(210, 210, 210) !important;
            color: rgb(100, 147, 135);
        }
        //选中的右边框线
        .ivu-menu-light.ivu-menu-vertical
            .ivu-menu-item-active:not(.ivu-menu-submenu):after {
            display: none;
        }
        .ivu-menu-vertical.ivu-menu-light:after {
            display: none;
        }
        // logo
    }
}
</style>
