/**
 * typesetting for EverEdit
 * 注意：修改后请切记压缩方可生效！
 */

 // 对象批量赋值
 Object.extend = function(a, b) {
	for (var i in b)
		a[i] = b[i];
	return a;
}

Object.extend(String.prototype, {
	// 循环正则替换
	replaces: function(arr) {
		var re = this;
		for (var i in arr)
			re = re.replace(arr[i][0], arr[i][1]);
		return re;
	},
	// 重复连接字符串
	times: function(m) {
		return m < 1 ? '' : new Array(m + 1).join(this);
	},
	// 去除所有空格后的长度
	checkEmpty: function() {
		return this.replace(configs.AllSpace, '').length === 0;
	},
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.replace(/[^\x00-\xff]/g, '**').length;
	},
	// 按真实字数进行分隔
	realSubstring: function (start, len) {
		var str = this || '';
		if(str.length === 0) return str;
		start = start || 0;
		len = len || str.len();
		var byteL = 0;
		var sub = '';

		for (var i = c = cl = 0; i < str.length; i++) {
			c = str.charCodeAt(i);
			cl = c > 0xff ? 2 : 1;
			byteL += cl;
			//还不到开始位
			if (start >= byteL) continue;

			if (
				(len == str.len()) //取完
				|| ((len -= cl) >= 0) //取本字时不超过
			) {
				sub += String.fromCharCode(c);
			} else {//取超了
				break;
			}
		}
		return sub;
	},
	// 去除首尾所有空格
	trim: function(r) {
		return this.replace(configs.trim, r || '')
	},
	// 排版初始化，去空格空行
	replaceInit: function() {
		return this
			// 转换所有空格样式为标准
			.replace(configs.Space, ' ')
			// 去除首尾所有空格
			.trim('\n')
			// 修正所有换行为 UNIX 标准
			.replace(/(\r\n|\n\r|\r)/g, '\n')
			// 所有行尾加换行
			.replace(/$/g, '\n')
			// 英文间单引号替换
			.replace(/([a-zA-Z])([\'`＇‘’『』])([a-zA-Z])/g, '$1\'$3')
			// 修正引号
			.replace(/^」/gm, '「')
			.replace(/^』/gm, '『')
			.replace(/^”/gm, '“')
			.replace(/^’/gm, '‘')
			.replace(/「$/gm, '」')
			.replace(/『$/gm, '』')
			.replace(/“$/gm, '”')
			.replace(/‘$/gm, '’')
			// 去除所有多余空白行
			.replace(/\n{2,}/gm, '\n')
	},
	// 排版结束
	replaceEnd: function() {
		return this
			// 修正引号
			.replace(/^」/gm, '「')
			.replace(/^』/gm, '『')
			.replace(/^”/gm, '“')
			.replace(/^’/gm, '‘')
			.replace(/「$/gm, '」')
			.replace(/『$/gm, '』')
			.replace(/“$/gm, '”')
			.replace(/‘$/gm, '’')
			// 去除所有多余行
			.replace(/\n{3,}/gm, '\n\n')
			.replace(/^\n+/g, '')
	},
	// 英文首字大写
	convertInitial: function() {
		//var allInitial = [];
		var re = this
			// 转换英文小写
			.toLowerCase()
			// 英文首写全大写
			.replace(/\b([a-zA-Z])/g, function(m){
				return m.toUpperCase()
			})
			// 引用的全转小写
			.replace(/[《“‘「『【\"（]([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\'\n]{2,})[》”’」】』\"）]/gm, function(m, m1) {
				// 全是英文时全部首字大写
				if((m1.match(/[…！？。\!\?\.]$/g) || m1.match(/[，：；＆\,\:\;\&\']/g)) && m1.match(/\w/g)){
					return m
					.replace(/[，\, ][A-Z]/g, function(n){
						return n.toLowerCase();
					})
					.replaces(configs.halfSymbol)
					.replace(/[\.\?\!\:\&][ ]?[a-z]/g, function(n){
						return n.toUpperCase();
					})
				}
				return m
			})
			// 独占一行的全英文
			.replace(/^([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\']{2,})$/gm, function(m, m1) {
				return m.replace(/[， ][A-Z]/g, function(n){
					return n.toLowerCase()
				})
			})
			// 处理单词全是英文和数字时
			.replace(/\b([A-Za-z\d]+)\b/g, function(m) {
				return m.match(/\d/) ? m.toUpperCase() : m
			})
			// 处理型号类
			.replace(/([a-zA-Z]+[\-—\~～]\d|\d[\-—\~～][a-zA-Z]+)/g, function(m) {
				return m.toUpperCase()
			})
			// 处理连续的英语
			.replace(/(\W)(a{2,}|b{2,}|c{2,}|d{2,}|e{2,}|f{2,}|g{2,}|h{2,}|i{2,}|j{2,}|k{2,}|l{2,}|m{2,}|n{2,}|o{2,}|p{2,}|q{2,}|r{2,}|s{2,}|t{2,}|u{2,}|v{2,}|w{2,}|x{2,}|y{2,}|z{2,})(\W)/gi, function(m) {
				return m.toUpperCase()
			})
			// 专用英文缩写全部大写
			//.replace(/[（]([\w]{2,})[）]/g, function(m, m1) {
			//	if(!allInitial[m1]) allInitial[m1] = m1;
			//	return m.toUpperCase()
			//})
			// 处理英语中的 ' 标点符号
			.replace(/([a-zA-Z]+)[\'\`＇‘’『』]([a-zA-Z])/g, function(m0, m1, m2) {
				return m1.replace(/\b[a-z]/g, function(n) {
					return n.toUpperCase()
				}) + "'" + m2.toLowerCase()
			})
			// 处理英语中网址
			.replace(/([0-9a-zA-Z]+)[。\.]([0-9a-zA-Z—\-_]+)[。\.](com|net|org|gov)/gi, function(m) {
				return m.replace(/。/g, '.').toLowerCase()
			})
			
		// 处理专用缩写
		//for(var item in allInitial)
		//	re = re.replace(new RegExp('\\b(' + allInitial[item] + ')\\b', 'gi'), allInitial[item].toUpperCase())
		// 处理常用英语书写
		var pWord = configs.pWord.split('|');
		for(var i = 0; i < pWord.length; i++)
			re = re.replace(new RegExp('\\b(' + pWord[i] + ')([0-9]*)\\b', 'gi'), pWord[i] + '$2')
		return re
	},
	// 全角半角字母数字，ve=1时全角
	convertNumberLetter: function(ve) {
		return this
			// 转换字母为全角
			.convertLetter(ve)
			// 转换数字为全角
			.convertNumber(ve)
			// 修正所有数字和英文字母间的标点和空格
			.replaces(configs.nwSymbol)
	},
	/*
	 * 半角数字(0-9): [\u0030-\u0039] （DBC case）
	 * 全角数字(0-9): [\uFF10-\uFF19] （SBC case）
	 */
	// 半角数字
	convertDBCNumber: function() {
		return this.replace(/[\uFF10-\uFF19]/g, function(m) {
			return String.fromCharCode(m.charCodeAt(0) - 65248)
		})
	},
	// 全角或半角数字，ve=1时全角
	convertNumber: function(ve) {
		if (ve === 1) {
			return this
				.replace(/[\u0030-\u0039]/g, function(m) {
					return String.fromCharCode(m.charCodeAt(0) + 65248)
				})
				// 转换标题内的数字为半角
				.replace(configs.regSBCNumberTitle, function(m) {
					return m.convertDBCNumber()
				})
		}
		return this.convertDBCNumber()
	},
	/*
	 * 全角半角字母，ve=1时全角
	 * 半角小写英文字母(a-z): [\u0061-\u007A]
	 * 全角小写英文字母(a-z): [\uFF41-\uFF5A]
	 * 半角大写英文字母(A-Z): [\u0041-\u005A]
	 * 全角大写英文字母(A-Z): [\uFF21-\uFF3A]
	 */
	convertLetter: function(ve) {
		// 全角小写字母后紧跟大写，用空格分隔
		var re = this.replace(/([\uFF41-\uFF5A])([\uFF21-\uFF3A])/g, '$1 $2')
		if (ve === 1) {
			return re.replace(/[a-zA-Z]/g, function(m) {
				return String.fromCharCode(m.charCodeAt(0) + 65248)
			})
		}
		return re.replace(/[\uFF41-\uFF5A\uFF21-\uFF3A]/g, function(m) {
			return String.fromCharCode(m.charCodeAt(0) - 65248)
		})
	},
	// Unicode转换
	converUnicode: function() {
		return this
			.replace(/\\u?([0-9a-f]{4})/gi, function(m) {
				return unescape(m.replace(/\\u?/gi, '%u'))
			})
			.replace(/([＆&]#(\d+)[;；])/gi, function(m) {
				return String.fromCharCode(m.replace(/[＆&#;；]/g, ''))
			})
			//.replace(/(%[\da-zA-Z]{2})/g, function(m) {
			//	return decodeURIComponent(m);
			//})
	},
	// html转义符转换
	converHtmlEntity: function() {
		return this.replace(configs.regHtmlEntity, function(m, m1){
				return (configs.sHtmlEntity[m1]) ? configs.sHtmlEntity[m1] : m
			})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaces(configs.sVariant)
	},
	// 转换变体序号
	convertSerialNumber: function() {
		return this.replaces(configs.sSerialNumber)
	},
	// 全角标点符号
	convertPunctuation: function() {
		return this
			// 标点符号修正
			.replaces(configs.punSymbol)
			// 修正所有数字和英文字母间的标点和空格
			.replaces(configs.nwSymbol)
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		return this
			// 修正汉字间的制表符为换行
			.replace(/[\t]+(?=[\u4e00-\u9fa0])/g, '\n')
			// 去除字间多余空格
			.replace(/[ ]+/g, ' ')
			// 去除汉字间的空格 \u4e00-\u9fa5
			// 全角标点 ·！（），．：；？–—‘’“”…、。〈-】〔〕￠-￥＆
			// 半角标点 \/\\\+\-\'
			// 半角标点 \@\&\=\_\,\.\?\!\$\%\^\*\-\+\/\(\)\[\]\'\"<\>\\
			.replace(/[ ]+(?=[\u4e00-\u9fa0·！（），．：；？–—‘’“”…、。〈-】〔〕￠-￥＆\/\\\+\-\'])/g, '')
			// 英文数字后跟全角标点
			.replace(/([0-9a-zA-Z])[ ]+([\u4e00-\u9fa0·！（），．：；？–—‘’“”…、。〈-】〔〕￠-￥＆])/g, '$1$2')
			.replace(/([\u4e00-\u9fa0·！（），．：；？–—‘’“”…、。〈-】〔〕￠-￥＆])[ ]+([0-9a-zA-Z])/g, '$1$2')
			// 英文数字后跟汉字
			//.replace(/([0-9a-zA-Z])[ ]*([\u4e00-\u9fa0])/g, '$1 $2')
			// 数字后跟计量单位
			//.replace(/([0-9])[ ]*(°|%|‰|％|℃)[ ]*([0-9a-zA-Z\u4e00-\u9fa0])/g, '$1$2 $3')
			// 数字后跟特定单位
			//.replace(/([0-9])[ ]+(gbps|gb|g|tb|t|mb|m|byte|b)[ ]*([0-9a-zA-Z\u4e00-\u9fa0]?)/gi, '$1$2 $3')
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this
			.replaces(configs.rSeparator)
			// 还原注释标记
			.replace(/!@!@!@!@!/g, '＊'.times(35))
			.replace(/@@@@/g, configs.Separator)
	},
	// 引号修正
	replaceQuotes: function(d, simp) {
		// 法式引号 fr：'‘’“”'
		// 中式引号 cn：'『』「」'
		d = (d !== 'cn' ? '‘’“”' : '『』「」').split('')
		// 是否简单修正
		simp = simp || false

		var re = this.replace(/([a-zA-z])([\'`＇‘’『』])([a-zA-z])/g, '$1※@※$3')
		if(!simp){
			re = re.replace(/[‘’『』]/g, '\'')
				.replace(/[“”「」]/g, '\"')
		}

		// 修正引号初始化
		return re
			.replace(/[`＇]/g, '\'')
			.replace(/[〝〞［］＂″｢｣]/g, '\"')
			// 修正单引号
			.replace(/'([^\'\r\n]+)'/g, d[0] + '$1' + d[1])
			.replace(/^([　]+)'/gm, '$1' + d[0])
			.replace(/'/g, d[1])
			.replace(new RegExp('^([　]*)' + d[1], 'gm'), '$1' + d[0])
			.replace(new RegExp(d[0] + '$', 'gm'), d[1])
			.replace(/※@※/g, '\'')
			// 修正大引号
			.replace(/"([^\"\r\n]+)"/g, d[2] + '$1' + d[3])
			.replace(/^([　]+)"/gm, '$1' + d[2])
			.replace(/"/g, d[3])
			.replace(new RegExp('^([　]*)' + d[3], 'gm'), '$1' + d[2])
			.replace(new RegExp(d[2] + '$', 'gm'), d[3])
			//.replace(new RegExp(d[3] + d[2], 'g'), d[3] + '\n' + d[2])
			.replace(new RegExp('：' + d[3], 'g'), '：' + d[2])
	},
	// 修正章节标题
	replaceTitle: function(b1, b2, center, relax) {
		var iDivide = configs.Divide
		var fBreak = b1 || '\n\n'
		var eBreak = b2 || ''
		var iCenter = center || false;
		var iRelax = relax || false
		var re = this

		// 非严格限定
		if(iRelax){
			// 标题间隔符（非严格限定）
			configs.regSeparator = configs.regSeparatorNull
			// 行尾（非严格限定）
			configs.regStrictEnd = configs.regEnd
		}

		var rTitle = configs.regTitle
		var rSeparator = configs.regSeparator
		var rSeparatorNull = configs.regSeparatorNull
		var rSeparatorLeft = new RegExp('^' + rSeparator, 'g')
		var rSeparatorAll = new RegExp('^' + rSeparator + '$', 'g')

		/****** 分隔符居中 ******/
		if (iCenter) {
			re = re.replace(new RegExp(configs.regStart + configs.Separator, 'gm'), function(m) {
				return doCenter(m, '', '', iCenter)
			})
		}

		var reg = [
			'^' + configs.regStart,
			'',
			'(?:' + rSeparatorNull + ')',
			'(' + configs.regEnd + '|$)',
			'$'
		]
		/****** 非常规标题 ******/
		reg[1] = '(' + rTitle.t1.join('|') + ')'
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			// 防止错误判断一下标题
			if(m2.match(/^[！？。]{1,3}$/g)) return m0
			m2 = m2
				.replace(rSeparatorLeft, '')
				// 修正标题外括号【】
				.replace(/[【】]/g, '')
				// 去除只有间隔符的情况
				.replace(rSeparatorAll, '')
			if (m2.length > 0) m2 = iDivide + m2
			return doCenter(m1 + m2, fBreak, eBreak, iCenter)
		});
		// 04.24 修正非常规标题后面跟着数字序号的情况
		var r = '(' + rTitle.t1[0] + ')' + iDivide + '(（?[0-9零一二三四五六七八九十]{1,2}）?)'
		re = re.replace(new RegExp(r, 'g'), '$1$2')
		
		/****** 常规标题去边框 ******/
		// 【第一章：标题】
		var s = [
			'^' + configs.regStart,
			'[【]?' + rTitle.t2 + '[】]?',
			'(' + rSeparatorNull + ')',
			'[【]?(' + configs.regEnd + '|$)[】]?',
			'$'
		]
		re = re.replace(new RegExp(s.join(''), 'gm'), function(t) {
			return t.replace(/[【】]/g, '')
		})
		/****** 一章/第一章/一章：标题/第一章：标题 ******/
		reg[1] = rTitle.t2
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2, m3) {
			// 防止错误判断一下标题：——开头，或全是标点
			if(m2.match(/^[\-—]{1,4}/g) || m3.match(/^[！？。…]{1,3}$/g))
				return m0
			// 防止错误判断一下标题：第一部电影很好，很成功。
			if(!m3.match(configs.regSeparatorCheck) && m3.match(/[，]/g) && m3.match(/[！？。…]{1,3}$/g))
				return m0
			// 防止错误判断一下标题：一回头、一幕幕
			if((m0.match(configs.regSkipTitle) && !m3.match(configs.regSeparatorCheck) && m3.match(/[！？。…]{1,3}$/g)))
				return m0
			m3 = m3
				.replace(rSeparatorLeft, '')
				// 中文间空格转换为逗号
				.replace(/([\u4E00-\u9FA5])[ ]+([\u4E00-\u9FA5])/g, '$1，$2')
				.replace(/([\w]+)[ ]{1,4}([\w]+)/g, '$1 $2')
				// 去除只有间隔符的情况
				.replace(rSeparatorAll, '')
			if (m3.length > 0) m3 = iDivide + m3
			m2 = m2.replace(/[ ]*/g, '')
			return doCenter('第' + m2 + m3, fBreak, eBreak, iCenter)
		})
		/****** （一）/（一）标题 ******/
		reg[1] = rTitle.t5
		reg[2] = ''
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			m2 = m2
				.replace(rSeparatorLeft, '')
				.replace(/[【】]/g, '')
				.replace(rSeparatorAll, '')
			return doCenter(m1 + m2, fBreak, eBreak, iCenter)
		})
		// 如果是居中返回
		if (iCenter) return re

		/****** 卷一/卷一：标题 ******/
		reg[1] = rTitle.t3
		reg[2] = '(?:' + rSeparatorNull + ')'
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2, m3) {
			m3 = m3
				.replace(rSeparatorLeft, '')
				.replace(/[【】]/g, '')
				.replace(rSeparatorAll, '')
			if (m3.length > 0) m3 = iDivide + m3
			return fBreak + '第' + m2 + m1 + m3 + eBreak
		})
		/****** 01/01./01.标题/一/一、/一、标题 ******/
		reg[1] = rTitle.t4
		reg[2] = '(' + rSeparator + '|'
		reg[3] = rSeparator + configs.regStrictEnd + '|$)'
		var pattern = configs.regSkipTitle1
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			// 全是标点不处理
			if(m2.match(/^[！？。…]{1,3}$/g))
				return m0
			// 没有间隔符并且以句号结尾不处理
			if(!m2.match(rSeparatorLeft) && m2.match(/[！？。…]$/g))
				return m0
			// 其他处理过滤
			for(var i = 0; i < pattern.length; i++) {
				if(m0.match(pattern[i]))
					return m0
			}
			m2 = m2
				.replace(rSeparatorLeft, '')
				.replace(/[【】]/g, '')
				.replace(rSeparatorAll, '')
			if (m2.length > 0) m2 = iDivide + m2
			return fBreak + '第' + m1 + '章' + m2 + eBreak
		})
		return re
	}
});

// 章节标题居中函数，默认一行35全角字符
var doCenter = function(str, b1, b2, center) {
	var fBreak = b1 || '\n';
	var eBreak = b2 || '';
	var iCenter = center || false;
	var lineLength = configs.Linenum*2;

	if(iCenter){
		str = str.trim();
		var strLength = str.len();

		if (iCenter && lineLength > strLength)
			str = '　'.times(parseInt((lineLength - strLength) / 4, 10)) + str;
	}
	return fBreak + str + eBreak;
};

// 格式化时间
if (typeof Date.prototype.format !== 'function') {
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
}
// 仿Java String.format
/*
 * var result1 = "我是{0}，今年{1}了".format("loogn",22)
 * var result2 = "我是{name}，今年{age}了".format({name:"loogn",age:22})
 *
 */
if (typeof String.prototype.format !== 'function') {
	String.prototype.format = function(args) {
		if (arguments.length === 0)
			return this;

		var re = this;
		if (arguments.length === 1 && typeof args === "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					re = re.replace(new RegExp('({' + key + '})', 'g'), args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					re = re.replace(new RegExp('({)' + key + '(})', 'g'), arguments[i]);
				}
			}
		}
		return re;
	}
}
// 取正则查询匹配的次数
if (typeof String.prototype.findCount !== 'function') {
	String.prototype.findCount = function(reg) {
		var count = 0;
		var re = this.replace(reg, function() {
			count++;
		})
		return count;
	}
}
