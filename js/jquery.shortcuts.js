//jquery 文本域插件
(function($) {
	$.fn.extend({
		insertContent: function(myValue, t) {
			var $t = $(this)[0];
			if (document.selection) { //ie
				this.focus();
				var sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
				sel.moveStart('character', -l);
				var wee = sel.text.length;
				if (arguments.length == 2) {
					var l = $t.value.length;
					sel.moveEnd("character", wee + t);
					t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);

					sel.select();
				}
			} else if ($t.selectionStart || $t.selectionStart == '0') {
				var startPos = $t.selectionStart;
				var endPos = $t.selectionEnd;
				var scrollTop = $t.scrollTop;
				$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
				this.focus();
				$t.selectionStart = startPos + myValue.length;
				$t.selectionEnd = startPos + myValue.length;
				$t.scrollTop = scrollTop;
				if (arguments.length == 2) {
					$t.setSelectionRange(startPos - t, $t.selectionEnd + t);
					this.focus();
				}
			} else {
				this.value += myValue;
				this.focus();
			}
		},
		selectionRange: function(start, end) {
			var str = "";
			var thisSrc = this[0];
			if (start === undefined) {
				//获取当前选中文字内容，接受各种元素的选中文字
				if (/input|textarea/i.test(thisSrc.tagName) && /firefox/i.test(navigator.userAgent))
					//文本框情况在Firefox下的特殊情况
					str = thisSrc.value.substring(thisSrc.selectionStart, thisSrc.selectionEnd);
				else if (document.selection)
					//非文本框情况
					str = document.selection.createRange().text;
				else
					str = document.getSelection().toString();
			} else {
				//设置文本输入控件的光标位置
				if (!/input|textarea/.test(thisSrc.tagName.toLowerCase()))
					//非文本输入控件，无效
					return false;

				//假如不传第二个参数则默认将end设为start
				(end === undefined) && (end = start);

				//控制光标位置
				if (thisSrc.setSelectionRange) {
					thisSrc.setSelectionRange(start, end);
					this.focus();
				} else {
					var range = thisSrc.createTextRange();
					range.move('character', start);
					range.moveEnd('character', end - start);
					range.select();
				}
			}
			if (start === undefined)
				return str;
			else
				return this;
		}
	})
})(jQuery);