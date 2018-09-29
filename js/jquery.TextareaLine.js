;(function($) {
	var AutoRowsNumbers = function(element, config) {
		this.$element = $(element);
		this.$group = $('<div/>', {
			'class': "textarea-group"
		});
		this.$ol = $('<div/>', {
			'class': 'textarea-rows'
		});
		this.$wrap = $('<div/>', {
			'class': 'textarea-wrap'
		});
		this.$group.css({
			"display": config.display
		});
		this.$ol.css({
			"color": config.color,
			//"background-color": config.bgcolor,
			"border": 0,
			"border-right": '1px dashed ' + config.color,
			"width": config.width,
			"height": this.$element.outerHeight(),
			"font-size": this.$element.css("font-size"),
			"line-height": this.$element.css("line-height"),
			"position": "absolute",
			"overflow": "hidden",
			"margin": 0,
			"padding": '5px 5px 0 0',
			"text-align": "right",
			"font-family": "consolas"
		});
		this.$wrap.css({
			"position": "absolute",
			"height": this.$element.outerHeight()
		});
		this.$element.css({
			//"white-space": "normal",
			//"overflow-wrap":"break-word",
			"resize": "none",
			//"margin-left": (parseInt(config.width) - parseInt(this.$element.css("border-left-width"))) + 'px',
			"padding-left": (parseInt(config.width)) + parseInt(this.$element.css("padding-left")),
			"padding-right": parseInt(this.$element.css("padding-right")) + 10,
			"margin": 0,
			"overflow-y": 'scroll'
		});
	}
	AutoRowsNumbers.prototype = {
		constructor: AutoRowsNumbers,
		init: function() {
			var that = this;
			that.$element.wrap(that.$group);
			that.$ol.insertBefore(that.$element);
			this.$ol.wrap(that.$wrap)
			that.$element.on('keyup keydown change focus input propertychange', {
				that: that
			}, that.inputText);
			that.$element.on('scroll', {
				that: that
			}, that.syncScroll);
			that.inputText({
				data: {
					that: that
				}
			});
		},
		inputText: function(event) {
			var that = event.data.that;
			setTimeout(function() {
				var value = that.$element.val();
				value.match(/\n/g) ? that.updateLine(value.match(/\n/g).length + 1) : that.updateLine(1);
				that.syncScroll({
					data: {
						that: that
					}
				});
			}, 0);
		},
		updateLine: function(count) {
			var that = this;
			var value = that.$element.val().replace(/(\r\n|\n\r|\r|\n)/g, '\n') + '\n';
			//value = value.replace(/\n{2,}$/g, '\n')
			var valArr = value.split('\n')
			//var trueLineWidth = that.$element.outerWidth(true)
			//trueLineWidth -= parseInt(that.$element.css('padding-left'))
			//trueLineWidth -= parseInt(that.$element.css('padding-right'))
			//trueLineWidth -= parseInt(50)
			//var trueFontSize = parseInt(that.$element.css('font-size'))
			// 每行最大字数
			//var trueLineFontNum = parseInt(trueLineWidth / trueFontSize)
			var trueLineFontNum = 78
			
			that.$ol.html('');
			for (var i = 1; i <= count; i++) {
				if(i > 5000){
					$('#AlertMsg').html('行数超过5000行，行号不再显示！')
					break;
				}
				var linestr = valArr[i - 1]
				// 当前行字数
				var lineStrNum = parseInt(linestr.length)
				// 防止自动断行字数不同
				var CutNum = trueLineFontNum
				var sLineNum = 1
				while(linestr.length > 0) {
					var tmp = linestr.substr(0, CutNum);
					var tmpend = linestr.substr(tmp.length);
					for(var k = 1; k < 4; k++) {
						if(tmpend.match(/^[：，。？！“”]/g)){
							tmp = linestr.substr(0, CutNum - k);
							tmpend = linestr.substr(tmp.length);
						}else{
							break;
						}
					}
					linestr = tmpend;
					sLineNum++
				}
				that.$ol.append("<div>" + i +  "</div>");
				// 按字数分实际行数
				if(lineStrNum >= sLineNum){
					//var trueLineNum = Math.ceil(lineStrNum / CutNum)
					for(var j = 1; j < sLineNum - 1; j++) {
						that.$ol.append("<div>.</div>");
					}
				}
			}
		},
		syncScroll: function(event) {
			var that = event.data.that;
			that.$ol.children().eq(0).css({"margin-top": -(that.$element.scrollTop()) + "px"});
		}
	}
	$.fn.TextareaLine = function(option) {
		var config = {};
		var option = arguments[0] ? arguments[0] : {};
		config.color = option.color || "#aaa";
		config.bgcolor = option.color || "#efefef";
		config.width = option.width || "50px";
		config.display = option.display || "block";
		return this.each(function() {
			var $this = $(this),
				data = $this.data('autoRowsNumbers');
			if (!data) {
				$this.data('autoRowsNumbers', (data = new AutoRowsNumbers($this, config)));
			}
			if (typeof option === 'string') {
				return false;
			} else {
				data.init();
			}
		});
	}
})(jQuery)