/**
 * typesetting for EverEdit
 * 注意：修改后请切记压缩方可生效！
 */
Object.extend(String.prototype, {
	// 排版初始化，去空格空行
	replaceInit: function() {
		return this
			// 转换所有空格样式为标准
			//.space()
			// 去除首尾所有空格
			.trim()
			// 行尾加换行
			.replace(/$/, '\n')
			// 去除所有多余空白行
			.replace(/\n\n+/g, '\n')
			// 英文间单引号替换
			//.replace(configs.enSepF, '$1\'')
			//.replace(configs.enSepE, '\'')
			// 修正引号
			//.__amendQuotes()
	},
	// 排版结束
	replaceEnd: function() {
		return this
			// 修正引号
			.__amendQuotes()
			// 修正英文单独行
			.convertEngLine()
			// 其他修正
			.replaces(configs.rEnd)
			// 去除所有多余行
			.replace(/\n\n{2,}/g, '\n\n')
			.replace(/^\n+/, '')
	},
	// 修正引号
	__amendQuotes: function() {
		var arr1 = '」』”’',
			arr2 = '「『“‘'
		return this
			// 段首引号替换
			.replace(/^[」』”’]/gm, function(m) {
				return arr2.charAt(arr1.indexOf(m))
			})
			.replace(/[「『“‘](?=。|！|？|……|——|~~|$)$/gm, function(m) {
				return arr1.charAt(arr2.indexOf(m.substring(0, 1))) + m.substring(1)
			})
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		return this
			// 去除汉字间的空格
			.replace(configs.hanSpace, '')
			// 英文数字后跟全角标点
			.replace(configs.engSpace, '$1')
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this
			.replaces(configs.rSeparator)
			.replace(/@{4,}/g, configs.Separator)
	},
	// 引号修正
	replaceQuotes: function(m) {
		var re = this
			.replaces(configs.rQuotes)
		return (m === 'cn') ? re.replaceAt(configs.cnQuotes) : re
	},
	// 单独一行英文
	convertEngLine: function() {
		return this
			.replace(configs.findEngLine, function(m) {
				// 去除所有标点，数字
				var tmp = m.replace(configs.findEngLineSkip, '')
				// 小于2个字符
				if (tmp.length < 2) return m
				return m
					.replaces(configs.halfSymbol)
					// 修正英文大小写
					.matchLower(/[\,， ][A-Z]/g)
					.matchUpper(/[\.\?\!\:\&] ?[a-z]/g)
					.trim()
			})
	},
	// 修正英文大小写
	convertEnglish: function() {
		var pWord = configs.pWord
		return this
			// 转换英文小写
			.toLowerCase()
			// 英文首写全大写
			.matchUpper(/\b[a-z]/g)
			.matchLower(/[,， ][A-Z]/g)
			// 独占一行的全英文小写
			//.convertEngLine()
			// 引用的全转小写
			.replace(configs.findEngQuote, function(m, m1) {
				return (configs.findEngQuoteTest.test(m)) ?
					m : m.matchUpper(/\b[a-z]/g).matchLower(/[,， ][A-Z]/g)
			})
			// 处理英语中的 ' 标点符号
			.replace(configs.enSepQ, function(m, m1, m2) {
				return m1.matchUpper(/\b[a-z]/g) + "'" + m2.toLowerCase()
			})
			// 括号内全是英文时，一般为缩拼大写
			.replace(configs.findEngBracket, function(m) {
				return (/ /.test(m)) ? m.matchUpper(/\b[a-z]/g) : m.toUpperCase()
			})
			// 处理单词全是英文和数字时，型号类全大写
			.replace(/\b[\w\-\~～]+\b/g, function(m) {
				return /\d/.test(m) ? m.toUpperCase() : m
			})
			// 处理连续的英语
			.matchUpper(configs.continuouWord)
			// 处理英语中称呼缩写，非行尾的
			.replace(configs.honorWord, function(m, m1) {
				return m1.matchUpper(/\b[a-z]/g) + "."
			})
			// 处理英语中网址
			.replace(configs.findUrl, function(m) {
				return m.replace(/。/g, '.').toLowerCase()
			})
			// 处理包含有拉丁字母的
			.replace(configs.findLatin, function(m) {
				return m.toLowerCase()
			})
			// 处理常用英语书写
			.matchUpper(('\\b(?:' + configs.pWordUpper + ')\\b').getReg('gi'))
			.replace(('\\b(' + pWord + ')([0-9]{0,4}|[0-9]{1,4}[a-z]{0,6})\\b').getReg('gi'), function(m, m1, m2) {
				var item = ('|' + pWord.toLowerCase() + '|').indexOf('|' + m1.toLowerCase() + '|') + 1
				return ('|' + pWord + '|').substr(item, m1.length) + m2.toUpperCase()
			})
	},
	// 全角半角字母数字，ve=1时全角
	convertNumberLetter: function(r) {
		return this
			// 转换字母为全角
			.convertLetter(r)
			// 转换数字为全角
			.convertNumber(r)
	},
	/*
	 * 半角数字(0-9): [\u0030-\u0039] （DBC case）
	 * 全角数字(0-9): [\uFF10-\uFF19] （SBC case）
	 */
	// 半角数字
	__convertDBCNumber: function() {
		return this.replace(/[\uFF10-\uFF19]/g, function(m) {
			return String.fromCharCode(m.charCodeAt(0) - 65248)
		})
	},
	// 转换标题内的数字为半角
	__convertSBCNumberTitle: function() {
		return this.replace(configs.regSBCNumberTitle, function(m) {
			return m.__convertDBCNumber()
		})
	},
	// 全角或半角数字，ve=1时全角
	convertNumber: function(r) {
		return (r === 1) ?
			this.replace(/[\u0030-\u0039]/g, function(m) {
				return String.fromCharCode(m.charCodeAt(0) + 65248)
			})
			// 转换标题内的数字为半角
			.__convertSBCNumberTitle() :
			this.__convertDBCNumber()
				// 修正所有数字和英文字母间的标点和空格
				.replaces(configs.nwSymbol)
	},
	/*
	 * 全角半角字母，ve=1时全角
	 * 半角小写英文字母(a-z): [\u0061-\u007A]
	 * 全角小写英文字母(ａ-ｚ): [\uFF41-\uFF5A]
	 * 半角大写英文字母(A-Z): [\u0041-\u005A]
	 * 全角大写英文字母(Ａ-Ｚ): [\uFF21-\uFF3A]
	 */
	convertLetter: function(r) {
		// 全角小写字母后紧跟大写，用空格分隔
		var re = this.replace(/([Ａ-Ｚ][ａ-ｚ]+)(?=[Ａ-Ｚ][ａ-ｚ]+)/g, '$1 ')
		return (r === 1) ?
			re.replace(/[a-z]/gi, function(m) {
				return String.fromCharCode(m.charCodeAt(0) + 65248)
			}) :
			re.replace(/[Ａ-Ｚａ-ｚ]/g, function(m) {
				return String.fromCharCode(m.charCodeAt(0) - 65248)
			})
	},
	// Unicode转换
	convertUnicode: function() {
		return this
			.replace(/([＆&]#x|\\u?)[\da-f]{4}[;；]?/gi, function(m) {
				return unescape(m.replace(/[＆&]#x|\\u?/g, '%u').replace(/[;；]/g, ''))
			})
			.replace(/[＆&]#(\d+)[;；]/g, function(m, m1) {
				return String.fromCharCode(m1)
			})
			.replace(/([%％][\da-f]{2})+/gi, function(m) {
				try {
					return decodeURIComponent(m.replace(/％/g, '%'))
				} catch(err) {}
				return m
			})
	},
	// html转义符转换
	convertHtmlEntity: function() {
		return this.replace(configs.regHtmlEntity, function(m, m1) {
			return configs.sHtmlEntity[m1] || m
		})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaceAt(configs.sVariants)
	},
	// 转换变体序号
	convertSerialNumber: function() {
		return this.replaceAtSplit(configs.sSerialNumber, '（{$zz}）')
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
		} else
			str = str.space()

		return (b1 + str + b2)
	},
	// 处理标题的外框
	replaceBorder: function(tit) {
		regChapter.t = tit
		var r = '^{$f}[{$b.0}]?(?:{$t})[{$b.1}]?(?:{$sn})[{$b.0}]?(?:{$e}|$)[{$b.1}]?$'.fmtReg(regChapter, 'gm')
		var t = ('[{$b}]').fmtReg(regChapter)
		return this.replace(r, function(m) {
			return m.replace(t, ' ')
		})
	},
	// 处理标题
	__Chapter: function(t, tpl, r, callback) {
		// 返回正则
		var rr = function(str, r) {
			return str.fmtReg(regChapter , 'gim', r)
		}
		//alert(rr(tpl.fmt(t)))
		return this
			.replaceBorder(t)
			.replace(rr(tpl.fmt(t), r), callback)
	},
	// 修正章节标题
	replaceTitle: function(b1, b2, c, relax) {
		var f = b1 || '\n\n',
			e = b2 || '',
			re = this,
			// 替换值
			regVal = regChapter
		var rSeparatorLeft = ('^' + regVal.s).getReg(),
			rSeparatorRight = (regVal.s + '$').getReg(),
			rSeparatorAll = ('^' + regVal.s + '$').getReg()

		// 非严格限定
		if (relax) {
			// 标题间隔符（非严格限定）
			regVal.s = regVal.sn
			// 行尾（非严格限定）
			regVal.es = regVal.e
		}

		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			if (str.length === 0) return ''
			sDiv = !sDiv ? true : false
			str = str
				.replace(/  +/g, ' ')
				.replace(rSeparatorLeft, '')
				// 中文间空格转换为逗号
				.replace(/ (?=[\u4E00-\u9FA5]{2,})/g, '，')
				.replace(/ (?=[\u4E00-\u9FA5])/g, '')
				// 去除只有间隔符的情况
				.replace(rSeparatorAll, '')
				// 修正注释
				.replace(/【?注(\d{1,2})】?/g, '【注$1】')
				// 修正结尾是数字的小标号
				.replace(/([^\d\.])\b(\d{1,2})$/, '$1（$2）')
			return (str.length > 0 && sDiv) ? configs.Divide + str : str
		}
		
		// 返回正则
		var rr = function(str, r) {
			return str.fmtReg(regVal , 'gim', r)
		}

		// 过滤
		var checkSkip = function(str, t) {
			t = t || 't0'
			return configs.regSkipTitle[t].test(str)
		}
		// 正则标题
		re = re
			/****** 非常规标题·无后续主体 ******/
			.__Chapter(regVal.t0, '^{$f}({$zz})(?:{$s}|$)$', '', function(m, m1) {
				return m1.setAlign(f, e, c)
			})
			/****** 非常规标题 ******/
			.__Chapter(regVal.t1.join('|'), '^{$f}({$zz})(?:{$sn})({$e}|$)$', '|', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (checkSkip(m) || /^[\!\?！？。]{1,3}$/.test(m2) || checkSkip(m, 't1'))
					return m
				return (m1 + handleTitle(m2)).setAlign(f, e, c)
			})
			/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
			// m1 章节 m2 间隔 m3 标题
			.__Chapter(regVal.t2, '^{$f}{$zz}({$sn})({$e}|$)$', '', function(m, m1, m2, m3) {
				// 防止错误，有句号不转；——开头不转；全标点不转
				if (checkSkip(m) || /^[\-\—]{2,4}/.test(m1) || (!relax && /^[！？。…]{1,3}$/.test(m3)))
					return m
				// 防止错误，没有间隔符情况下
				//if (!rSeparatorLeft.test(m2)) {
				if (!m2) {
					// 如：第一部电影很好，很成功。
					// 如：一回头、一幕幕
					if ((!relax && /[，]|[！？。…’”』」]{1,3}$/.test(m3)) || checkSkip(m, 't2'))
						return m
				}
				if (!'{$n4}[{$c}]'.fmtReg(strChapter).test(m1))
					m1 = '第' + m1.replace(/(^第+| )/g, '').__convertDBCNumber()
				return (m1 + handleTitle(m3)).setAlign(f, e, c)
			})
			/****** （01）/（02）标题/（一）/（一）标题 ******/
			.__Chapter(regVal.t3, '^{$f}{$zz}({$e}|$)$', '', function(m, m1, m2) {
				// 防止错误，有句号不转
				if (checkSkip(m)) return m
				m1 = m1.__convertDBCNumber()
				return (m1 + handleTitle(m2, 'no')).setAlign(f, e, c)
			})
		
		// 标题居中直接返回
		if (c === 'center' || c === 'break') return re

		// 以下为修复标题
		var pattern = configs.regSkipTitle.t6
		return re
			/****** 卷一/卷一：标题 ******/
			.__Chapter(regVal.t4, '^{$f}{$zz}(?:{$sn})({$e}|$)$', '', function(m0, m1, m2, m3) {
				return (f + '第' + m2 + m1 + handleTitle(m3) + e).__convertDBCNumber()
			})
			/****** chapter 22/ chapter 55 abcd ******/
			.__Chapter(regVal.t5, '^{$f}{$zz}(?:{$s})({$e}|$)$', '', function(m, m1, m2) {
				return (f + '第' + m1 + '章' + handleTitle(m2) + e).__convertDBCNumber()
			})
			/****** 01/01./01.标题/一/一、/一、标题 ******/
			.__Chapter(regVal.t6, '^{$f}{$zz}({$s}|{$s}{$e}|$)$', '', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (checkSkip(m) || /^[！？。]{1,3}$/.test(m2))
					return m
				// 章节是数字格式情况下
				if (/^[\d０-９]+/.test(m1)) {
					// 没有间隔符，以句号结尾不处理
					if (/[！？。]$/.test(m2)) return m
				} else {
					// 全是标点不处理
					if (/[！？。…’”』」]$/.test(m2)) return m
				}
				// 其他处理过滤
				for (var i = 0; i < pattern.length; i++)
					if (pattern[i].test(m)) return m
				return (f + '第' + m1 + '章' + handleTitle(m2) + e).__convertDBCNumber()
			})
	},
	// 修复错转的章节标题
	replaceTitleError: function() {
		var re = this
		// 返回正则
		var rr = function(str) {
			return str.fmtReg(strChapter, 'gm')
		}
		// 第01章　连续
		var parent = rr('(^[{$space}]*(第{$n1}[{$c.2}])(：.{0,40}|$)$\\n+){2,}'),
			p1, p2
		if(parent.test(re)) {
			p1 = rr('^第({$n1})[{$c.2}]：')
			p2 = rr('^第({$n1})[{$c.2}]$')
			re = re
				.replace(parent, function(m) {
					return m
						.replace(p1, '$1、')
						.replace(p2, '$1')
						.replace(/\n\n+/gm, '\n')
				})
				.replace(rr('\\n\\n({$n1}、?)'), '$1')
		}
		// 第一章　连续
		parent = rr('(^[{$space}]*(第{$n3}[{$c.2}])(：.{0,40}|$)$\\n+){2,}')
		if(parent.test(re)) {
			p1 = rr('^第({$n3})[{$c.2}]：')
			p2 = rr('^第({$n3})[{$c.2}]$')
			re = re
				.replace(parent, function(m) {
					return m
						.replace(p1, '$1、')
						.replace(p2, '$1')
						.replace(/\n\n+/gm, '\n')
				})
				.replace(rr('\\n\\n({$n3}、?)'), '$1')
		}
		return re
	},
	// 修复错转的章节标题
	replaceTitleErrorBracket: function() {
		var re = this
		// （01）　连续
		var parent = '(\\n+^[{$space}]*（(?:{$n2}|{$n3})）(.{0,40}|$)$\\n+){2,}'.fmtReg(strChapter, 'gm')
		if(parent.test(re)) {
			re = re
				.replace(parent, function(m) {
					return m.replace(/\n\n*/gm, '\n')
				})
		}
		return re
	}
});