/*
 * @Description: 预制体池管理器
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-12 08:51:20
 * @LastEditTime: 2019-07-30 12:00:26
 */

module.exports = {
    _pools_ : {},

    // 初始化对象池
    initPool(poolname, prefab, num)
    {
        var poolObj = this._pools_[poolname];
        if (poolObj == null) {
            poolObj = new Object();
            poolObj.pool = new cc.NodePool();       // 对象池
            poolObj.prefab = prefab;                // 预制体
            poolObj.used = new Array();             // 被使用的预制体
            poolObj.collect = new Array();          // 收集信息

            this._pools_[poolname] = poolObj;
        }
        else
        {
            this.clearPool(poolname);
            poolObj.prefab = prefab;
            poolObj.collect = new Array();
        }
        
        let initCount = num;
        for (let i = 0; i < initCount; ++i) {
            let _prefab_ = cc.instantiate(poolObj.prefab); // 创建节点
            poolObj.pool.put(_prefab_); // 通过 putInPool 接口放入对象池
        }

        var deps = cc.loader.getDependsRecursively(poolObj.prefab);
        // console.log(deps);
        for (let index = 0; index < deps.length; index++) {
            for (let i = 0; i < initCount; i++) {
                this._addQuote(deps[index]);
            }
        }

        this._collect(poolname, 'init');
    },

    // 获得对象
    getPerfab(poolname)
    {
        if (this._pools_[poolname] == null) {
            return null;
        }

        let _prefab_ = this._pools_[poolname].pool.get();
        if (_prefab_ == null) {
            _prefab_ = cc.instantiate(this._pools_[poolname].prefab); // 创建节点
            this._collect(poolname, 'new');
        }

        this._pools_[poolname].used.push(_prefab_);
        this._collect(poolname, 'get');
        return _prefab_;
    },

    // 回收对象
    recoveryPerfab(poolname, prefab)
    {
        if (this._pools_[poolname] == null) {
            return null;
        }

        this._pools_[poolname].pool.put(prefab);

        for (let index = this._pools_[poolname].used.length - 1; index >= 0; index--) {
            const element = this._pools_[poolname].used[index];
            if (element === prefab) {
                this._pools_[poolname].used.splice(index, 1);
                break;
            }
        }

        this._collect(poolname, 'recovery');
    },

    // 回收对象
    recoveryUnit(prefab)
    {
        var poolUnit = prefab.getComponent('PoolUnit');
        if (poolUnit == null || poolUnit == undefined) {
            console.error('预制体没有挂 PoolUnit 脚本，不能使用 PoolManager.recoveryUnitPerfab 回收');
            return;
        }

        this.recoveryPerfab(poolUnit.getPoolName(), prefab);
    },

    // 清理对象池
    clearPool(poolname)
    {
        var poolObj = this._pools_[poolname];
        if (poolObj && poolObj.prefab) {
            this._collect(poolname, 'clear');
            
            for (let index = 0; index < poolObj.used.length; index++) {
                const _prefab_ = poolObj.used[index];
                poolObj.pool.put(_prefab_);
            }
            
            poolObj.pool.clear();
            poolObj.used.length = 0;
            // 此处不能清理[收集器]里的内容，因为还要查看

            cc.loader.release(poolObj.prefab);
            poolObj.prefab = null;
            // console.error(poolname)
        }
    },

    // 获得正在使用的对象
    getUsedPerfab(poolname)
    {
        if (this._pools_[poolname] == null) {
            return new Array();
        }
        return this._pools_[poolname].used;
    },

    // 节点被场景直接销毁，所以要移出正在使用的列表
    removeUsedPerfab(poolname, prefab)
    {
        if (this._pools_[poolname] == null) {
            return null;
        }

        for (let index = this._pools_[poolname].used.length - 1; index >= 0; index--) {
            const element = this._pools_[poolname].used[index];
            if (element === prefab) {
                this._pools_[poolname].used.splice(index, 1);
                break;
            }
        }
    },

    getCollect(poolname)
    {
        if (this._pools_[poolname] == null) {
            return new Array();
        }
        return this._pools_[poolname].collect;
    },

    //----------------------------- 收集器 ----------------------------//

    _collect(poolname, type)
    {// type : 'init','get','recovery','clear','new'
        var poolObj = this._pools_[poolname];
        if (poolObj == null) {
            return;
        }

        // var collect = poolObj.collect;
        // poolObj = this._pools_[poolname];

        switch (type) {
            case 'init':
            {
                this._set_collect_(poolObj.collect, 'initCount', poolObj.pool.size());
                break;
            }
            case 'get':
            {
                var count = Number(this._get_collect_(poolObj.collect, 'getCount', 0));
                this._set_collect_(poolObj.collect, 'getCount', ++count);

                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);

                var count2 = Number(this._get_collect_(poolObj.collect, 'usedMax', 0));
                if (count2 < poolObj.used.length) {
                    count2 = poolObj.used.length;
                }
                this._set_collect_(poolObj.collect, 'usedMax', count2);
                break;
            }
            case 'new':
            {
                var count = Number(this._get_collect_(poolObj.collect, 'newCount', 0));
                this._set_collect_(poolObj.collect, 'newCount', ++count);
                break;
            }
            case 'recovery':
            {
                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);

                var count = Number(this._get_collect_(poolObj.collect, 'recCount', 0));
                this._set_collect_(poolObj.collect, 'recCount', ++count);
                break;
            }
            case 'clear':
            {
                this._set_collect_(poolObj.collect, 'poolCount', poolObj.pool.size());
                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);
                break;
            }
        
            default:
                break;
        }
    },

    _set_collect_(collect, key, value)
    {
        if (!collect.hasOwnProperty(key)) {
            collect[key] = value;
        }
        else {
            collect[key] = value;
        }
    },

    _get_collect_(collect, key, value)
    {
        if (!collect.hasOwnProperty(key)) {
            collect[key] = value;
        }
        return collect[key];
    },

    //----------------------------- 引用 ----------------------------//

    _addQuote(key)
    {
        if (this.m_quoteCache == null) {
            this.m_quoteCache = new Object();
        }

        if (this.m_quoteCache[key] == null) {
            this.m_quoteCache[key] = {count : 0};
        }
        this.m_quoteCache[key].count++;
    },

    _subQuote(key)
    {
        if (this.m_quoteCache == null) {
            this.m_quoteCache = new Object();
        }

        if (this.m_quoteCache[key]) {
            this.m_quoteCache[key].count--;
        }
    },

    _getQuoteInfo(key)
    {
        if (this.m_quoteCache == null) {
            this.m_quoteCache = new Object();
        }

        return this.m_quoteCache[key];
    },

    _deleteQuote(key)
    {
        // console.log(key, this.m_quoteCache[key]);
        if (this.m_quoteCache == null) {
            this.m_quoteCache = new Object();
        }
        if (this.m_quoteCache[key]) {
            delete this.m_quoteCache[key];
        }
    },
    
};
