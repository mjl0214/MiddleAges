/*
 * @Description: 注册节点管理类
 * @Author: mengjl
 * @Date: 2019-06-27 09:01:49
 * @LastEditors: mengjl
 * @LastEditTime: 2019-06-27 10:34:36
 */


module.exports = {
    m_nodelist : {},

    getOneNode(node_index)
    {
        // console.log(this.m_nodelist)
        var nodelist = this.getNodeList(node_index);
        for (let index = 0; index < nodelist.length; index++) {
            const reg_node = nodelist[index];
            return reg_node;
        }
        return null;
    },

    getNodeList(node_index)
    {
        var nodelist = this.m_nodelist[node_index];
        if (nodelist == null) {
            return new Array();
        }

        return nodelist;
    },

    _isHaveNode(reg_node)
    {
        var node_index = reg_node._getNodeRegIndex();
        var nodelist = this.m_nodelist[node_index];
        if (nodelist == null) {
            return false;
        }

        for (let index = 0; index < nodelist.length; index++) {
            const _reg_node_ = nodelist[index];
            if (_reg_node_ == reg_node) {
                return true;
            }
        }

        return false;
    },

    registerNode(reg_node)
    {
        if (this._isHaveNode(reg_node) == true) {
            return;
        }

        var node_index = reg_node._getNodeRegIndex();

        var nodelist = this.m_nodelist[node_index];
        if (nodelist == null) {
            nodelist = new Array();
            this.m_nodelist[node_index] = nodelist;
        }

        nodelist.push(reg_node);
    },

    unregisterNode(reg_node)
    {
        var node_index = reg_node._getNodeRegIndex();

        var nodelist = this.m_nodelist[node_index];
        if (nodelist == null) {
            return;
        }

        for (let index = 0; index < nodelist.length; index++) {
            const _reg_node_ = nodelist[index];
            if (_reg_node_ == reg_node) {
                nodelist.splice(index, 1);
                break;
            }
        }
    },

};
