/**
 * 事件驱动
 */

var EventDispatcher = module.exports;

// 事件列表
EventDispatcher.events = {};

/**
 * 监听事件
 * @param  {[type]} type   [description]
 * @param  {[type]} listen [description]
 * @return {[type]}        [description]
 */
EventDispatcher.listen = function (type, listen) {
	if (type == null || type == undefined) {
		console.error('listen type is null');
	}
	var event = this.events[type];
	if(!event){
		event = [];
		this.events[type] = event;
	}
	event.push(listen);
	return listen;
	//console.log('监听一个事件 type=', type, 'listen=', listen);
};

/**
 * 派发事件
 * @param  {[type]} type [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
EventDispatcher.dispatch = function(type, data){
	var event = this.events[type];
	if(event){
		for (var i = 0; i < event.length; i++) {
			event[i](data);
		}
	}
};

/**
 * 删除一个事件
 * @param  {[type]} type   [description]
 * @param  {[type]} listen [description]
 * @return {[type]}        [description]
 */
EventDispatcher.remove = function(type, listen){
	var event = this.events[type];
	if(event){
		for (var i = 0; i < event.length; i++) {
			if(event[i] === listen){
				event.splice(i,1);
				//console.log('删除一个事件 type=', type, 'listen=', listen);
				break;
			}
		}
	}
};

/**
 * 删除一个类型下的所有事件
 * @param  {[type]} type   [description]
 * @return {[type]}        [description]
 */
EventDispatcher.removeAll = function(type){
	var event = this.events[type];
	if(event){
		event.length = 0;
	}
};

EventDispatcher.print = function(){
	console.log('events:',this.events);
};