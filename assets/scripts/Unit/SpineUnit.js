/*
 * @Description: In User Settings Edit
 * @Author: mengjl
 * @Date: 2019-05-09 08:49:57
 * @LastEditors: mengjl
 * @LastEditTime: 2019-07-03 14:12:24
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setSpine();
    },

    start () {
        
    },

    setSpine()
    {
        if (this.m_spine == null) {
            this.m_spine = this.node.getComponent(sp.Skeleton);
            this.m_spine.setCompleteListener(this.playComplete.bind(this));
            this.m_spine.setStartListener(this.playStart.bind(this));
            this.m_spine.setEndListener(this.playEnd.bind(this));
            this.m_spine.setEventListener(this.playEvent.bind(this));
            this.m_aniEvent = null;

            this.m_timeScale = this.m_spine.timeScale;
            this.m_currentSkin = 'default';
            this.m_currentAni = '';
        }
    },
    
    setSkeletonData(data){
        this.node.getComponent(sp.Skeleton).skeletonData = data;
    },

    getAnimationName()
    {
        return this.m_spine.animation;
    },

    play(data)
    {
        this.setSpine();

        if (data.hasOwnProperty('skin')) {
            this.m_spine.setSkin(data.skin);
            this.m_currentSkin = data.skin;
        }

        if (data.hasOwnProperty('pos')) {
            this.node.setPosition(cc.v2(data.pos.x, data.pos.y));
        }

        if (data.hasOwnProperty('scale')) {
            this.node.setScale(data.scale);
        }

        if (data.hasOwnProperty('timeScale')) {
            this.m_spine.timeScale = data.timeScale;
        }

        // if (data.hasOwnProperty('trackIndex') && data.hasOwnProperty('name') && data.hasOwnProperty('loop')) {
        //     this.m_spine.setAnimation(data.trackIndex, data.name, data.loop);
        //     this.m_currentAni = data.name;
        // }

        if (data.hasOwnProperty('name')) {
            var trackIndex = 0;
            if (data.hasOwnProperty('trackIndex')) {
                trackIndex = data.trackIndex;
            }

            var loop = true;
            if (data.hasOwnProperty('loop')) {
                loop = data.loop;
            }

            // console.log(typeof data.name);
            
            if (typeof data.name == 'string') {
                this.m_spine.setAnimation(trackIndex, data.name, loop);
                this.m_currentAni = data.name;
            } else {

                this.m_currentAni = '';
                var index = 0;
                var max_count = 0;
                for (const key in data.name) {
                    if (data.name.hasOwnProperty(key)) {
                        max_count++;
                    }
                }

                if (max_count > 0) {
                    max_count--;
                }

                // console.log('max_count', max_count);
                for (const key in data.name) {
                    if (data.name.hasOwnProperty(key)) {
                        const element = data.name[key];
                        // console.error(element, index)
                        if (index == 0) {
                            this._setAni(trackIndex, element, false);
                        }
                        else if (index != max_count)
                        {
                            this._addAni(trackIndex, element, false);
                        }
                        else if (index == max_count)
                        {
                            this._addAni(trackIndex, element, loop);
                        }
                        index++;
                    }
                }
            }
        }

        // 清理监听
        this.m_aniEvent = null;
        if (data.hasOwnProperty('aniEvent')) {
            this.m_aniEvent = data.aniEvent;
        }
    },

    _findAni(name)
    {
        if (this.m_spine == null) {
            return false;
        }
        var ani = this.m_spine.findAnimation(name);
        // console.log(name, ani);
        return ani != null;
    },

    _mixAni(from, to, delay)
    {
        if (this._findAni(from) && this._findAni(to)) {
            this.m_spine.setMix(from, to, delay);
        }
    },

    _setAni(trackIndex, name, loop)
    {
        this._mixAni(this.m_currentAni, name, 0.1);
        this.m_currentAni = name;
        this.m_spine.setAnimation(trackIndex, name, loop);
    },

    _addAni(trackIndex, name, loop)
    {
        // console.log(trackIndex, name, loop)
        this._mixAni(this.m_currentAni, name, 0.1);
        this.m_currentAni = name;
        this.m_spine.addAnimation(trackIndex, name, loop);
    },

    // 暂停
    pause()
    {
        // this.m_timeScale = this.m_spine.timeScale;
        // this.m_spine.timeScale = 0;
        this.m_spine.paused = true;
    },

    // 继续
    resume()
    {
        this.m_spine.paused = false;
        // this.m_spine.timeScale = this.m_timeScale;
    },

    playComplete()
    {
        // console.log('playComplete', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Complete'); }
    },

    playStart()
    {
        // console.log('playStart', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Start'); }
    },

    playEvent()
    {
        // console.log('playEvent', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Event'); }
    },

    playEnd()
    {
        // console.log('playEnd', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'End'); }
    },

    // update (dt) {},
});
