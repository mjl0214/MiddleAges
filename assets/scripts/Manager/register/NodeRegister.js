/*
 * @Description: 节点注册类
 * @Author: mengjl
 * @Date: 2019-06-27 09:01:49
 * @LastEditors: mengjl
 * @LastEditTime: 2019-06-27 10:36:52
 */

let NodeRegDef = require("NodeRegDef")
let NodeMgr = require("NodeMgr")

cc.Class({
    extends: cc.Component,

    properties: {
        node_reg_index : {
            default : NodeRegDef.unknown,
            type : cc.Enum(NodeRegDef),
            tooltip : '节点注册名字',

        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NodeMgr.registerNode(this);
    },

    start () 
    {
        // NodeMgr.registerNode(this);
    },

    onDestroy()
    {
        NodeMgr.unregisterNode(this);
    },

    _getNodeRegIndex()
    {
        return this.node_reg_index;
    },

    // update (dt) {},
});
