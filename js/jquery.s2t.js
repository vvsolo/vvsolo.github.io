/**
 * jquery-s2t v0.1.0
 *
 * https://github.com/hustlzp/jquery-s2t
 * A jQuery plugin to convert between Simplified Chinese and Traditional Chinese.
 * Tested in IE6+, Chrome, Firefox.
 *
 * Copyright 2013-2014 hustlzp
 * Released under the MIT license
 */

(function($) {
	// 转换
	function convert(str, ss, tt){
		var re = '', i = 0, l = str.length, tmp
		for (; i < l; i++) {
			tmp = str.charAt(i);
			if (str.charCodeAt(i) > 10000 && ss.indexOf(tmp) != -1)
				re += tt.charAt(ss.indexOf(tmp));
			else re += tmp;
		}
		return re;
	}
	//转繁体
	function Traditionalized(str){
		// 共用
		var bval = dicBasic(),
			// 补充
			aval = dicS2T()
		var ss = bval[1] + aval[1],
			tt = bval[0] + aval[0]
		return convert(str, ss, tt)
	}
	//转简体
	function Simplized(str){
		// 共用
		var bval = dicBasic(),
			// 补充
			aval = dicT2S()
		var ss = bval[1] + aval[1],
			tt = bval[0] + aval[0]
		return convert(str, tt, ss)
	}
	// 繁转简补充部分
	function Othered(str){
		return str.replaces(addT2S())
	}

	/**
	 * 转换文本
	 * @param {String} str - 待转换的文本
	 * @param {Boolean} toT - 是否转换成繁体
	 * @returns {String} - 转换结果
	 */
	function tranStr(str, toT) {
		return toT ? Traditionalized(str) : Othered(Simplized(str))
	}

	/**
	 * 转换HTML Element属性
	 * @param {Element} element - 待转换的HTML Element节点
	 * @param {String|Array} attr - 待转换的属性/属性列表
	 * @param {Boolean} toT - 是否转换成繁体
	 */
	function tranAttr(element, attr, toT) {
		var i, attrValue;

		if (attr instanceof Array) {
			for (i = 0; i < attr.length; i++) {
				tranAttr(element, attr[i], toT);
			}
		} else {
			attrValue = element.getAttribute(attr);

			if (attrValue !== "" && attrValue !== null) {
				element.setAttribute(attr, tranStr(attrValue, toT));
			}
		}
	}

	/**
	 * 转换HTML Element节点
	 * @param {Element} element - 待转换的HTML Element节点
	 * @param {Boolean} toT - 是否转换成繁体
	 */
	function tranElement(element, toT) {
		if (element.nodeType !== 1) {
			return;
		}

		var i, childNodes, l;
		childNodes = element.childNodes;
		l = childNodes.length

		for (i = 0; i < l; i++) {
			var childNode = childNodes.item(i) || childNodes[i];

			// 若为HTML Element节点
			if (childNode.nodeType === 1) {
				// 对以下标签不做处理
				if ("|BR|HR|TEXTAREA|SCRIPT|OBJECT|EMBED|".indexOf("|" + childNode.tagName + "|") !== -1 ||
					childNode.getAttribute('notran') == 'true'
					) {
					continue;
				}

				tranAttr(childNode, ['title', 'data-original-title', 'data-tip', 'alt', 'placeholder'], toT);

				// input 标签
				// 对text类型的input输入框不做处理
				if (childNode.tagName === "INPUT" &&
					childNode.value !== "" &&
					childNode.type !== "text" &&
					childNode.type !== "hidden") {
					childNode.value = tranStr(childNode.value, toT);
				}

				// 继续递归调用
				tranElement(childNode, toT);
			} else if (childNode.nodeType === 3) { // 若为文本节点
				childNode.data = tranStr(childNode.data, toT);
			}
		}
	}

	// 扩展jQuery全局方法
	$.extend({
		/**
		 * 文本简转繁
		 * @param {String} str - 待转换的文本
		 * @returns {String} 转换结果
		 */
		s2t: function(str) {
			return tranStr(str, true);
		},

		/**
		 * 文本繁转简
		 * @param {String} str - 待转换的文本
		 * @returns {String} 转换结果
		 */
		t2s: function(str) {
			return tranStr(str, false);
		}
	});

	// 扩展jQuery对象方法
	$.fn.extend({
		/**
		 * jQuery Objects简转繁
		 * @this {jQuery Objects} 待转换的jQuery Objects
		 */
		s2t: function() {
			return this.each(function() {
				tranElement(this, true);
			});
		},

		/**
		 * jQuery Objects繁转简
		 * @this {jQuery Objects} 待转换的jQuery Objects
		 */
		t2s: function() {
			return this.each(function() {
				tranElement(this, false);
			});
		}
	});
})(jQuery);