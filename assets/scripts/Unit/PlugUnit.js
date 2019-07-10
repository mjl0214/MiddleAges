/*
 * @Description: In User Settings Edit
 * @Author: mengjl
 * @Date: 2019-07-06 16:11:11
 * @LastEditors: mengjl
 * @LastEditTime: 2019-07-08 13:48:02
 */


cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._init();
    },

    _init()
    {
        if (this.m_pulgList == null || this.m_pulgList == undefined) {
            this.m_pulgList = new Array();
        }
    },

    onDestroy()
    {
        this.clearPlug();
    },

    start () {

    },

    pushPlug(key, node)
    {
        this.node.addChild(node);
        this._init();
        this.m_pulgList.push({key : key, node : node});
    },

    getPlug(key)
    {
        this._init();
        for (let index = 0; index < this.m_pulgList.length; index++) {
            const element = this.m_pulgList[index];
            if (element.key == key) {
                return element.node;
            }
        }
        return null;
    },

    getAllPlug()
    {
        this._init();
        return this.m_pulgList;
    },

    removePlug(key)
    {
        this._init();
        for (let index = 0; index < this.m_pulgList.length; index++) {
            const element = this.m_pulgList[index];
            if (element.key == key) {
                var _node_ = element.node;
                this.m_pulgList.splice(index, 1);
                return _node_;
            }
        }
        return null;
    },

    clearPlug()
    {
        this._init();
        this.m_pulgList.length = 0;
    },

    // update (dt) {},
});
