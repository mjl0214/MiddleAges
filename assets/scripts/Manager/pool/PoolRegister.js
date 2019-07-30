/*
 * @Description: 预制体注册类(挂到节点上用于初始化需要的预制体, 预制体节点上要挂上 PoolUnit 组件)
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-12 08:51:20
 * @LastEditTime: 2019-07-30 11:20:07
 */

let PoolManager = require("PoolManager");
let PoolDef = require('PoolDef');

cc.Class({
    extends: cc.Component,

    properties: {
        autoDestroy : {
            // ATTRIBUTES:
            default: true,
            // type: cc.Boolean,
            tooltip : '是否自动销毁',
            serializable: true, 
        },

        loadLog : {
            // ATTRIBUTES:
            default: false,
            // type: cc.Boolean,
            tooltip : '加载预制体日志',
            serializable: true, 
        },

        prefabList : {
            // ATTRIBUTES:
            default: [],
            type: [cc.Prefab],
            tooltip : '预制体列表',
            serializable: true, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.isLog = 1;
        this._poolNameList = new Array();
        this._register();

        // console.log(PoolDef[PoolDef.pool_plane]);
    },

    start () {
        // 使用的时候，去预制体的PoolUnit脚本中，查看节点池的名字！
    },

    onDestroy()
    {
        if (this.autoDestroy == true) {
            this._unregister();
        }
        else
        {
            this._error_('预制体还没有被销毁');
        }
    },

    // 向PoolManager中注册预制体
    _register()
    {
        console.log('PoolRegister Enter');

        this._poolNameList.length = 0;
        var poolName = null;
        for (let index = 0; index < this.prefabList.length; index++) {
            const prefab = this.prefabList[index];
            if (prefab == undefined || prefab == null) {
                console.error('[' + index + ']预制体不存在');
                this._poolNameList.push('');
                continue;
            }
            var poolUnit = prefab.data.getComponent('PoolUnit');

            if (poolUnit == null || poolUnit == undefined) {
                console.error('[' + index + ']预制体没有挂 PoolUnit 脚本');
                this._poolNameList.push('');
                continue;
            }

            poolName = poolUnit.getPoolName();
            if (poolName == null || poolName == undefined) {
                console.error('[' + index + ']预制体没有节点池名字');
                this._poolNameList.push('');
                continue;
            }

            var idx = this._poolNameList.indexOf(poolName);
            if (idx == -1) {
                PoolManager.initPool(poolName, prefab, poolUnit.poolNum);
                var collect = PoolManager.getCollect(poolName);
                // this._log_('加载[' + poolName + ']预制体, 数量[' + poolUnit.poolNum + ']');
                this._log_('load[%s]', poolName, collect);
            } else {
                console.error('[' + index + ']预制体[' + poolName + ']与之前的预制体[' + idx + ']重名');
            }
            this._poolNameList.push(poolName);
        }
    },

    // 向PoolManager中注销预制体
    _unregister ()
    {
        console.log('PoolRegister Leave');

        var poolName = '';
        for (let index = 0; index < this.prefabList.length; index++) {
            const prefab = this.prefabList[index];
            if (prefab.isValid == false) {
                continue;
            }
            var poolUnit = prefab.data.getComponent('PoolUnit');
            if (poolUnit) {
                poolName = poolUnit.getPoolName();
                PoolManager.clearPool(poolName);
                var collect = PoolManager.getCollect(poolName);
                this._log_('clear[%s]', poolName, collect);
            }
        }
    },

    _log_:function(message, ...p)
    {
        if (this.loadLog == true) {
            console.log(message, ...p);
        }
    },

    _error_:function(message, ...p)
    {
        if (this.loadLog == true) {
            console.error(message, ...p);
        }
    },

    _warn_:function(message, ...p)
    {
        if (this.loadLog == true) {
            console.warn(message, ...p);
        }
    },

    // update (dt) {},
});
