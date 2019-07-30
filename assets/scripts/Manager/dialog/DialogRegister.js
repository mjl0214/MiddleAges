/*
 * @Description: 对话框注册类
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-18 16:52:16
 * @LastEditTime: 2019-07-30 11:20:22
 */

 /**
 *      ┌─┐       ┌─┐
 *   ┌──┘ ┴───────┘ ┴──┐
 *   │                 │
 *   │       ───       │
 *   │  ─┬┘       └┬─  │
 *   │                 │
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘
 *             GOD BLESS YOU
 */

let PoolManager = require("PoolManager")
let DialogMgr = require("DialogMgr")

cc.Class({
    extends: cc.Component,

    properties: {
        autoDestroy : {
            // ATTRIBUTES:
            default: false,
            // type: cc.Boolean,
            tooltip : '是否自动销毁',
            // readonly: true, 
        },

        loadLog : {
            // ATTRIBUTES:
            default: false,
            // type: cc.Boolean,
            tooltip : '注册日志',
            // serializable: true, 
        },

        maskPrefab : {
            // ATTRIBUTES:
            default: null,
            type: cc.Prefab,
            tooltip : '遮罩预制体',
            // serializable: true, 
        },

        prefabList : {
            // ATTRIBUTES:
            default: [],
            type: [cc.Prefab],
            tooltip : '预制体列表',
            // serializable: true, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._poolNameList = new Array();
        this._componetName = 'DialogBase'
        DialogMgr.m_maskPrefab = this.maskPrefab;
        this._register();
    },

    start () {
        // 使用的时候，去预制体的SkillComponent脚本中，查看节点池的名字！
    },

    onDestroy()
    {
        if (this.autoDestroy == true) {
            this._unregister();
        }
        else
        {
            this._warn_('预制体还没有被销毁');
        }

        // DialogMgr.clearAllMask();
    },

    // 向PoolManager中注册预制体
    _register()
    {
        console.log('DialogRegister Enter');

        this._poolNameList.length = 0;
        var poolName = null;
        for (let index = 0; index < this.prefabList.length; index++) {
            const prefab = this.prefabList[index];
            if (prefab == undefined || prefab == null) {
                console.error('[' + index + ']预制体不存在');
                this._poolNameList.push('');
                continue;
            }
            var poolUnit = prefab.data.getComponent(this._componetName);

            if (poolUnit == null || poolUnit == undefined) {
                console.error('[' + index + ']预制体没有挂' + this._componetName + ' 脚本');
                this._poolNameList.push('');
                continue;
            }

            poolName = poolUnit.getDialogName();
            if (poolName == null || poolName == undefined) {
                console.error('[' + index + ']预制体没有节点池名字');
                this._poolNameList.push('');
                continue;
            }

            // console.log('poolName', poolName)

            var idx = this._poolNameList.indexOf(poolName);
            if (idx == -1) {
                PoolManager.initPool(poolName, prefab, poolUnit.poolNum);

                // this._initialization(poolName);

                var collect = PoolManager.getCollect(poolName);
                this._log_('load[' + poolName + ']', collect);
            } else {
                console.error('[' + index + ']Dialog[' + poolName + ']与之前的Dialog[' + idx + ']重名');
            }
            this._poolNameList.push(poolName);
        }
    },

    // _initialization(poolName)
    // {
    //     var prefab = PoolManager.getPerfab(poolName);
    //     this.node.addChild(prefab);
    // },

    // 向PoolManager中注销预制体
    _unregister ()
    {
        console.log('DialogRegister Leave');

        var poolName = '';
        for (let index = 0; index < this.prefabList.length; index++) {
            const prefab = this.prefabList[index];
            if (prefab.isValid == false) {
                continue;
            }
            var poolUnit = prefab.data.getComponent(this._componetName);
            if (poolUnit) {
                poolName = poolUnit.getDialogName();
                PoolManager.clearPool(poolName);
                var collect = PoolManager.getCollect(poolName);
                this._log_('clear[' + poolName + ']', collect);
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
