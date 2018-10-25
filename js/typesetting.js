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
			.replace(/\n\n+/gm, '\n')
			// 英文间单引号替换
			.replace('[{$enSep}](?=[a-zA-Z])'.fmtReg(regCommon), '\'')
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
		var regStr = '\\w {$sfwPun}{$shwPun}'.fmt(regCommon)
		var pWord = configs.pWord
		var pWordLower = '|' + pWord.toLowerCase() + '|'
		return this
			// 转换英文小写
			.toLowerCase()
			// 英文首写全大写
			.matchUpper(/\b([a-zA-Z])/g)
			// 引用的全转小写
			.replace('[《“‘「『【\\"（]([{$zz}\n]{2,})[》”’」】』\\"）]'.fmtReg(regStr), function(m, m1) {
				// 全是英文时全部首字大写
				if (m1.match(/([…！？。\!\?\.]$|[，：；＆\,\:\;\&\']|\w)/g)) {
					return m
						.replaces(configs.halfSymbol)
						.matchLower(/[\, ][A-Z]/g)
						.matchUpper(/[\.\?\!\:\&][ ]?[a-z]/g)
				}
				return m
			})
			// 独占一行的全英文小写
			.replace('^([{$zz}]{2,})$'.fmtReg(regStr, 'gm'), function(m) {
				return m.matchLower(/[， ][A-Z]/g)
			})
			// 处理单词全是英文和数字时，型号类全大写
			.replace(/\b([\w\-\~～]+)\b/g, function(m) {
				return m.match(/\d/) ? m.toUpperCase() : m
			})
			// 处理连续的英语
			.matchUpper(('\\b(aa+|bb+|cc+|dd+|ee+|ff+|gg+|hh+|ii+|jj+|kk+|ll+|mm+|nn+|oo+|pp+|qq+|rr+|ss+|tt+|uu+|vv+|ww+|xx+|yy+|zz+)\\b').getReg('gi'))
			// 处理英语中的 ' 标点符号
			.replace('([a-z]+)(?:[{$enSep}])([a-z]+)'.fmtReg(regCommon, 'gi'), function(m0, m1, m2) {
				return m1.matchUpper(/\b[a-z]/g) + "'" + m2.toLowerCase()
			})
			// 处理英语中网址
			.replace(/([0-9a-zA-Z]+)[。\.]([\w—\-]+)[。\.](com|net|org|gov)/gi, function(m) {
				return m.replace(/。/g, '.').toLowerCase()
			})
			// 处理常用英语书写
			.replace(('\\b(' + pWord + ')(?:[0-9]*)\\b').getReg('gi'), function(m, m1) {
				var item = pWordLower.indexOf('|' + m1.toLowerCase() + '|')
				return (item > -1) ? ('|' + pWord + '|').substr(item + 1, m1.length) : m1
			})
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
				.replace(configs.regSBCNumberTitle.getReg(), function(m) {
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
		return this.replace(configs.regHtmlEntity, function(m, m1) {
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
			.replaceAt(configs.punSymbol)
			.replaces(configs.amendSymbols)
			// 修正所有数字和英文字母间的标点和空格
			.replaces(configs.nwSymbol)
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		var re = '[{$han}{$fwPun}]'.fmt(regCommon)
		return this
			// 修正汉字间的制表符为换行
			.replace('[\t]+(?=[{$han}])'.fmtReg(regCommon), '\n')
			// 去除汉字间的空格
			.replace(('[ ]+(?=' + re + ')').getReg(), '')
			// 英文数字后跟全角标点
			.replace(('([0-9a-zA-Z])[ ]+(' + re + ')').getReg(), '$1$2')
			.replace(('(' + re + ')[ ]+([0-9a-zA-Z])').getReg(), '$1$2')
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this
			// 注释标记※
			.replace(/＊{35,}/g, '\n!@!@!@!@!\n')
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

		var re = this.replace('[{$enSep}](?=[a-zA-Z])'.fmtReg(regCommon), '※@※')
		if (!simp) {
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
	// 标题位置函数，默认一行35全角字符
	setAlign: function(b1, b2, align) {
		var lineLength = configs.Linenum * 2,
			str = this.trim(),
			strLength = str.len()
		align = align || 'left'
		b1 = (b1 != null) ? b1 : ''
		b2 = (b2 != null) ? b2 : ''

		if (align === 'center') {
			var rema = (strLength % 4 === 0) ? ' ' : ''

			if (lineLength > strLength)
				str = '　'.times(parseInt((lineLength - strLength) / 4, 10)) + rema + str
		} else if (align === 'right') {
			var rema = (strLength % 2 === 0) ? '' : ' '

			if (lineLength > strLength)
				str = '　'.times(parseInt((lineLength - strLength) / 2, 10)) + rema + str
		} else {
			str = str.space()
		}
		return (b1 + str + b2)
	},
	// 处理标题的外框
	replaceBorder: function(tit) {
		var regVal = configs.regTitle
		regVal.t = tit
		regVal.b = configs.regTitleBorder
		var regBorder = '^{$f}[{$b.0}]?({$t})[{$b.1}]?({$s})?[{$b.0}]?({$e}|$)[{$b.1}]?$'.fmtReg(regVal, 'gm')
		return this.replace(regBorder, function(t) {
			return t.replace(('[' + regVal.b.join('') + ']').getReg('gm'), '')
		})
	},
	// 修正章节标题
	replaceTitle: function(b1, b2, center, relax) {
		var fBreak = b1 || '\n\n',
			eBreak = b2 || '',
			re = this,
			// 替换值
			regVal = configs.regTitle
		var rSeparatorLeft = ('^' + regVal.s).getReg('g'),
			rSeparatorAll = ('^' + regVal.s + '$').getReg('g')

		// 非严格限定
		if (relax === true) {
			// 标题间隔符（非严格限定）
			regVal.s = regVal.sn
			// 行尾（非严格限定）
			regVal.es = regVal.e
		}

		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			if (str.length == 0) return ''
			sDiv = !sDiv ? true : false
			str = str
				.replace(/[ ]+/g, ' ')
				.replace(rSeparatorLeft, '')
				// 中文间空格转换为逗号
				.replace(/[ ](?=[\u4E00-\u9FA5]{2,})/g, '，')
				.replace(/[ ](?=[\u4E00-\u9FA5])/g, '')
				// 去除只有间隔符的情况
				.replace(rSeparatorAll, '')
			return (str.length > 0 && sDiv) ? configs.Divide + str : str
		}
		// 返回正则
		var rr = function(str, r) {
			return str.fmtReg(regVal, 'gim', r)
		}
		// 正则标题
		
		re = re
			/****** 非常规标题 ******/
			.replaceBorder(regVal.t1.join('|'))
			.replace(rr('^{$f}({$t1})(?:{$sn})({$e}|$)$', '|'), function(m0, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (m0.match(/[。]/g) || m2.match(/^[！？。]{1,3}$/g))
					return m0
				return (m1 + handleTitle(m2)).setAlign(fBreak, eBreak, center)
			})
			/****** 一章/第一章/一章：标题/第一章：标题 ******/
			// m1 章节 m2 间隔 m3 标题
			.replaceBorder(regVal.t2)
			.replace(rr('^{$f}{$t2}({$sn})({$e}|$)$'), function(m0, m1, m2, m3) {
				// 防止错误，有句号不转；——开头不转；全标点不转
				if (m0.match(/[。]/g) || m2.match(/^[\-—]{1,4}/g) || m3.match(/^[！？。…]{1,3}$/g))
					return m0
				// 防止错误，没有间隔符情况下
				if (!m2.match(rSeparatorLeft)) {
					// 如：第一部电影很好，很成功。
					// 如：一回头、一幕幕
					if (m3.match(/[，]|[！？。…’”』」]{1,3}$/g) || m0.match(configs.regSkipTitle))
						return m0
				}
				return ('第' + m1.replace(/(^[第]+| )/g, '') + handleTitle(m3)).setAlign(fBreak, eBreak, center)
			})
			/****** （一）/（一）标题 ******/
			.replaceBorder(regVal.t5)
			.replace(rr('^{$f}{$t5}({$e}|$)$'), function(m0, m1, m2) {
				// 防止错误，有句号不转
				if (m0.match(/[。]/g)) return m0
				return (m1 + handleTitle(m2, 'no')).setAlign(fBreak, eBreak, center)
			})
		// 如果是居中返回
		if (center === 'center') return re
		
		var pattern = configs.regSkipTitle1
		return re
			/****** 卷一/卷一：标题 ******/
			.replaceBorder(regVal.t3)
			.replace(rr('^{$f}{$t3}(?:{$sn})({$e}|$)$'), function(m0, m1, m2, m3) {
				return (fBreak + '第' + m2 + m1 + handleTitle(m3) + eBreak)
			})
			/****** chapter 22/ chapter 55 abcd ******/
			.replaceBorder(regVal.t6)
			.replace(rr('^{$f}{$t6}(?:{$s})({$e}|$)$'), function(m0, m1, m2) {
				return (fBreak + '第' + m1 + '章' + handleTitle(m2) + eBreak)
			})
			/****** 01/01./01.标题/一/一、/一、标题 ******/
			.replaceBorder(regVal.t4)
			.replace(rr('^{$f}{$t4}({$s}|{$s}{$es}|$)$'), function(m0, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (m0.match(/[。]/g) || m2.match(/^[！？。…]{1,3}$/g))
					return m0
				// 章节是数字格式情况下
				if (m1.match(/^[\d０-９]+/gm)) {
					// 没有间隔符，以句号结尾不处理
					if (m2.match(/[！？。]$/g))
						return m0
				} else {
					// 全是标点不处理
					if (m2.match(/[，,]|[！？。…’”』」]$/g))
						return m0
				}
				// 其他处理过滤
				for (var i = 0; i < pattern.length; i++) {
					if (m0.match(pattern[i]))
						return m0
				}
				return (fBreak + '第' + m1 + '章' + handleTitle(m2) + eBreak)
			})
	}
});