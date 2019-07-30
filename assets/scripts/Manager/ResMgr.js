/*
 * @Description: In User Settings Edit
 * @Author: mengjl
 * @Date: 2019-07-17 16:12:48
 * @LastEditors: mengjl
 * @LastEditTime: 2019-07-30 17:01:09
 */

cc.Class({

    name : 'ResMgr',

    properties: {
        m_loadResQueue : new Array(),   // 要加载的文件列表
        m_loadAmount : 0,
        m_completeFunc : null,
        m_progressFunc : null,
    },

    init()
    {
        setInterval(() => {
            this.gc();
        }, 10000);
    },

    clearQueue()
    {
        this.m_loadResQueue.length = 0;
    },

    loadRes(completeFunc, progressFunc)
    {
        // this.printResCount();
        this.m_completeFunc = completeFunc;
        this.m_progressFunc = progressFunc;

        if (this.m_loadResQueue.length <= 0) {
            if (this.m_progressFunc) {
                this.m_progressFunc(1);
            }
            if (this.m_completeFunc) {
                this.m_completeFunc();
            }
            return;
        }

        this.m_loadAmount = 0;
        this._load();
    },

    addRes(url, type = cc.Asset)
    {
        if (url == undefined || url == null ) {
            console.error('load resource url is null')
            return;
        }

        this.m_loadResQueue.push({url : url, type : type, });
    },

    getRes(url, type = cc.Asset)
    {
        return cc.loader.getRes(url, type);
    },

    getConfig(filename)
    {
        var res = this.getRes(filename);
        if (res) {
            return res.json;
        }
        return null;
    },

    getSkelData(filename)
    {
        return this.getRes(filename, sp.SkeletonData);
    },

    getAtlas(filename)
    {
        return this.getRes(filename, cc.SpriteAtlas);
    },

    getAtlasFrame(atlasName, frameName)
    {
        var atlas = this.getAtlas(atlasName);
        if (atlas) {
            return atlas.getSpriteFrame(frameName);
        }
        return null;
    },

    getFont(filename)
    {
        return this.getRes(filename, cc.Font);
    },

    //获取图集资源
    getSpriteByAtlas(atlas, name) 
    {
        return this.getAtlasFrame(atlas, name);
    },

    _checkComplete()
    {
        if (this.m_progressFunc) {
            this.m_progressFunc(this.m_loadAmount / this.m_loadResQueue.length);
        }
        if (this.m_loadAmount >= this.m_loadResQueue.length) {
            if (this.m_completeFunc) {
                this.m_completeFunc();
            }
            // this.printResCount();
        }
        else
        {
            this._load();
        }
    },

    gc()
    {
        // console.log('gc');
        cc.sys.garbageCollect();
    },

    removeAssetArr(urlarr)
    {
        if (Array.isArray(urlarr)) {
            for (let index = 0; index < urlarr.length; index++) {
                const url = urlarr[index];
                this.removeAsset(url);
            }
        } 
        else if (urlarr)
        {
            for (const url in urlarr) {
                this.removeAsset(url, urlarr[url]);
            }
        }
    },

    removeSpriteAtlasArr(urlarr)
    {
        if (Array.isArray(urlarr)) {
            for (let index = 0; index < urlarr.length; index++) {
                const url = urlarr[index];
                this.removeAsset(url, cc.SpriteAtlas);
            }
        } 
        else if (urlarr)
        {
            for (const url in urlarr) {
                if (urlarr[url] == cc.SpriteAtlas) {
                    this.removeAsset(url, cc.SpriteAtlas);
                }
                
            }
        }
    },

    removeAsset(url, type = cc.Asset)
    {
        this._removeItem(url);
        var item = cc.loader.getRes(url);
        if (item) {
            cc.loader.release(item.url);
        }
        cc.loader.releaseRes(url, type);
    },

    _removeItem(url)
    {
        var deps = cc.loader.getDependsRecursively(url);
        // console.log(deps);
        var caches = cc.loader['_cache'];
        for (const id in caches) {
            const item = caches[id];
            if (item == null) {
                continue;
            }

            if (item.dependKeys == null) {
                continue;
            }

            for (let index = 0; index < item.dependKeys.length; index++) {
                const dependKey = item.dependKeys[index];
                // console.log(deps.indexOf(dependKey))
                if (deps.indexOf(dependKey) != -1) {
                    cc.loader.release(item.url);
                    break;
                }
            }
        }
    },

    printResCount()
    {
        console.log('getResCount', cc.loader.getResCount());
        // console.log(cc.loader._cache);
    },

    _load()
    {
        const resInfo = this.m_loadResQueue[this.m_loadAmount];
        var url = resInfo.url;
        var type = resInfo.type;

        // console.log(cc.loader.getRes(url, type))
        var res = cc.loader.getRes(url, type);
        if (res) {
            this.m_loadAmount++;
            this._checkComplete();
            return;
        }

        cc.loader.loadRes(url, type, (err, obj) => {
            if(err){
                console.error("load " + url + "--->", err);
            }
            else{
                this.m_loadAmount++;
                this._checkComplete();
            }
        });
    },

    haveQuote(url)
    {
        var deps = cc.loader.getDependsRecursively(url);
        // console.log(deps);
        var caches = cc.loader['_cache'];
        for (const id in caches) {
            const item = caches[id];
            if (item == null) {
                continue;
            }

            if (item.dependKeys == null) {
                continue;
            }

            for (let index = 0; index < item.dependKeys.length; index++) {
                const dependKey = item.dependKeys[index];
                // console.log(deps.indexOf(dependKey))
                if (deps.indexOf(dependKey) != -1) {
                    return true;
                }
            }
        }
        return false;
    },

    findAllRes()
    {
        var results = [];
        var caches = cc.loader['_cache'];
        for (const id in caches) {
            const item = caches[id];
            if (item) {
                if (item.type == 'png' || item.type == 'webp' || item.type == 'jpg') {
                    results.push(item);
                }
            }
        }

        if (this.m_lastfind == null) {
            this.m_lastfind = results;
        }
        else
        {
            var diff = [];
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                if (this.m_lastfind.indexOf(element) == -1) {
                    diff.push(element)
                }
            }
            this.m_lastfind = results;
            console.error(diff);
        }

        return results;
    },

    findUnsedRes()
    {
        var results = [];
        var caches = cc.loader['_cache'];
        for (const id in caches) {
            const item = caches[id];
            if (item == null) {
                continue;
            }

            // console.log(item)
            if (this.haveQuote(item.url) == false) {
                if (item.type == 'png' || item.type == 'webp' || item.type == 'jpg') {
                    results.push(item.url);
                }
                // console.log(item)
            }
        }
        return results;
    },

});