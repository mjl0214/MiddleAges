/*
 * @Description: 对话框遮罩
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-15 08:38:25
 * @LastEditTime: 2019-06-11 09:12:50
 */

 /**
 * _ooOoo_
 * o8888888o
 * 88" . "88
 * (| -_- |)
 *  O\ = /O
 * ___/`---'\____
 * .   ' \\| |// `.
 * / \\||| : |||// \
 * / _||||| -:- |||||- \
 * | | \\\ - /// | |
 * | \_| ''\---/'' | |
 * \ .-\__ `-` ___/-. /
 * ___`. .' /--.--\ `. . __
 * ."" '< `.___\_<|>_/___.' >'"".
 * | | : `- \`.;`\ _ /`;.`/ - ` : | |
 * \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 * `=---='
 *          .............................................
 *           佛曰：bug泛滥，我已瘫痪！
 */

let DialogMgr = require("DialogMgr")
let DialogDef = require("DialogDef")

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode : {
            default: null,
            type : cc.Node, 
            tooltip : "遮罩节点",
        },

        inputNode : {
            default: null,
            type : cc.Node,  
            tooltip : "穿透节点",
        },

        maskId : {
            default: -1,
            type : cc.Integer, 
            tooltip : "遮罩对话框ID",
            visible : false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onDestroy()
    {
        // console.error('DialogBase onDestroy', this)
        DialogMgr._removeMask(this);
    },

    setMaskId(maskId)
    {
        this.maskId = maskId;
    },

    getMaskId()
    {
        return this.maskId;
    },

    setMask(mask)
    {
        this.maskNode.active = mask;
    },

    setInput(input)
    {
        this.inputNode.active = input;
    },

    // update (dt) {},
});
