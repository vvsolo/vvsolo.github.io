/**
 * typesetting for EverEdit
 * 注意：修改后请切记压缩方可生效！
 */
Object.extend(String.prototype, {
	// 排版初始化，去空格空行
	replaceInit: function() {
		return this
			// 去除首尾所有空格
			.trim()
			// 行尾加换行
			.replace(/$/g, '\n')
			// 去除所有多余空白行
			.replace(/\n\n+/g, '\n')
	},
	// 排版结束
	replaceEnd: function() {
		return this
			// 修正英文单独行
			.convertEngLine()
			// 其他修正
			.replaces(configs.rEnd)
			// 结尾特殊修正
			.__endFixed()
			// 去除所有多余行
			.replace(/\n\n\n+/gm, '\n\n')
			.replace(/^\n+/, '')
			.replace(/\n\n+$/, '\n')
	},
	// 一些特殊的修正
	__endFixed: function() {
		var arr1 = '」』”’', arr2 = '「『“‘'
		return this
			// 修正纬度
			.replace(configs.fixLatitude, function(m) {
				return m
					.cleanSpace()
					.replace(/[“”「」]/g, '"')
					.replace(/[‘’『』]/g, "'")
					.replace(/。/g, '.')
			})
			// 修正小写后缀
			.replace(configs.fixLowerExt, function(m) {
				return m
					.replace(/。/g, '.')
					.toLowerCase()
			})
			// 段首引号替换
			.replace(/^[」』”’]/gm, function(m) {
				return arr2.charAt(arr1.indexOf(m))
			})
			.replace(/([「『“‘])(?=。|！|？|……|——|~~|$)$/gm, function(m, m1) {
				return arr1.charAt(arr2.indexOf(m1)) + m.substring(1)
			})
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		return this
			// 去除汉字间的空格
			.cleanSpace(configs.hanSpace)
			// 英文数字后跟全角标点
			.cleanSpace(configs.engSpace)
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this
			.replaces(configs.rSeparator)
			.replace(/@@{3,}/g, configs.Separator)
	},
	// 引号修正
	replaceQuotes: function(m) {
		var re = this.replaces(configs.rQuotes)
		return (m === 'cn') ? re.replaceAt(configs.cnQuotes) : re
	},
	// 单独一行英文
	convertEngLine: function() {
		var eng = configs.findEng
		return this
			.replace(eng.Line, function(m) {
				// 如果是单词引用
				if (/^[“「][a-z]{1,6}(?:[。]|[！？]{1,3}|……|——)[」”]$/mi.test(m)) return m
				// 去除所有标点，数字
				var tmp = m.replace(eng.LineSkip, '')
				// 小于2个字符
				if (tmp.length < 2) return m
				// 没有逗号或空格
				if (!/[,， ]/.test(m)) return m
				return m
					.replaces(configs.halfSymbol)
					// 修正英文大小写
					.matchLower(/[\,， ][A-Z]/g)
					.matchUpper(/[\.\?\!\:\&] ?[a-z]/g)
					// 单个字母大写
					.matchUpper(/(?:^| )\b[a-z]\b(?:$| )/g)
					.trim()
			})
	},
	// 修正英文大小写
	convertEnglish: function() {
		var eng = configs.findEng,
			eWord = eng.Word, tmp
		return this
			// 转换英文小写
			// 07-03 修正其他字母转小写，仅是英文
			//.toLowerCase()
			.matchLower(/[a-zA-Z]/g)
			// 英文首写全大写
			.matchFirstUpper()
			.matchLower(/[\w][， ][A-Z]/g)
			// 处理连续的英语
			.matchUpper(eng.Continuous)
			// 处理包含有拉丁字母的
			.matchLower(eng.Latin)
			// 引用的全转小写
			.replace(eng.Quote, function(m) {
				return (eng.QuoteTest.test(m)) ?
					m : m.matchFirstUpper()
			})
			// 处理英语中的 ' 标点符号
			.replace(eng.Sep, function(m, m1, m2) {
				return m1.matchFirstUpper() + "'" + m2.toLowerCase()
			})
			// 括号内全是英文时，一般为缩拼大写
			.replace(eng.Bracket, function(m) {
				return (/ /.test(m)) ? m.matchFirstUpper() : m.toUpperCase()
			})
			// 处理单词全是英文和数字时，型号类全大写
			.replace(/\b[\w\-\~～]+\b/g, function(m) {
				return /\d/.test(m) ? m.toUpperCase() : m
			})
			// 处理英语中称呼缩写，非行尾的
			.replace(eng.HonorWord, function(m) {
				return m.matchFirstUpper().replace(/。/g, '.')
			})
			// 处理英语中网址
			.replace(eng.Url, function(m) {
				return m.replace(/。/g, '.').toLowerCase()
			})
			// 修正 单字母后词语首字母大写
			.replace(/\b[A-Z]\b [A-Z][a-z]/g, function(m) {
				return m.matchLower(/ [A-Z]/)
			})
			// 处理常用英语书写
			.matchUpper(('\\b(?:' + eng.WordUpper + ')\\b').getReg('gi'))
			.replace(('\\b(' + eWord + ')([0-9]{0,4}|[0-9]{1,4}[a-z]{0,6})\\b').getReg('gi'), function(m, m1, m2) {
				tmp = ('|' + eWord.toLowerCase() + '|').indexOf('|' + m1.toLowerCase() + '|') + 1
				return ('|' + eWord + '|').substr(tmp, m1.length) + m2.toUpperCase()
			})
			// 单个字母大写
			.matchUpper(/\b[a-z]\b/g)
	},
	// 半角字母数字
	convertNumberLetter: function(r) {
		return this
			// 全角小写字母后紧跟大写，用空格分隔
			.replace(/([Ａ-Ｚ][ａ-ｚ]+)(?=[Ａ-Ｚ][ａ-ｚ]+)/g, '$1 ')
			.replaceAt(configs.sNumberLetter)
	},
	// 全角字母数字
	convertFullNumberLetter: function(r) {
		return this
			.replaceAt(configs.sNumberLetter, true)
			// 修正章节标题里的为半角
			.replace(configs.regFullNumberTitle, function(m) {
				return m.replaceAt(configs.sNumberLetter)
			})
	},
	// Unicode转换
	convertUnicode: function() {
		return this
			.replace(/([＆&]#x|\\u?)[\da-f]{4}[;；]?/gi, function(m) {
				return unescape(m.replace(/[＆&]#x|\\u?/gi, '%u').replace(/[;；]/g, ''))
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
			return configs.sHtmlEntity[m1] || configs.sHtmlEntity[m1.toLowerCase()] || m
		})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaceAt(configs.sVariants)
	},
	// 转换变体序号
	convertSerialNumber: function() {
		var arr = configs.sSerialNumber,
			find = arr[1].split('|')
		return this.replace(('[' + arr[0] + ']').getReg(), function(m) {
			return '（{$zz}）'.fmt(find[arr[0].indexOf(m)] || '')
		})
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
		var lineLen = configs.Linenum * 2,
			str = this.trims(),
			strLen = str.len(), rema
		b1 = !checkNull(b1) ? b1 : ''
		b2 = !checkNull(b2) ? b2 : ''

		if (align === 'center') {
			rema = (strLen % 4 === 0) ? ' ' : ''

			if (lineLen > strLen)
				str = '　'.times(~~((lineLen - strLen) / 4)) + rema + str
		} else if (align === 'right') {
			rema = (strLen % 2 === 0) ? '' : ' '

			if (lineLen > strLen)
				str = '　'.times(~~((lineLen - strLen) / 2)) + rema + str
		}

		return (b1 + str + b2)
	},
	// 处理标题
	__Chapter: function(t, tpl, r, callback) {
		// 处理标题的外框
		// 第一章：【标题】/【第一章：标题】
		var rs = '^{$f}[{$b.0}]?(?:{$zz})[{$b.1}]?(?:{$sn})[{$b.0}]?(?:{$e}|$)[{$b.1}]?$'.fmt(t).chapReg()
		return this
			.replace(rs, function(m) {
				if (/。/.test(m)) return m
				return m.replace('[{$b}]'.chapReg('g'), ' ')
			})
			.replace(tpl.chapReg('gim', r), callback)
	},
	// 修正章节标题
	replaceTitle: function(b1, b2, c, relax) {
		var f = !checkNull(b1) ? b1 : '\n\n',
			e = !checkNull(b2) ? b2 : '',
			re = this,
			// 替换值
			regVal = regChapter,
			regSkip = configs.regSkipTitle

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
				.replace(('^' + regVal.s).chapReg(), '')
				// 修正结尾是上下的小标号
				.replace(/([^\d\.])[ ·]([上中下]|[一二三四五六七八九十百]{1,5})$/, '$1（$2）')
				// 中文间空格转换为逗号
				.replace(/ (?=[\u4E00-\u9FA5]{2,})/g, '，')
				.replace(/ (?=[\u4E00-\u9FA5])/g, '')
				// 去除只有间隔符的情况
				.replace(('^' + regVal.s + '$').chapReg(), '')
				// 修正注释
				.replace(/【?注(\d{1,2})】?/g, '【注$1】')
				// 修正结尾是数字的小标号
				.replace(/([^\d\.])(\d{1,2}\/\d{1,2})$/, '$1（$2）')
				.replace(/([^\d\.]) ?\b(\d{1,2})$/, '$1（$2）')
				// 修正结尾是希腊数字的小标号
				.replace(/ ?\b([IVXC]{1,6})\b$/i, function(m) {
					return '（' + m.toUpperCase() + '）'
				})
			return (str.length > 0 && sDiv) ? configs.Divide + str : str
		}
		
		// 过滤
		var checkSkip = function(str, t) {
			return regSkip[t || 't0'].test(str)
		}
		// 正则标题
		re = re
			/****** 修复标题间多余空格 ******/
			.cleanSpace('^{$ts}'.chapReg())
			/****** 非常规标题·无后续主体 ******/
			.__Chapter(regVal.t0, '^{$f}({$t0})(?:{$s}|$)$', '', function(m, m1) {
				return m1.setAlign(f, e, c)
			})
			/****** 非常规标题·可有后续主体 ******/
			.__Chapter(regVal.t1.join('|'), '^{$f}({$t1})({$s}{$e}|{$sn}$)$', '|', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (checkSkip(m) || /^[\!\?！？。]{1,3}$/.test(m2) || checkSkip(m, 't1'))
					return m
				return (m1 + handleTitle(m2)).setAlign(f, e, c)
			})
			/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
			// m1 章节 m2 间隔 m3 标题
			.__Chapter(regVal.t2, '^{$f}{$t2}({$sn})({$e}|$)$', '', function(m, m1, m2, m3) {
				// 防止错误，有句号不转；——开头不转；全标点不转
				if (checkSkip(m) || /^[\-\—]{2,4}/.test(m1) || (!relax && /^[！？。…]{1,3}$/.test(m3)))
					return m
				// 防止错误，没有间隔符情况下
				if (!m2) {
					// 如：第一部电影很好，很成功。
					// 如：一回头、一幕幕
					if ((!relax && /[，]|[！？。…’”』」]{1,3}$/.test(m3)) || checkSkip(m, 't2'))
						return m
				}
				if (!'{$n4}[{$c}]'.chapReg().test(m1))
					m1 = '第' + m1.replace(/(^第+| )/g, '').convertNumberLetter()
				// 数字补零
				m1 = m1.replace(/[0-9]+/, function(v) {
					return v.zeroize(2)
				})
				// 如果是完结标记
				if (/^(完|完结|待续)$/m.test(m3)) {
					return ('【' + m1 + '·' + m3 + '】')
				}
				return (m1 + handleTitle(m3)).setAlign(f, e, c)
			})
			/****** （01）/（02）标题/（一）/（一）标题 ******/
			.__Chapter(regVal.t3, '^{$f}{$t3}({$e}|$)$', '', function(m, m1, m2) {
				// 防止错误，有句号不转
				if (checkSkip(m)) return m
				m1 = m1.convertNumberLetter().zeroize(2)
				return (m1 + handleTitle(m2, 'no')).setAlign(f, e, c)
			})
		
		// 标题居中直接返回
		if (c === 'center' || c === 'break') return re

		// 以下为修复标题
		return re
			/****** 卷一/卷一：标题 ******/
			.__Chapter(regVal.t4, '^{$f}{$t4}{$sn}({$e}|$)$', '', function(m, m1, m2, m3) {
				return (f + '第' + m2 + m1 + handleTitle(m3) + e).convertNumberLetter()
			})
			/****** chapter 22/ chapter 55 abcd ******/
			.__Chapter(regVal.t5, '^{$f}{$t5}{$s}({$e}|$)$', '', function(m, m1, m2) {
				return (f + '第' + m1 + '章' + handleTitle(m2) + e).convertNumberLetter()
			})
			/****** 01/01./01.标题/一/一、/一、标题 ******/
			.__Chapter(regVal.t6, '^{$f}{$t6}({$s}|{$s}{$e}|$)$', '', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (checkSkip(m) || checkSkip(m, 't2') || /^[！？。]{1,3}$/.test(m2) || /[。]/.test(m))
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
				if (m.cleanSpace().eachRegTest(regSkip.t6))
					 return m
				// 数字补零
				m1 = m1.zeroize(2)
				return (f + '第' + m1 + '章' + handleTitle(m2) + e).convertNumberLetter()
			})
	},
	// 修复错转的章节标题
	replaceTitleError: function() {
		var getParrentArr = function(v) {
			return [
				['^{$f}第({$zz})[{$c.2}]：'.fmt(v).chapReg(), '$1、'],
				['^{$f}第({$zz})[{$c.2}]$'.fmt(v).chapReg(), '$1'],
				['^{$f}({$zz})[：、。\.\,]'.fmt(v).chapReg(), '$1、']
			]
		}
		// 第01章　连续
		var parent1 ='(^{$f}第{$n1}[{$c.2}](?:[：].{0,40}|$)$\\n+|^{$f}{$n1}(?:[：、。\\.\\,].{0,40}|$)$\\n+){2,}'.chapReg(),
			// 第一章　连续
			parent2 = '(^{$f}(第{$n3}[{$c.2}])(?:[：].{0,40}|$)$\\n+|^{$f}{$n3}(?:[：、。\\.\\,].{0,40}|$)$\\n+){2,}'.chapReg(),
			// （01）　连续
			parent3 = '(\\n+^{$f}（(?:{$n2}|{$n3})）(?:.{0,40}|$)$\\n+){2,}'.chapReg(),
			/***** 修复相同的连续章节标题 *****/
			fix1 = '(^{$f}(?:{$n1}|{$n3})(?:[：、。\\.\\,].{0,40}|$)$\\n+)\\1'.chapReg('gm'),
			fix2 = '(^{$f}（(?:{$n2}|{$n3})）(?:.{0,40}|$)$\\n+)\\1'.chapReg('gm')

		return this
			.replace(parent1, function(m) {
				return m
					.replaces(getParrentArr('{$n1}'))
					.replace(/^0{1,4}/gm, '')
					.replace(/\n\n+/gm, '\n')
			})
			.replace(parent2, function(m) {
				return m
					.replaces(getParrentArr('{$n3}'))
					.replace(/\n\n+/gm, '\n')
			})
			.replace('\\n\\n((?:{$n1}|{$n3})、?)'.chapReg(), '$1')
			.replace(parent3, function(m) {
				return m.replace(/\n\n*/gm, '\n')
			})
			.replace(fix1, function(m, m1) {
				return m1.replaceTitle('\n\n', '')
			})
			.replace(fix2, function(m, m1) {
				return m1.replaceTitle('\n\n', '')
			})
	}
});