/**
 * typesetting for EverEdit
 * 注意：修改后请切记压缩方可生效！
 */

Object.extend(String.prototype, {
	// 排版初始化，去空格空行
	replaceInit: function() {
		return this
			// 转换所有空格样式为标准
			.space()
			// 去除首尾所有空格
			.trim()
			// 所有行尾加换行
			.replace(/$/g, '\n')
			// 去除所有多余空白行
			.replace(/\n{2,}/gm, '\n')
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
		var re = this
			// 转换英文小写
			.toLowerCase()
			// 英文首写全大写
			.toUpper(/\b([a-zA-Z])/g, true)
			// 引用的全转小写
			.replace(/[《“‘「『【\"（]([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\'\n]{2,})[》”’」】』\"）]/gm, function(m, m1) {
				// 全是英文时全部首字大写
				if((m1.match(/[…！？。\!\?\.]$/g) || m1.match(/[，：；＆\,\:\;\&\']/g)) && m1.match(/\w/g)){
					return m
						.toUpper(/[，\, ][A-Z]/g, false)
						.replaces(configs.halfSymbol)
						.toUpper(/[\.\?\!\:\&][ ]?[a-z]/g, true)
				}
				return m
			})
			// 独占一行的全英文小写
			.replace(/^([\w ！（），：；？–…。＆＠＃\!\(\)\,\:\;\?\-\.\&\@\#\']{2,})$/gm, function(m) {
				return m.toUpper(/[， ][A-Z]/g, false)
			})
			// 处理单词全是英文和数字时
			.replace(/\b([A-Za-z\d]+)\b/g, function(m) {
				return m.match(/\d/) ? m.toUpperCase() : m
			})
			
			// 型号类全大写
			.toUpper(/([a-zA-Z]+[\-—\~～]\d|\d[\-—\~～][a-zA-Z]+)/g, true)
			// 处理连续的英语
			.toUpper(/\b(a{2,}|b{2,}|c{2,}|d{2,}|e{2,}|f{2,}|g{2,}|h{2,}|i{2,}|j{2,}|k{2,}|l{2,}|m{2,}|n{2,}|o{2,}|p{2,}|q{2,}|r{2,}|s{2,}|t{2,}|u{2,}|v{2,}|w{2,}|x{2,}|y{2,}|z{2,})\b/gi, true)
			// 处理英语中的 ' 标点符号
			.replace(/([a-zA-Z]+)[\'\`＇‘’『』]([a-zA-Z]+)/g, function(m0, m1, m2) {
				return m1.toUpper(/\b[a-z]/g, true) + "'" + m2.toLowerCase()
			})
			// 处理英语中网址
			.replace(/([0-9a-zA-Z]+)[。\.]([0-9a-zA-Z—\-_]+)[。\.](com|net|org|gov)/gi, function(m) {
				return m.replace(/。/g, '.').toLowerCase()
			})
			
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
				.replace(new RegExp(configs.regSBCNumberTitle, 'g'), function(m) {
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
			//.replace(/([%％][\da-f]{2})+/gi, function(m) {
			//	return decodeURIComponent(m.replace(/％/g, '%')) || decodeURI(m.replace(/％/g, '%')) || m;
			//})
	},
	// html转义符转换
	converHtmlEntity: function() {
		return this.replace(configs.regHtmlEntity, function(m, m1){
				return configs.sHtmlEntity[m1] || m
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
	// 标题居中函数，默认一行35全角字符
	toTitleCenter: function(b1, b2, center) {
		var lineLength = configs.Linenum*2
		var str = this.trim()

		if(center === true){
			var strLength = str.len()
			var rema = (strLength%4 === 0) ? ' ' : ''

			if (center && lineLength > strLength)
				str = '　'.times(parseInt((lineLength - strLength) / 4, 10)) + rema + str
		}
		return ((b1 || '\n') + str + (b2 || ''))
	},
	// 处理标题的外框
	replaceBorder: function(tit) {
		var regVal = configs.regTitle
		regVal.t = tit
		regVal.b = configs.regTitleBorder
		var regBorder = '^{$f}[{$b.0}]?({$t})[{$b.1}]?({$s})?[{$b.0}]?({$e}|$)[{$b.1}]?$'.fmt(regVal)
		return this.replace(regBorder.getReg('gm'), function(t) {
			return t.replace(('[' + regVal.b.join('') + ']').getReg('gm'), '')
		})
	},
	// 修正章节标题
	replaceTitle: function(b1, b2, center, relax) {
		var fBreak = b1 || '\n\n'
		var eBreak = b2 || ''
		var re = this
		// 替换值
		var regVal = configs.regTitle
		var rSeparatorLeft = ('^' + regVal.s).getReg('g')
		var rSeparatorAll = ('^' + regVal.s + '$').getReg('g')

		// 非严格限定
		if(relax === true){
			// 标题间隔符（非严格限定）
			regVal.s = regVal.sn
			// 行尾（非严格限定）
			regVal.es = regVal.e
		}
		/****** 分隔符居中 ******/
		if (center === true) {
			re = re.replace((regVal.f + configs.Separator).getReg('gm'), function(m) {
				return m.toTitleCenter('', '', true)
			})
		}
		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			if(str.length == 0) return ''
			sDiv = !sDiv ? true : false
			str = str
				.replace(/[ ]{1,}/g, ' ')
				.replace(rSeparatorLeft, '')
				// 中文间空格转换为逗号
				.replace(/([\u4E00-\u9FA5]{2,})[ ]([\u4E00-\u9FA5]{2,})/g, '$1，$2')
				.replace(/([\u4E00-\u9FA5])[ ]([\u4E00-\u9FA5])/g, '$1$2')
				.replace(/(\w+)[ ]{1,4}(\w+)/g, '$1 $2')
				// 去除只有间隔符的情况
				.replace(rSeparatorAll, '')
			return (str.length > 0 && sDiv) ? configs.Divide + str : str
		}
		// 返回正则
		var rr = function(str, r) {
			return new RegExp(str.fmt(regVal, r), 'gim')
		}
		// 正则标题
		/****** 非常规标题 ******/
		var regStr = rr('^{$f}({$t1})(?:{$sn})({$e}|$)$', '|')
		re = re.replaceBorder(regVal.t1.join('|')).replace(regStr, function(m0, m1, m2) {
			// 防止错误判断一下标题
			if(m2.match(/^[！？。]{1,3}$/g)) return m0
			return (m1 + handleTitle(m2)).toTitleCenter(fBreak, eBreak, center)
		})
		/****** 一章/第一章/一章：标题/第一章：标题 ******/
		regStr = rr('^{$f}{$t2}({$sn})({$e}|$)$')
		// m1 章节 m2 间隔 m3 标题
		re = re.replaceBorder(regVal.t2).replace(regStr, function(m0, m1, m2, m3) {
			// 防止错误判断一下标题：——开头，或全是标点
			if(m2.match(/^[\-—]{1,4}/g) || m3.match(/^[！？。…]{1,3}$/g))
				return m0
			// 防止错误判断一下标题：第一部电影很好，很成功。
			if(!m2.match(rSeparatorLeft) && m3.match(/[，]|[！？。…]{1,3}$/g))
				return m0
			// 防止错误判断一下标题：一回头、一幕幕
			if((m0.match(configs.regSkipTitle) && !m2.match(rSeparatorLeft) && m3.match(/[！？。…]{1,3}$/g)))
				return m0
			return ('第' + m1.replace(/(^[第]+| )/g, '') + handleTitle(m3)).toTitleCenter(fBreak, eBreak, center)
		})
		/****** （一）/（一）标题 ******/
		regStr = rr('^{$f}{$t5}({$e}|$)$')
		re = re.replaceBorder(regVal.t5).replace(regStr, function(m0, m1, m2) {
			return (m1 + handleTitle(m2, 'no')).toTitleCenter(fBreak, eBreak, center)
		})
		// 如果是居中返回
		if (center === true) return re

		/****** 卷一/卷一：标题 ******/
		regStr = rr('^{$f}{$t3}(?:{$sn})({$e}|$)$')
		re = re.replaceBorder(regVal.t3).replace(regStr, function(m0, m1, m2, m3) {
			return (fBreak + '第' + m2 + m1 + handleTitle(m3) + eBreak)
		})
		/****** chapter 22/ chapter 55 abcd ******/
		regStr = rr('^{$f}{$t6}(?:{$s})({$e}|$)$')
		re = re.replaceBorder(regVal.t6).replace(regStr, function(m0, m1, m2) {
			return (fBreak + '第' + m1 + '章' + handleTitle(m2) + eBreak)
		})
		/****** 01/01./01.标题/一/一、/一、标题 ******/
		var pattern = configs.regSkipTitle1
		regStr = rr('^{$f}{$t4}({$s}|{$s}{$e}|$)$')
		re = re.replaceBorder(regVal.t4).replace(regStr, function(m0, m1, m2) {
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
			return (fBreak + '第' + m1 + '章' + handleTitle(m2) + eBreak)
		})
		return re
	}
});
