/*
 * @Description: In User Settings Edit
 * @Author: mengjl
 * @Date: 2019-07-10 14:33:08
 * @LastEditors: mengjl
 * @LastEditTime: 2019-07-10 14:37:57
 */

let EventDispatcher = require("EventDispatcher")

var Global = cc.Class({
    // extends: cc.Component,
    // statics: {
        ip:"",
        ws:null,
        isPinging:false,
        idInterval:null,
        timeTest:null,

        connect:function(fnConnect,fnError, fnClose) {
            console.log("connect");
            var self = this;
            console.log("ip:",self.ip);
            self.ws = new WebSocket(self.ip);
            self.ws.onopen = function() { 
                self.connected = true;
                console.log( '[ws] connected' ); 
                fnConnect();
            };
            self.ws.onmessage = function (evt)
            {   
                var msg = evt.data;
                self.dispatcherMsg(msg)
            };
            self.ws.onclose = function() 
            { 
                console.log( '[ws] Disconnected.' ) 
                self.close();
                if (fnClose){
                    fnClose(); 
                }
            };
            
            self.ws.onerror = function( evt )
            {
                self.ws = null;
                console.log( '[ws] Error,' , JSON.stringify( evt ) )
                var msg = evt.data;
                fnError(msg);
            };
        },

        sendEncryMsg:function(data){
            data = cc.Utils.reqMsgEncry(data);
            this.send(data);
        },
 
        send:function(data){
            if (this.ws == null || !this.connected) {
                cc.sy.hintBox.show("网络连接延迟,请稍后~");
                return;
            }
            // console.log(this.connected);
            if(this.connected == true){
                if(data != null && (typeof(data) == "object")){
                    data = JSON.stringify(data);
                }
                this.ws.send(data);
            }
        },
        
        close:function(){
            console.log("close");
            if(this.ws != null){
                if(this.connected == true){
                    this.connected = false;
                }
                this.ws.close(); 
                this.ws = null;
            }
            console.log("close finish");
        },
        addDispatch:function(fun, listenKey){
            // this._listenKey = GameMsgDef.MSGID;
            if (listenKey) {
                this._listenKey = listenKey;
            }
            EventDispatcher.listen(this._listenKey, fun);
        },

        dispatcherMsg:function(msg){
            if(typeof(msg) == "string" && msg != "data"){
	            msg = JSON.parse(msg);
            }
            EventDispatcher.dispatch(this._listenKey, msg);
        },
});