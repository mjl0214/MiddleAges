/*
 * @Description: 池节点可视化组件
 * @Author: mengjl
 * @LastEditors: megjl
 * @Date: 2019-04-12 08:51:20
 * @LastEditTime: 2019-04-12 14:30:09
 */

let PoolDef = require('PoolDef');

cc.Class({
    extends: cc.Component,

    properties: {
        poolName : {
            default : PoolDef.default,
            type : PoolDef,
            tooltip : '预制体池名字',
            visible() {
                return (this.custom == false);
            },
        },

        poolNameEx : {
            default : '',
            visible() {
                return (this.custom == true);
            },
            displayName : 'Pool Name',
        },

        custom : {
            default : false,
            tooltip : '自定义poolName',
        },

        poolNum : {
            default : 1,
            type : cc.Integer,
            tooltip : '预制体池初始化数量',
            // serializable: true, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log('name' + PoolDef[this.poolName]);
    },

    getPoolName()
    {
        if (this.custom == true) {
            return this.poolNameEx;
        }
        return PoolDef[this.poolName];
    },

    start () {

    },

    // update (dt) {},
});
