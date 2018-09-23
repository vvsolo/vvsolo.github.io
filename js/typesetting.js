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
		return this.replace(/[^\x00-\xff]/g, "**").length;
	},
	// 按真实字数进行分隔
	realSubstring: function(start, len) {
		var str = this || '';
		if (str.length === 0) return str;
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
				||
				((len -= cl) >= 0) //取本字时不超过
			) {
				sub += String.fromCharCode(c);
			} else { //取超了
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
			// 修正所有换行为 UNIX 标准
			.replace(/(\r\n|\n\r|\r)/g, '\n')
			// 去除首尾所有空格
			.trim('\n')
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
		var allInitial = [];
		var re = this
			// 转换英文小写
			.toLowerCase()
			// 英文首写全大写
			.replace(/\b([a-zA-Z])/g, function(m) {
				return m.toUpperCase()
			})
			// 引用的全转小写
			.replace(/[《“‘「『【\"（]([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\'\n]{2,})[》”’」】』\"）]/gm, function(m, m1) {
				// 全是英文时全部首字大写
				if ((m1.match(/[…！？。\!\?\.]$/g) || m1.match(/[，：；＆\,\:\;\&\']/g)) && m1.match(/\w/g)) {
					return m
						.replace(/[，\, ][A-Z]/g, function(n) {
							return n.toLowerCase();
						})
						.replaces(configs.halfSymbol)
						.replace(/[\.\?\!\:\&][ ]?[a-z]/g, function(n) {
							return n.toUpperCase();
						})
				}
				return m
			})
			// 独占一行的全英文
			.replace(/^([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\']{2,})$/gm, function(m, m1) {
				return m.replace(/[， ][A-Z]/g, function(n) {
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
		for (var i = 0; i < pWord.length; i++)
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
			.replace(/\\u?([0-9abcdef]{4})/gi, function(m) {
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
		return this.replace(configs.regHtmlEntity, function(m, m1) {
			return (configs.sHtmlEntity[m1]) ? configs.sHtmlEntity[m1] : m
		})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaces(configs.sVariant);
	},
	// 转换变体序号
	convertSerialNumber: function() {
		return this.replaces(configs.sSerialNumber);
	},
	// 全角标点符号
	convertPunctuation: function() {
		return this
			// 标点符号修正
			.replaces(configs.punSymbol)
			// 修正所有数字和英文字母间的标点和空格
			.replaces(configs.nwSymbol);
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
		// 替换分隔符
		return this
			.replace(/[ ]+(?=[＊#＃§☆★○●◎◇◆□■△▲※〓＝﹡×＋@\*x\—\-=])/g, '')
			// 注释标记※
			.replace(/＊{35,}/g, '\n!@!@!@!@!\n')
			.replace(/([”。？！」])[…]{3,}$/g, '$1\n@@@@\n')
			.replace(/[`＊&\*x]{5,}/g, '@@@@')
			.replace(/(^…$\n){3,}/gm, '@@@@')
			.replace(/([#＃§☆★○●◎◇◆□■△▲※〓＝﹡＋]{3,}|^[＊×]{3,}|^[\—\-=]{4,}|^[\—\-=]{2,}$)/gm, '@@@@')
			// 修正数字和某些标点后的*号
			.replace(/([\w：，；]$)\n?@@@@\n?/gm, '$1****')
			.replace(/@@@@\n?([，。！？…’”』」])/gm, '****$1')
			.replace(/@{4,}/g, '\n@@@@\n')
			.replace(/(^@@@@$\n+)+/gm, '@@@@\n')
			.replace(/\n+@@@@\n+/gm, '\n@@@@\n')
			// 还原注释标记
			.replace(/!@!@!@!@!/g, '＊'.times(35))
			.replace(/@@@@/g, configs.Separator);
	},
	// 引号修正
	replaceQuotes: function(d, simp) {
		// 分隔符
		// 法式引号：'‘’“”'
		// 中式引号：'『』「」'
		d = d || '‘’“”'.split('');
		// 是否简单修正
		simp = simp || false;

		var re = this.replace(/([a-zA-z])([\'`＇‘’『』])([a-zA-z])/g, '$1※@※$3');
		if (!simp) {
			re = re.replace(/[‘’『』]/g, '\'')
				.replace(/[“”「」\[\]]/g, '\"');
		}

		// 修正引号初始化
		return re
			.replace(/[`＇]/g, '\'')
			.replace(/[〝〞［］＂]/g, '\"')
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
		var iDivide = configs.Divide;
		var fBreak = b1 || '\n\n';
		var eBreak = b2 || '';
		var iCenter = center || false;
		var iRelax = relax || false;
		var re = this;

		// 非严格限定
		if (iRelax) {
			// 标题间隔符（非严格限定）
			configs.regSeparator = configs.regSeparatorNull;
			// 行尾（非严格限定）
			configs.regStrictEnd = configs.regEnd;
		}

		var rTitle = configs.regTitle;
		var rSeparator = configs.regSeparator;
		var rSeparatorNull = configs.regSeparatorNull;

		/****** 分隔符居中 ******/
		if (iCenter) {
			re = re.replace(new RegExp(configs.regStart + configs.Separator, 'gm'), function(m) {
				return doCenter(m, '', '', iCenter);
			});
		}

		var reg = [
			'^' + configs.regStart,
			'',
			'(?:' + rSeparatorNull + ')',
			'(' + configs.regEnd + '|$)',
			'$'
		];
		/****** 非常规标题 ******/
		reg[1] = '(' + rTitle.t1.join('|') + ')';
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			// 防止错误判断一下标题
			if (m2.match(/^[！？。]{1,3}$/g)) return m0;
			m2 = m2.replace(new RegExp('^' + rSeparator, 'g'), '')
				// 修正标题外括号【】
				.replace(/[【](.*)[】]$/g, '$1')
				// 去除只有间隔符的情况
				.replace(new RegExp('^' + rSeparator + '$', 'g'), '');
			if (m2.length > 0) m2 = iDivide + m2;
			return doCenter(m1 + m2, fBreak, eBreak, iCenter);
		});
		// 04.24 修正非常规标题后面跟着数字序号的情况
		var r = '(' + rTitle.t1[0] + ')' + iDivide + '(（?[0-9零一二三四五六七八九十]{1,2}）?)';
		re = re.replace(new RegExp(r, 'g'), '$1$2');

		/****** 常规标题去边框 ******/
		// 【第一章：标题】
		var s = [
			'^' + configs.regStart,
			'[【]?' + rTitle.t2 + '[】]?',
			'(' + rSeparatorNull + ')',
			'[【]?(' + configs.regEnd + '|$)[】]?',
			'$'
		];
		re = re.replace(new RegExp(s.join(''), 'gm'), function(t) {
			return t.replace(/[【】]/g, '');
		});
		/****** 一章/第一章/一章：标题/第一章：标题 ******/
		reg[1] = rTitle.t2;
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2, m3) {
			// 防止错误判断一下标题
			if ((m0.match(configs.regSkipTitle) && !m3.match(configs.regSeparatorCheck) && m3.match(/[！？。…]{1,3}$/g)) || m2.match(/^[\-—]/g)) return m0;
			if (m3.length === 0 && m2.match(/[！？。…]{1,3}$/g)) return m0;
			m3 = m3.replace(new RegExp('^' + rSeparator, 'g'), '')
				// 中文间空格转换为逗号
				.replace(/([\u4E00-\u9FA5])[ ]+([\u4E00-\u9FA5])/g, '$1，$2')
				.replace(/([\w]+)[ ]{1,4}([\w]+)/g, '$1 $2')
				.replace(new RegExp('^' + rSeparator + '$', 'g'), '');
			if (m3.length > 0) m3 = iDivide + m3;
			m2 = m2.replace(/[ ]*/g, '')
			return doCenter('第' + m2 + m3, fBreak, eBreak, iCenter);
		});
		/****** （一）/（一）标题 ******/
		reg[1] = rTitle.t5;
		reg[2] = '';
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			m2 = m2.replace(new RegExp('^' + rSeparator, 'g'), '')
				// 修正标题外括号【】
				.replace(/[【](.*)[】]$/g, '$1')
				.replace(new RegExp('^' + rSeparator + '|' + rSeparator + '$', 'g'), '');
			return doCenter(m1 + m2, fBreak, eBreak, iCenter);
		});
		// 如果是居中返回
		if (iCenter) return re;

		/****** 卷一/卷一：标题 ******/
		reg[1] = rTitle.t3;
		reg[2] = '(?:' + rSeparatorNull + ')';
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2, m3) {
			m3 = m3.replace('^' + new RegExp(rSeparator, 'g'), '')
				// 修正标题外括号【】
				.replace(/[【](.*)[】]$/g, '$1')
				.replace(new RegExp('^' + rSeparator + '$', 'g'), '');
			if (m3.length > 0) m3 = iDivide + m3;
			return fBreak + '第' + m2 + m1 + m3 + eBreak;
		});
		/****** 01/01./01.标题/一/一、/一、标题 ******/
		reg[1] = rTitle.t4;
		reg[2] = '(' + rSeparator + '|';
		reg[3] = rSeparator + configs.regStrictEnd + '|$)';
		re = re.replace(new RegExp(reg.join(''), 'gm'), function(m0, m1, m2) {
			// 忽略日期格式 2010.10.10, 17.10.10, 17/10/10
			var pattern1 = /^([\d０-９]{2,4})[\.\-\/。—][\d０-９]{1,2}[\.\-\/。—][\d０-９]{1,2}/g;
			// 忽略日期格式 2010年10月10日, 五时十二分
			var pattern2 = /^[\d０-９一二三四五六七八九十]{1,4}[年月日点时分秒點時]([\d０-９一二三四五六七八九十]|$)/g;
			// 忽略时间格式 20:22:21
			var pattern3 = /^[\d０-９]{1,2}[\:：][\d０-９]{1,2}[\:：][\d０-９]{1,2}/g;
			// 其他不规则格式 100%, 60°
			var pattern4 = /^[\d０-９]{1,6}[\%％‰℃°]$/g;
			// 比分类格式 3:0
			var pattern5 = /^[\d０-９]{1,2}[\:：][\d０-９]{1,2}/g;
			if (pattern1.test(m0) || pattern2.test(m0) || pattern3.test(m0) || pattern4.test(m0) || pattern5.test(m0))
				return m0;

			m2 = m2.replace(new RegExp('^' + rSeparator, 'g'), '')
				// 修正标题外括号【】
				.replace(/[【](.*)[】]$/g, '$1')
				.replace(new RegExp('^' + rSeparator + '$', 'g'), '');
			if (m2.length > 0) m2 = iDivide + m2;
			return fBreak + '第' + m1 + '章' + m2 + eBreak;
		});
		return re;
	}

});

// 章节标题居中函数，默认一行35全角字符
var doCenter = function(str, b1, b2, center) {
	var fBreak = b1 || '\n';
	var eBreak = b2 || '';
	var iCenter = center || false;
	var lineLength = configs.Linenum * 2;

	if (iCenter) {
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

// 截取分段
function doSplit(str, sm, bm) {
	var tmpstr = '';
	if (str.match(/^　{2,}/)) return str + '\n\n';
	str = str.trim();
	if (str.len() === 0) return str;

	// 分隔字数
	var cutNum = configs.Linenum * 2;

	var text = '',
		linestr = (str === '＊'.times(35)) ? str : '　　' + str;

	// 小于每行最大字数时直接返回
	if (linestr.len() > cutNum) {
		var oNum = Math.floor(linestr.len() / cutNum) + 1;
		for (var j = 0; j < oNum; j++) {
			// 预分段
			var tmp = linestr.realSubstring(0, cutNum);
			// 判断并处理行尾限制字符
			tmp = tmp.replace(/([「“《『‘（]){1,2}$/gm, function(word) {
				linestr += word;
				return '';
			});
			// 剩下部分
			linestr = linestr.realSubstring(tmp.len());
			// 判断并处理行首限制字符
			// 处理两个字符，因为经过整理过的标点只留两个
			linestr = linestr.replace(/^([，。：、；：？！．）》」』]{1,2})/gm, function(word) {
				tmp += word;
				return '';
			});
			// 处理单个连续标点
			linestr = linestr.replace(/^([…～－])$/gm, function(word) {
				tmp += word;
				return '';
			});
			// 如果有英文并奇数位，英文前加空格补齐
			// 测试一下全英文状态防止出错
			var testTmp = tmp
				.replace(/[\w]/g, '')
				.replace(configs.Space, '')
				.replace(configs.HWPunctuation, '')
				.replace(configs.FWPunctuation, '')
				.length === 0;
			if ((tmp.len() < cutNum) && !testTmp) {
				if (tmp.match(/([\u4e00-\u9fa0！（），．：；？‘’“”。『』「」])([0-9a-zA-Z])/)) {
					tmp = tmp.replace(/([\u4e00-\u9fa0！（），．：；？‘’“”。『』「」])([0-9a-zA-Z])/, '$1 $2')
				} else {
					tmp = tmp.replace(/([0-9a-zA-Z])([\u4e00-\u9fa0！（），．：；？‘’“”。『』「」])/, '$1 $2')
				}
				tmp = tmp.replace(/([“‘『「][0-9a-zA-Z ]+[」』’”])/g, function(m) {
					return m.replace(/ /g, '') + ' ';
				})
			}
			text += tmp + '\n';
		}
		tmpstr += text + sm;
	} else {
		tmpstr += linestr + bm;
	}
	return tmpstr;
}

// 阿拉伯数字转换格式
function cc(s) {
	// 验证输入的字符是否为数字
	if (isNaN(s)) return
	// 字符处理完毕后开始转换，采用前后两部分分别转换
	s = s.toLocaleString()
	return s.replace(/\.00$/, "")
}

function doTidy(str) {
	// 引号替换
	var others = [
		[/“/g, '「'],
		[/”/g, '」'],
		[/‘/g, '『'],
		[/’/g, '』']
	];
	// 结尾的文字，编辑user.js文件
	var eStrs = new RegExp('^[ 　]*([（【“「<]?)(' + configs.endStrs + ')([）】”」>]?)$', 'gm');

	// 执行整理
	var str = str
		// 排版初始化，去空格空行
		.replaceInit()
		// 引号替换
		.replaces(others)
		// 转换半角
		.convertNumberLetter()
		// 英文首字大写
		//.convertInitial()
		// 修正分隔符号
		.replaceSeparator();

	var words = str.split('\n');
	var count = words.length;

	// 开始进行分隔
	var re = '';
	for (var i = 0; i < count; i++)
		re += doSplit(words[i].trim(), '\n', '\n\n');

	re = re
		.replace(/作者：(.*)\n(.*)发表于：(.*)\n是否首发：(.*)\n字数：(.*)\n/gm, '')
		// 修正结尾
		.replace(eStrs, function(m) {
			return doCenter(m, '', '', true);
		})
		// 标题居中
		.replaceTitle('', '', true)
		// 去除多余空行
		.replace(/^([ 　]+)$\n/gm, '')
		.replace(/\n{3,}$/gm, '\n\n')
		.replace(/^\n{2,}/gm, '\n')
	re = '\n' + re;

	// 插入标头
	var slength = re.length
	var spacecount = re.findCount(/[ 　\u2003\u200b\ue4c6\uf8f5\ue004\uf04a\s\uFEFF\xA0]/g)

	var headVal = {
		'writer': $('#inputAuthor').val().trim(),
		'bbsname': $('#inputSite').val().trim(),
		'dateStr': new Date().format("yyyy/MM/dd"),
		'strNum': cc(slength - spacecount)
	}

	var headStr = '作者：{writer}\n\
{dateStr}发表于：{bbsname}\n\
是否首发：是\n\
字数：{strNum} 字\n\
'.format(headVal);
	/**
	var inputBookName = $('#inputBookName').val(),
		inputChapter = $('#inputChapter').val(),
		inputBookInfo = ''
	if(inputBookName.length > 0){
		inputBookInfo = '【' + inputBookName.trim().replace(/^([（【“「<]|[）】”」>]$)/g, '') + '】'
		if(inputChapter.length > 0)
			inputBookInfo = inputBookInfo + '（' + inputChapter.trim().replace(/^([（【“「<]|[）】”」>]$)/g, '') + '）'
	}
	if(inputBookInfo.length > 0)
		inputBookInfo = inputBookInfo + '\n\n' + headStr
	else
		inputBookInfo = headStr
	**/
	return headStr + re;
}

// 一键整理
function getCleanUp(str) {
	// 排版初始化，去空格空行
	str = str.replaceInit()
	// HTML 字符实体转换
	if ($('#Check_0').is(':checked'))
		str = str.converHtmlEntity()
	// Unicode转换
	if ($('#Check_1').is(':checked'))
		str = str.converUnicode()
	// 转换变体字母
	if ($('#Check_2').is(':checked'))
		str = str.convertVariant()
	// 转换变体序号
	if ($('#Check_3').is(':checked'))
		str = str.convertSerialNumber()
	// 半角字母数字
	if ($('#Check_4').is(':checked'))
		str = str.convertNumberLetter()
	// 全角标点符号
	if ($('#Check_5').is(':checked'))
		str = str.convertPunctuation()
	// 修正章节标题
	if ($('#Check_6').is(':checked'))
		str = str.replaceTitle()
	// 去除汉字间的空格
	if ($('#Check_7').is(':checked'))
		str = str.replaceSpace()
	// 修正分隔符号
	if ($('#Check_8').is(':checked'))
		str = str.replaceSeparator()
	// 修正引号
	if ($('#Check_9').is(':checked'))
		str = str.replaceQuotes('‘’“”'.split(''))
	// 英文首字大写
	if ($('#Check_10').is(':checked'))
		str = str.convertInitial()
	// 结束
	return str.replaceEnd()
}

// 加粗标题
function boldTitle(str) {
	// 结尾的文字，编辑user.js文件
	var eStrs = new RegExp('^[ 　]*([（【“「<]?)(' + configs.endStrs + ')([）】”」>]?)$', 'gm');
	return str
		.replaceTitle('[b]', '[/b]', true)
		// 修正结尾
		.replace(eStrs, function(m) {
			return doCenter(m, '[b]', '[/b]', true);
		})
		.replace(/(\r|\r\n|\n\r)^\[\/b\]/gm, '[/b]\n')
		.replace(/^\[b\]([　]+)/gm, '$1[b]')
}

// 组合文章标题
function getTitle(){
	var inputBookName = $('#inputBookName').val(),
		inputChapter = $('#inputChapter').val(),
		inputBookInfo = ''
	if(inputBookName.length > 0){
		inputBookInfo = '【' + inputBookName.trim().replace(/^([（【“「<]|[）】”」>]$)/g, '') + '】'
		if(inputChapter.length > 0)
			inputBookInfo = inputBookInfo + '（' + inputChapter.trim().replace(/^([（【“「<]|[）】”」>]$)/g, '') + '）'
	}
	return inputBookInfo.length > 0 ? inputBookInfo : '此处标题'
}