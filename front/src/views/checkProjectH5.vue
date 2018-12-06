/* h5页面的
* @Author: c.y
* @Date: 2018-09-29
* @Last Modified by: c.y
* @Last Modified time: 2018-09-29
*/



<template>
    <div class='check-project'>
        <Card :title="projectItem.projectName" icon="ios-options" :padding="0"
              v-for="(projectItem, index) in  projectList"
              :key="index">
            <CellGroup>
                <Cell title="接口是否正常">
                    <span slot="extra">
                        <Icon type="ios-checkmark-circle" v-if="projectItem.apiStatus" size="30" color="#19be6b"/>
                        <Icon type="ios-close-circle" v-else size="30" color="#ed4014"/>
                    </span>
                </Cell>
                <Cell title="静态资源是否正常">
                    <span slot="extra">
                        <Icon type="ios-checkmark-circle" v-if="projectItem.staticStatus" size="30" color="#19be6b"/>
                        <Icon type="ios-close-circle" v-else size="30" color="#ed4014"/>
                    </span>
                </Cell>
            </CellGroup>
        </Card>
        <!--短信验证码-->
        <Form :label-width="80">
            <FormItem label="手机号：">
                <Input v-model="mblNo" :maxlength="11" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="验证短信：">
                <Button type="primary" @click="handleVerCode">提交</Button>
            </FormItem>
        </Form>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    import md5 from 'md5';
    export default {
        name: '',
        data() {
            return {
                spinShow: false,
                // 验证码
                projectList: [
                ],
                mblNo: '', // 电话号码
            };
        },
        methods: {
            // 验签
            loginSign (mblNo) {
                let anonySign = `jttech_ver_code_sign_75a7_${mblNo}_getVerCode`;
                return md5(anonySign);
            },
            // 需要验证码的接口
            handleVerCode() {
                let _this = this;
                if (!/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.mblNo)) {
                    this.$Message.success('请输入正确的手机号');
                    return false;
                }
                this.$http
                    .post('/frontLogApi/checkVerCode', {
                        mblNo: this.mblNo,
                        verCodeType: 0,
                        chanNo: 100,
                        areaCode: '510100',
                        anonySign: this.loginSign(this.mblNo)
                    })
                    .then(res => {
                        _this.$Message.success('短信服务正常');
                    })
                    .catch(function (err) {
                        Promise.reject(err).catch((error) => {
                            _this.$Message.error(error.response.data.errMsg);
                        });

                    });
            },
            init() {
                let _this = this;
                this.spinShow = true;
                this.$http
                    .post('/frontLogApi/checkProject', {
                    })
                    .then(res => {
                        _this.projectList = res.data;
                        this.spinShow = false;
                    })
                    .catch(function (err) {
                        Promise.reject(err).catch((error) => {
                            this.spinShow = false;
                            _this.$Message.error(error.response.data.errMsg);
                        });

                    });
            },
        },
        created() {
            this.init();
        }
    };
</script>

<style lang='less' scoped>
    .check-project {
        .ivu-form {
            padding-right: 20px;
        }
        .ivu-cell {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .ivu-card {
            margin-bottom: 10px;
        }
    }
</style>

