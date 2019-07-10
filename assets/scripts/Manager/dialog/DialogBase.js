/*
 * @Description: 对话框基类
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-15 08:38:25
 * @LastEditTime: 2019-06-15 17:04:00
 */

 /**
 *                    _ooOoo_
 *                   o8888888o
 *                   88" . "88
 *                   (| -_- |)
 *                    O\ = /O
 *                ____/`---'\____
 *              .   ' \\| |// `.
 *               / \\||| : |||// \
 *             / _||||| -:- |||||- \
 *               | | \\\ - /// | |
 *             | \_| ''\---/'' | |
 *              \ .-\__ `-` ___/-. /
 *           ___`. .' /--.--\ `. . __
 *        ."" '< `.___\_<|>_/___.' >'"".
 *       | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *         \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 *                    `=---='
 *
 * .............................................
 *                 GOD BLESS YOU
 */

let DialogMgr = require("DialogMgr")
let DialogDef = require("DialogDef")

cc.Class({
    extends: cc.Component,

    properties: {
        dialog_id : {
            default: DialogDef.DialogID.dialog_unknown,
            type : cc.Enum(DialogDef.DialogID), 
            tooltip : "对话框ID",
        },

        isMask : {
            default: true,
            tooltip : "显示遮罩",
        },

        isInput : {
            default: true,
            tooltip : "不可穿透",
        },

        __maskId__ : {
            default: -1,
            type : cc.Integer, 
            tooltip : "遮罩对话框ID",
            visible : false,
        },

        single : {
            default: false,
            tooltip : "单一",
        },

        open_animation : {
            default: DialogDef.DialogAnimation.no_animation,
            type : cc.Enum(DialogDef.DialogAnimation), 
            tooltip : "对话框打开动画",
            notify() {
                if (this.same_animation == true) {
                    this._setSameAnimation();
                }
            },
        },

        close_animation : {
            default: DialogDef.DialogAnimation.no_animation,
            type : cc.Enum(DialogDef.DialogAnimation), 
            tooltip : "对话框关闭动画",
        },

        same_animation : {
            default: false,
            tooltip : "打开和关闭是否使用相同动画",
            notify() {
                this._setSameAnimation();
            },
        },

        random_animation : {
            default: false,
            tooltip : "随机动画",
        },

        poolNum : {
            default: 1,
            type : cc.Integer, 
            tooltip : "初始化数量",
            visible : false,
        },

        __state__ : {
            default: DialogDef.DialogState.closed,
            type : cc.Enum(DialogDef.DialogState), 
            tooltip : "对话框状态(-1关闭,0打开中,1打开,2关闭中)",
            visible : false,
        },

        __disappear_model__ : {
            default: DialogDef.DialogModel.destory,
            type : cc.Enum(DialogDef.DialogModel), 
            tooltip : "对话框模式(0毁灭模式,1神隐模式)",
            visible : false,
        },

        riginal_scale : {
            default: 1,
            type : cc.Float, 
            tooltip : "对话框原始尺寸",
            visible : false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.riginal_scale = this.node.scale;
    },

    onDestroy()
    {
        // console.error('DialogBase onDestroy', DialogDef.DialogID[this.dialog_id]);
        DialogMgr._removeDialog(this);
    },

    // start () {

    // },

    // update (dt) {},

    onEnter(params)
    {// 对话框被激活时
        console.log('DialogBase onEnable');
    },

    onLeave()
    {// 对话框被关闭时
        console.log('DialogBase onDisable');
    },

    _getDialogModel()
    {
        // console.log(this.__disappear_model__)
        return this.__disappear_model__;
    },

    setMaskId(maskId)
    {
        this.__maskId__ = maskId;
    },

    getMaskId()
    {
        return this.__maskId__;
    },

    getIsMask()
    {
        return this.isMask;
    },

    getIsInput()
    {
        return this.isInput;
    },

    _setState(state)
    {
        this.__state__ = state;
        this.stateEvent(this.__state__);
    },

    stateEvent(eventid)
    {

    },

    setDialogZIndex(zIndex)
    {
        DialogMgr.setDialogZIndex(this, zIndex);
    },

    _setSameAnimation()
    {
        this.close_animation = this.open_animation;
    },

    getDialogName()
    {
        return DialogDef.DialogID[this.dialog_id];
    },

    closeDialog()
    {
        // 两种关闭方式
        DialogMgr.closeDialog(this);
        // DialogMgr.closeDialog(this.dialog_id);
    },

    _closeByMgr()
    {
        this._setState(DialogDef.DialogState.closed);
        DialogMgr._closeDialog(this);
    },

    _getRandom(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    playOpenAni()
    {
        var open_animation = this.open_animation;
        // console.log(DialogDef.DialogAnimation)
        if (this.random_animation == true) {
            var index = this._getRandom(0, DialogDef.DialogAnimation.__enums__.length - 1);
            open_animation = DialogDef.DialogAnimation.__enums__[index].value;
            // console.log(open_animation);
        }
        // console.error(this.riginal_scale, this.node.active);
        switch (open_animation) {
            case DialogDef.DialogAnimation.no_animation:
                this._setState(DialogDef.DialogState.opened);
                break;
            case DialogDef.DialogAnimation.ease_back_out:
                this._playOpenScaleAni();
                break;
            case DialogDef.DialogAnimation.left_to_right:
                this._playOpenLTRAni();
                break;
            case DialogDef.DialogAnimation.right_to_left:
                this._playOpenRTLAni();
                break;
            case DialogDef.DialogAnimation.top_to_down:
                this._playOpenTTDAni();
                break;
            case DialogDef.DialogAnimation.down_to_top:
                this._playOpenDTTAni();
                break;
            case DialogDef.DialogAnimation.rotate_to_centre:
                this._playOpenRTCAni();
                break;
            case DialogDef.DialogAnimation.fade_to_centre:
                this._playOpenFTCAni();
                break;
            case DialogDef.DialogAnimation.fall_to_centre:
                this._playOpenFallAni();
                break;
            case DialogDef.DialogAnimation.jump_to_centre:
                this._playOpenJumpAni();
                break;
            case DialogDef.DialogAnimation.skew_to_centre:
                this._playOpenSkewAni();
                break;
            case DialogDef.DialogAnimation.flip_to_centre:
                this._playOpenFlipAni();
                break;
            // todo
            default:
                this._setState(DialogDef.DialogState.opened);
                break;
        }
    },

    /**
     * @description: A Million Ways to Die in the West
     * @param {null} 
     * @return: null
     */
    playCloseAni()
    {
        var close_animation = this.close_animation;
        if (this.random_animation == true) {
            var index = this._getRandom(0, DialogDef.DialogAnimation.__enums__.length - 1);
            close_animation = DialogDef.DialogAnimation.__enums__[index].value;
        }
        switch (close_animation) {
            case DialogDef.DialogAnimation.no_animation:
                this._closeByMgr();
                break;
            case DialogDef.DialogAnimation.ease_back_out:
                this._playCloseScaleAni();
                break;
            case DialogDef.DialogAnimation.left_to_right:
                this._playCloseLTRAni();
                break;
            case DialogDef.DialogAnimation.right_to_left:
                this._playCloseRTLAni();
                break;
            case DialogDef.DialogAnimation.top_to_down:
                this._playCloseTTDAni();
                break;
            case DialogDef.DialogAnimation.down_to_top:
                this._playCloseDTTAni();
                break;
            case DialogDef.DialogAnimation.rotate_to_centre:
                this._playCloseRTCAni();
                break;
            case DialogDef.DialogAnimation.fade_to_centre:
                this._playCloseFTCAni();
                break;
            case DialogDef.DialogAnimation.fall_to_centre:
                this._playCloseFallAni();
                break;
            case DialogDef.DialogAnimation.jump_to_centre:
                this._playCloseJumpAni();
                break;
            case DialogDef.DialogAnimation.skew_to_centre:
                this._playCloseSkewAni();
                break;
            case DialogDef.DialogAnimation.flip_to_centre:
                this._playCloseFlipAni();
                break;
            // todo
            default:
                this._closeByMgr();
                break;
        }
    },

    //-------------------------- ease_back_out --------------------------//
    _playOpenScaleAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 0;
        var action = cc.sequence(cc.scaleTo(0.5, this.riginal_scale).easing(cc.easeBackOut()), cc.callFunc((target) => {
            this._setState(DialogDef.DialogState.opened);
        }));

        this.node.runAction(action);
    },

    _playCloseScaleAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(cc.scaleTo(0.2, 0), cc.callFunc((target) => {
            this.node.scale = this.riginal_scale;
            this._closeByMgr();
        }));

        this.node.runAction(action);
    },

    _commonMoveAniOpen(scaleX, scaleY)
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        // var action = cc.sequence(cc.place(cc.v2(scaleX * cc.winSize.width / 2, scaleY * cc.winSize.height / 2)), 
        //     cc.moveTo(0.5, cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)).easing(cc.easeBackOut()), 
        //     cc.callFunc((target) => {
        //         this._setState(DialogDef.DialogState.opened);
        //     })
        // );
        var action = cc.sequence(cc.place(cc.v2(scaleX * cc.winSize.width, scaleY * cc.winSize.height)), 
            cc.moveTo(0.5, cc.v2(0, 0)).easing(cc.easeBackOut()), 
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _commonMoveAniClose(scaleX, scaleY)
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(cc.moveTo(0.2, cc.v2(scaleX * cc.winSize.width, scaleY * cc.winSize.height)), 
            cc.callFunc((target) => {
                this._closeByMgr();
            })
        );

        this.node.runAction(action);
    },

    //-------------------------- left_to_right --------------------------//
    _playOpenLTRAni()
    {
        this._commonMoveAniOpen(-2, 0);
    },

    _playCloseLTRAni()
    {
        this._commonMoveAniClose(-2, 0);
    },

    //-------------------------- right_to_left --------------------------//
    _playOpenRTLAni()
    {
        this._commonMoveAniOpen(2, 0);
    },

    _playCloseRTLAni()
    {
        this._commonMoveAniClose(2, 0);
    },

    //-------------------------- top_to_down --------------------------//
    _playOpenTTDAni()
    {
        this._commonMoveAniOpen(0, 2);
    },

    _playCloseTTDAni()
    {
        this._commonMoveAniClose(0, 2);
    },

    //-------------------------- down_to_top --------------------------//
    _playOpenDTTAni()
    {
        this._commonMoveAniOpen(0, -2);
    },

    _playCloseDTTAni()
    {
        this._commonMoveAniClose(0, -2);
    },

    //-------------------------- rotate_to_centre --------------------------//
    _playOpenRTCAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 0;
        // console.error(this.riginal_scale, this.node.active);
        var action = cc.sequence(cc.spawn(cc.scaleTo(0.5, this.riginal_scale), cc.rotateBy(0.5, 360*2)), 
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _playCloseRTCAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(cc.spawn(cc.scaleTo(0.5, 0), cc.rotateBy(0.5, 360*2)), cc.callFunc((target) => {
            this.node.scale = this.riginal_scale;
            this._closeByMgr();
        }));

        this.node.runAction(action);
    },

    //-------------------------- fade_to_centre --------------------------//
    _playOpenFTCAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.opacity = 0;
        var action = cc.sequence(cc.fadeIn(0.5), 
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _playCloseFTCAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(cc.fadeOut(0.2), cc.callFunc((target) => {
            this.node.opacity = 255;
            this._closeByMgr();
        }));

        this.node.runAction(action);
    },

    //-------------------------- fall_to_centre --------------------------//
    _playOpenFallAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 5 * this.riginal_scale;
        var action = cc.sequence(cc.scaleTo(0.5, this.riginal_scale).easing(cc.easeBackOut()), cc.callFunc((target) => {
            this._setState(DialogDef.DialogState.opened);
        }));

        this.node.runAction(action);
    },

    _playCloseFallAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(cc.scaleTo(0.2, 5 * this.riginal_scale), cc.callFunc((target) => {
            this.node.scale = this.riginal_scale;
            this._closeByMgr();
        }));

        this.node.runAction(action);
    },

    //-------------------------- jump_to_centre --------------------------//
    _playOpenJumpAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 0;
        var action = cc.sequence(cc.place(cc.v2(-1 * cc.winSize.width, 2 * cc.winSize.height)),
            cc.spawn(
                cc.scaleTo(0.8, this.riginal_scale), 
                // cc.jumpTo(0.8, cc.v2(cc.winSize.width / 2, cc.winSize.height / 2), 200, 3)
                cc.jumpTo(0.8, cc.v2(0, 0), 200, 3)
            ), 
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _playCloseJumpAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.5, 0), 
                cc.jumpTo(0.5, cc.v2(-1 * cc.winSize.width, 3 * cc.winSize.height), 200, 3)
            ),
            cc.callFunc((target) => {
                this.node.scale = this.riginal_scale;
                this._closeByMgr();
            })
        );

        this.node.runAction(action);
    },

    //-------------------------- skew_to_centre --------------------------//
    _playOpenSkewAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 0;
        var action = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.5, this.riginal_scale), 
                cc.skewBy(0.5, 0, 360)
            ),
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _playCloseSkewAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.2, 0), 
                cc.skewBy(0.2, 0, 360)
            ),
            cc.callFunc((target) => {
                this.node.scale = this.riginal_scale;
                this._closeByMgr();
            })
        );

        this.node.runAction(action);
    },

    //-------------------------- flip_to_centre --------------------------//
    _playOpenFlipAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.opening);
        this.node.scale = 0;
        var action = cc.sequence(
            cc.scaleTo(0.1, 1, -1),
            cc.scaleTo(0.1, 1, 1),
            cc.scaleTo(0.1, 1, -1),
            cc.scaleTo(0.1, 1, 1),
            cc.callFunc((target) => {
                this._setState(DialogDef.DialogState.opened);
            })
        );

        this.node.runAction(action);
    },

    _playCloseFlipAni()
    {
        this.node.stopAllActions();
        this._setState(DialogDef.DialogState.closing);
        var action = cc.sequence(
            cc.scaleTo(0.1, 1, -1),
            cc.scaleTo(0.1, 1, 1),
            cc.scaleTo(0.1, 1, -1),
            cc.scaleTo(0.1, 0, 0),
            cc.callFunc((target) => {
                this.node.scale = this.riginal_scale;
                this._closeByMgr();
            })
        );

        this.node.runAction(action);
    },

});
