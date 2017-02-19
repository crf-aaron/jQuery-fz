/**
 * Created by Administrator on 2017/2/17.
 */
(function (global) {
    var document = global.document,
        arr = [],
        slice = arr.slice,
        push = arr.push;

    var init,
        itcast = function (selector,context) {
            return new itcast.fn.init(selector,context);
        };

    itcast.fn = itcast.prototype = {
        constructor: itcast,
        length: 0,
        splice: arr.splice,
        toArray: function () {
            return slice.call(this);
        },
        get: function(index) {
            if(index == null) {
                return slice.call(this);
            }
            return this[index>=0 ? index-0 : index-0+this.length];
        },
        eq: function (index) {
            return itcast(this.get(index));// ����itcast������Ϊ����ʽ��̣�
        },
        first: function () {
            return itcast(this.get(0));
        },
        last: function() {
            return itcast(this.get(-1))
        },
        each: function (callback) {
            return itcast.each(this,callback);
        },
        map: function (callback) {
            return itcast(itcast.map(this, function (elem, i) {
                return callback.call(elem,elem,i);
            }));
        }
    }

    init = itcast.fn.init = function (selector, context) {
        // ����null undefined ''
        if(!selector) {
            return this;
        }
        // ���캯���в�д����ֵĬ�Ϸ���this
        // �����ַ�������
        // selectorΪ�ַ������Ͳ���context��Χ
        if(itcast.isString(selector)) {
            if(itcast.isHTML(selector)) {
                push.apply(this,itcast.parseHTML(selector));
            }else {
                push.apply(this,select(selector,context));
            }
        }
        // ����Dom����
        // ������Dom����
        else if(itcast.isDOM(selector)) {
            this[0] = selector;
            this.length = 1;
        }
        // ����DOM�����α�������
        else if(itcast.isArrayLike(selector)) {
            push.apply(this,selector);
        }
        // ������
        else if(typeof selector === 'function') {
            if(itcast.isReady) {
                selector();
            }else {
                document.addEventListener('DOMContentLoad', function () {
                    itcast.isReady = true;
                    selector();
                })
            }
        }
    }
    // ԭ�ͼ̳�
    init.prototype = itcast.fn;
    // �ṩ����չ�Ľӿ�
    // �ں�����ԭ���ϰ�extend����
    itcast.extend = itcast.fn.extend = function (source) {
        for(var k in source) {
            this[k] = source[k];
        }
    }

    // ��չ�����ࣨ���ں����ϣ�ֱ��ͨ���������Ϳ��Ե��ã�
    itcast.extend({
        isString: function(obj) {
            return typeof obj === 'string';
        },
        isHTML: function (obj) {
            return (obj+'').charAt(0) === '<' && (obj+'').charAt((obj+'').length-1) === '>' && (obj+'').length>=3;
        },
        isDOM: function (obj) {
            return 'nodeType' in obj && obj.nodeType === 1;
        },
        isWindow: function (obj) {
            return !!obj && obj.window === obj;
        },
        isArrayLike: function (obj) {
            var length = !!obj && 'length' in obj && obj.length;
            var type = itcast.type(obj);
            if(itcast.isWindow(obj) || type === 'function') {
                return false;
            }
        }
    });

    itcast.extend({
        isReady: false,
        each: function(obj,callback) {
            var i = 0,
                l = obj.length;
            for(;i<l;i++) {
                if(callback.call(obj[i],i,obj[i]) === false) {
                    break;
                }
            }
            return obj;
        },
        map: function(obj,callback,args) {
            var ret = [],
                value;
            for(var i= 0;i<obj.length;i++) {
                value = callback(obj[i],i,args);
                if(value != null) {
                    ret.push(value);
                }
            }
            // ����ά����ת��Ϊһά����
            return Array.prototype.concat.apply([],ret);
        },
        parseHTML: function (html) {
            var ret = [];
            var div = document.createElement('div');
            div.innerHTML = html;
            for(var i= 0;i<div.childNodes.length;i++) {
                if(div.childNodes[i].nodeType === 1) {
                    ret.push(div.childNodes[i]);
                }
            }
            return ret;
        },
        type: function (obj) {
            if(obj == null) {
                return obj + '';
            }
            return typeof obj === 'object' ? Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() : typeof obj;
        },
        insertAfter: function (newNode,node) {
            // newNode�嵽node.nextSiblingǰ�߾��ǲ嵽node�ĺ��
            node.parentNode.insertBefore(newNode,node.nextSibling);
        },
        unique: function (arr) {
            var ret = [];
            arr.forEach(function (v) {
                if(ret.indexOf(v) === -1){
                    ret.push(v);
                }
            })
            return ret;
        }
    });

    //DOM����ģ�飨����ԭ���ϣ�
    itcast.fn.extend({
        appendTo: function(target) {
            var ret = [],
                node,
                self = this;
            target = itcast(target);
            target.each(function (i, telem) {
                self.each(function (index, selem) {
                    node = i===0 ? selem : selem.cloneNode(true);
                    ret.push(node);
                    telem.appendChild(node);
                });
            });
            return itcast(ret);// ʵ����ʽ���
        },
        append: function (source) {
            var text;
            if(itcast.isString(source) && !itcast.isHTML(source)) {
                text = source;
                source = itcast();
                source[0] = document.createTextNode(text);
                source.length = 1;
            }else {
                source = itcast(source);
            }
            source.appendTo(this);
            return this;// ʵ����ʽ���
        },
        prependTo: function (target) {
            var firstChild,
                node,
                ret = [],
                self = this;
            target = itcast(target);
            target.each(function (i, telem) {
                firstChild = telem.firstChild;
                self.each(function (index, selem) {
                    node = i===0 ? selem : selem.cloneNode(true);
                    ret.push(node);
                    telem.insertBefore(node,firstChild);
                });
            });
            return itcast(ret);
        },
        prepend: function (source) {
            var text;
            if(itcast.isString(source) && !itcast.isHTML(source)) {
                text = source;
                source = itcast();
                source[0] = document.createElement(text);
                source.length = 1;
            }else {
                source = itcast(source);
            }
            source.appendTo(this);
            return this;
        },
        remove: function () {
            return this.each(function (i, elem) {
                this.parentNode.removeChild(this);
            })
        },
        before: function (source) {
            var text;
            if(itcast.isString(source) && !itcast.isHTML(source)) {
                text = source;
                source = this.constructor();
                source[0] = document.createTextNode(text);
                source.length = 1;
            }else {
                source = this.constructor(source);
            }
            this.each(function (i, ele) {
                source.each(function () {
                    ele.parentNode.insertBefore(i === 0 ? this : this.cloneNode(true),ele)
                });
            });
            return this;
        },
        after: function (source) {
            var text;
            var self = this;
            if(itcast.isString(source) && !itcast.isHTML(source)) {
                text = source;
                source = this.constructor();
                source[0] = document.createTextNode(text);
                source.length = 1;
            }else {
                source = itcast(source);
            }
            this.each(function (i,ele) {
                for(var j=source.length-1;j>=0;j--) {
                    self.constructor.insertAfter(i===0 ? source[j] : source[j].cloneNode(true),ele);
                }
            });
            return this;
        },
        next: function () {
            var ret = [];
            this.each(function () {
                for(var node = this.nextSibling;node;node = node.nextSibling) {
                    if(node.nodeType === 1) {
                        ret.push(node);
                        break;
                    }
                }
            });
            return this.constructor(ret);
        },
        nextAll: function () {
            var ret = [];
            this.each(function () {
                for(var node = this.nextSibling;node;node = node.nextSibling) {
                    if(node.nodeType === 1) {
                        ret.push(node);
                    }
                }
            });
            return this.constructor(this.constructor.unique(ret));
        },
        prev: function () {
            var ret = [];
            this.each(function () {
                for(var node = this.previousSibling;node;node = node.previousSibling) {
                    if(node.nodeType === 1) {
                        ret.push(node);
                        break;
                    }
                }
            });
            return this.constructor(ret);
        },
        prevAll: function () {
            var ret = [];
            this.each(function () {
                for(var node = this.previousSibling;node;node = node.previousSibling) {
                    if(node.nodeType === 1) {
                        ret.push(ret);
                    }
                }
            });
            return this.constructor(this.constructor.unique(ret));
        },

    });

    // ѡ��������
    // ͨ��select��������ѯdomԪ��
    var select = function (selector, context) {
        var ret = [];
        if(context) {
            if(context.nodeType === 1) {
                return Array.prototype.slice.call(document.querySelectorAll(selector));
            }else if(context instanceof Array || (typeof context === 'object' && 'length' in context)) {
                for(var i= 0,l = context.length;i<l;i++) {
                    var doms = context[i].querySelectorAll(selector);
                    for(var j= 0,len = doms.length;j<len;j++) {
                        ret.push(doms[j]);
                    }
                }
            }else {
                return Array.prototype.slice.call(document.querySelectorAll(context + ' ' + selector));
            }
            return ret;
        }else {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
        }
    };

    global.$ = global.itcast = itcast;

    // ע��DOM��������ϵ��¼�
    // ��������itcast.isReadyֵ
    document.addEventListener('DOMContentLoaded', function () {
        itcast.isReady = true;
    });


}(window));