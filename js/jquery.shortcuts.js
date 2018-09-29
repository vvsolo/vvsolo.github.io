//jquery 文本域插件
(function($) {
	$.fn.extend({
		insertContent: function(myValue, t) {
			var $this = $(this)[0];
			if (document.selection) { //ie
				this.focus();
				var sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
				sel.moveStart('character', -l);
				var wee = sel.text.length;
				if (arguments.length == 2) {
					var l = $this.value.length;
					sel.moveEnd("character", wee + t);
					t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);

					sel.select();
				}
			} else if ($this.selectionStart || $this.selectionStart == '0') {
				var startPos = $this.selectionStart;
				var endPos = $this.selectionEnd;
				var scrollTop = $this.scrollTop;
				$this.value = $this.value.substring(0, startPos) + myValue + $this.value.substring(endPos, $this.value.length);
				this.focus();
				$this.selectionStart = startPos + myValue.length;
				$this.selectionEnd = startPos + myValue.length;
				$this.scrollTop = scrollTop;
				if (arguments.length == 2) {
					$this.setSelectionRange(startPos - t, $this.selectionEnd + t);
					this.focus();
				}
			} else {
				this.value += myValue;
				this.focus();
			}
		},
		selectionRange: function(start, end) {
			var $this = $(this)[0];
			//设置文本输入控件的光标位置
			if (!/input|textarea/i.test($this.tagName))
				//非文本输入控件，无效
				return false;

			if (start === undefined) {
				if (document.selection)
					return document.selection.createRange().text
				else if (/firefox|edge|rv:11/i.test(navigator.userAgent))
					return $this.value.substring($this.selectionStart, $this.selectionEnd);
				else
					return document.getSelection().toString();
			} else {
				//假如不传第二个参数则默认将end设为start
				(end === undefined) && (end = start);

				//控制光标位置
				if ($this.setSelectionRange) {
					$this.setSelectionRange(start, end);
					this.focus();
				} else {
					var range = $this.createTextRange();
					range.move('character', start);
					range.moveEnd('character', end - start);
					range.select();
				}
				return this
			}
		}
	})
})(jQuery);