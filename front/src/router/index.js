import Vue from 'vue';
import Router from 'vue-router';
import errorShow from '@/views/errorShow';
import errorDtl from '@/views/errorDtl';
import checkProject from '@/views/checkProjectH5'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/errorShow'
        },
        {
            path: '/errorShow',
            name: 'errorShow',
            component: errorShow
        },
        {
            path: '/errorDtl',
            name: 'errorDtl',
            component: errorDtl
        },
        {
            path: '/checkProject',
            name: 'checkProject',
            component: checkProject
        }
    ]
});
