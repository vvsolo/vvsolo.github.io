/**
 * typo is novel text typeseting tool
 * author: vsolo 
 */
extend(String.prototype, {
	// 排版初始化，去空格空行
	replaceInit: function() {
		return this
			// 去除首尾所有空格
			.trim()
			// 行尾加换行
			.replace(/$/, '\n')
			// 去除所有多余空白行
			.replace(/\n\n+/g, '\n');
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
			// 结尾修正
			.replaceFinish();
	},
	// 结尾修正
	replaceFinish: function() {
		var arr1 = '」』”’', arr2 = '「『“‘';
		return this
			// 段首引号替换
			.replace(/^[」』”’]/gm, function(m) {
				return arr2.charAt(arr1.indexOf(m))
			})
			.replace(/[「『“‘](?=。|！|？|……|——|~~|$)$/gm, function(m) {
				return arr1.charAt(arr2.indexOf(m.charAt(0))) + m.substring(1)
			})
			// 去除所有多余行
			.replace(/\n\n\n+/g, '\n\n')
			.replace(/^\n+/, '')
			.replace(/\n\n+$/, '\n');
	},
	// 一些特殊的修正
	__endFixed: function() {
		var ef = configs.rEndFixed;
		return this
			// 修正纬度
			.replace(ef.Latitude, function(m) {
				return m.replaceAt(ef.LatitudeAt);
			})
			// 修正 数字间隔
			.replace(ef.Number, function(m) {
				var tmp = m.replaceAt(ef.NumberAt);
				// 非标准中文数字间隔样式，还原逗号
				if (!/\d+\,\d{3}/.test(tmp)) {
					tmp = tmp.replace(/\,/g, '，');
				}
				return tmp;
			})
			// 修正 时间
			.replace(ef.Time, function(m) {
				return m.replaceAt(ef.TimeAt).matchUpper(/[apm]/g);
			})
			// 修正 日期
			.replace(ef.Dates, function(m) {
				return m.replaceAt(ef.DatesAt);
			});
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		return this.cleanSpace(configs.hanSpace);
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this
			.replaces(configs.rSeparator)
			.replace(/@@{3,}/g, configs.Separator);
	},
	// 引号修正
	replaceQuotes: function(m) {
		var re = this
			.replace(configs.enSep, '$1〔※@※〕$2')
			.replaces(configs.rQuotes)
			.replace(/〔※@※〕/g, '\'');
		return (m === 'cn') ? re.replaceAt(configs.cnQuotes) : re;
	},
	// 正则字母全大写
	matchUpper: function(reg) {
		return this.replace(reg, function(m) {
			return m.toUpperCase();
		})
	},
	// 正则首字母大写
	matchFirstUpper: function(reg) {
		return this.matchUpper(/\b[a-z]/g);
	},
	// 正则字母小写
	matchLower: function(reg) {
		return this.replace(reg, function(m) {
			return m.toLowerCase();
		})
	},
	// 处理英文
	__convertEnglish: function() {
		return this
			.replaceAt(configs.halfPuns)
			.replaces(configs.halfSymbol)
			.matchLower(configs.findEng.PunAfter)
			.matchUpper(/[\.\?\!\:\&] ?[a-z]/g)
			.trim();
	},
	// 单独一行英文
	convertEngLine: function() {
		var eng = configs.findEng;
		return this
			.replace(eng.Line, function(m) {
				// 如果是单词引用
				if (m.find(/^[“「][a-z]{1,6}(?:。|[！？]{1,3}|……|——)[」”]$/mi) ||
					m.findCount(eng.LineSkip) < 2 ||
					!m.find(/[,， ]/)
				) return m;
				return m.replaceAt(configs.halfPunsOther).__convertEnglish();
			});
	},
	// 修正英文大小写
	convertEnglish: function() {
		var eng = configs.findEng,
			eWord = eng.Word,
			tmp;
		return this
			// 转换英文小写
			// 07-03 修正其他字母转小写，仅是英文
			//.toLowerCase()
			.matchLower(/[A-Z]/g)
			// 英文首写全大写
			.matchFirstUpper()
			// 引用的全转小写
			//.replace(eng.Quote, function(m) {
			//	return eng.QuoteTest.test(m) ?
			///		m.__convertEnglish() : m
			//})
			// 处理英语中的 ' 标点符号
			.replace(eng.Sep, function(m) {
				return m
					.matchLower(/[A-Z]/g)
					.matchUpper(/^[a-z]/)
					.matchLower(/ [A-Z]/g)
					.replace('[{$enSep}]+'.comReg('g'), "'")
			})
			// 括号内全是英文时，缩拼全大写
			.replace(eng.Bracket, function(m) {
				return m.indexOf(' ') > -1 ? m : m.toUpperCase()
			})
			// 修正
			.replace(eng.PunFix, function(m) {
				return m.indexOf('\u0027') > -1 ? m.matchLower(/ [A-Z]/g) : m
			})
			// 处理单词全是英文和数字时，型号类全大写
			.replace(/\b[\w\-\~～]+\b/g, function(m) {
				return m.find(/\d/) ? m.toUpperCase() : m
			})
			// 处理英语中称呼缩写，非行尾的
			.replace(eng.HonorWord, function(m) {
				return m.matchFirstUpper().replace(/。/g, '.')
			})
			// 处理常用英语书写
			.matchUpper(('\\b(?:' + eng.WordUpper + ')\\b').getReg('gi'))
			.replace(('\\b(' + eWord + ')([0-9]{0,4}|[0-9]{1,4}[a-z]{0,6})\\b').getReg('gi'), function(m, m1, m2) {
				tmp = ('|' + eWord.toLowerCase() + '|').indexOf('|' + m1.toLowerCase() + '|') + 1
				return ('|' + eWord + '|').substr(tmp, m1.length) + m2.toUpperCase()
			})
			// 处理连续的英语
			.matchUpper(eng.Continuous)
			// 修正小写后缀
			.replace(eng.LowerExt, function(m) {
				return m
					.toLowerCase()
					.replace(/。/g, '.')
			})
			// 修正 网址
			.replace(eng.Site, function(m) {
				return m
					.toLowerCase()
					.replaceAt(eng.SiteFix)
			})
			// 修正特定英文
			.replaces(eng.WordFix)
			// 虚词小写
			.matchLower(('\\b(?:' + eng.WordOnlyLower + ')\\b').getReg('gi'))
			// 单个字母大写
			.matchUpper(/\b[a-z]\b/g)
			// 顶头字母大写
			.replace(/^[a-z]+ /gim, function(m) {
				return this.matchUpper(/\b[a-z]/gi)
			});
	},
	// 半角字母数字
	convertNumberLetter: function(r) {
		var snLetter = configs.sNumberLetter;
		return this
			// 全角小写字母后紧跟大写，用空格分隔
			.replace(/([Ａ-Ｚ][ａ-ｚ]+)(?=[Ａ-Ｚ][ａ-ｚ]+)/g, '$1 ')
			.replaceAt(snLetter);
	},
	// 转换标题内的全角数字
	__chapterFullNumber: function() {
		return this
			// 修正章节标题里的为半角
			.replace(configs.regFullNumberTitle, function(m) {
				return m.replaceAt(configs.sNumber);
			});
	},
	// 全角字母数字
	convertFullNumberLetter: function() {
		return this
			.replaceAt(configs.sNumberLetter, true)
			.__chapterFullNumber();
	},
	// Unicode转换
	convertUnicode: function() {
		return this
			.replace(/(?:[＆&]#x|\\u?)([\da-f]{4})[;；]?/gi, function(m, m1) {
				return unescape('%u' + m1);
			})
			.replace(/\\x([\da-f]{2})/gi, function(m, m1) {
				return unescape('%u00' + m1);
			})
			.replace(/[＆&]#(\d+)[;；]/g, function(m, m1) {
				return String.fromCharCode(m1);
			})
			.replace(/(?:[%％][\da-f]{2})+/gi, function(m) {
				try {
					return decodeURIComponent(m.replace(/％/g, '%'));
				} catch(err) { return m; }
			});
	},
	// html转义符转换
	convertHtmlEntity: function() {
		return this.replace(configs.regHtmlEntity, function(m, m1) {
			return configs.sHtmlEntity[m1] || configs.sHtmlEntity[m1.toLowerCase()] || m;
		})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaceAt(configs.sVariants);
	},
	// 转换变体序号
	convertSerialNumber: function() {
		var arr = configs.sSerialNumber,
			find = arr[1].split('|');
		return this.replace(('[' + arr[0] + ']').getReg(), function(m) {
			return '（' + (find[arr[0].indexOf(m)] || '') + '）';
		})
	},
	// 全角标点符号
	convertPunctuation: function() {
		return this
			// 标点符号修正
			.replaceAt(configs.punSymbol)
			.replaces(configs.punSymbolFix)
			// 修正所有数字和英文字母间的标点和空格
			.replaces(configs.nwSymbol);
	},
	// 标题位置函数，默认一行35全角字符
	setAlign: function(b1, b2, align) {
		var lineLen = configs.Linenum * 2,
			str = this.trims(),
			strLen = str.len();

		if (lineLen > strLen) {
			if (align === 'center') {
				str = '　'.times(~~((lineLen - strLen) / 4)) + (strLen % 4 === 0 ? ' ' : '') + str;
			} else if (align === 'right') {
				str = '　'.times(~~((lineLen - strLen) / 2)) + (strLen % 2 === 0 ? '' : ' ') + str;
			}
		}
		return (b1 || '') + str + (b2 || '');
	},
	// 处理标题
	__Chapter: function(t, tpl, r, func) {
		// 处理标题的外框
		// 第一章：【标题】/【第一章：标题】
		var pa = '^{$f}[{$b.0}]?(?:{$zz})[{$b.1}]?(?:{$sn})[{$b.0}]?(?:{$e}|$)[{$b.1}]?$'.fmt(t).chapReg();
		return this
			.replace(pa, function(m) {
				return m.indexOf('。') > -1 ? m : m.replace('[{$b}]'.chapReg('g'), ' ')
			})
			.replace(tpl.chapReg('gim', r), func);
	},
	// 修正章节标题
	replaceTitle: function(f, e, c, relax) {
		var f = f || '\n\n',
			e = e || '',
			re = this,
			// 替换值
			regVal = regChapter,
			regSkip = configs.regSkipTitle;

		// 非严格限定
		if (relax) {
			// 标题间隔符（非严格限定）
			regVal.s = regVal.sn;
			// 行尾（非严格限定）
			regVal.es = regVal.e;
		}

		// 全角转半角数字
		// 补零
		var zero = function(n) {
			return n
				.replaceAt(configs.sNumber)
				.replace(/\b\d\b/, '0$&');
		}

		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			str = str
				.replace(/  +/g, ' ')
				.replace('^[{$sep}]+'.chapReg(), '');

			if (str.length === 0) return '';
			// 去除只有间隔符+数字的情况
			if (str.find(/^（?\d{1,3}）?$/)) {
				return str.replace(/^（?(\d{1,3})）?$/, function(m, m1) {
					return '（' + zero(m1) + '）';
				});
			}

			str = str
				// 修正结尾是上下的小标号
				.replace(/([^\d\.])[ ·]([上中下终完]|[一二三四五六七八九十百]{1,5})$/, '$1（$2）')
				// 中文间空格转换为逗号
				.replace(/ (?=[\u4E00-\u9FA5]{2,})/g, '，')
				.replace(/ (?=[\u4E00-\u9FA5])/g, '')
				// 修正注释
				.replace(/【?注(\d{1,2})】?/g, '【注$1】')
				// 修正结尾是数字的小标号
				.replace(/([^\d\.])(\d{1,2}\/\d{1,2})$/, '$1（$2）')
				.replace(/([^\d\.]) ?\b(\d{1,2})$/, '$1（$2）')
				// 补零
				.replace(/（(\d{1,3})）$/, function(m) {
					return zero(m)
				})
				// 修正结尾是希腊数字的小标号
				.replace(/[ ·]?\b([IVXC]{1,6})\b$/i, function(m, m1) {
					return '（' + m1.toUpperCase() + '）'
				});
			return checkNull(sDiv) ? configs.Divide + str : str;
		}
		
		// 过滤
		var checkSkip = function(str, t) {
			return str.find(regSkip[t || 't0']);
		}
		// 正则标题
		re = re
			/****** 修复标题间多余空格 ******/
			.cleanSpace('^{$ts}'.chapReg())
			/****** 非常规标题·无后续主体 ******/
			.__Chapter(regVal.t0, '^{$f}({$t0})(?:{$s}|$)$', '', function(m, m1) {
				return m1.setAlign(f, e, c);
			})
			/****** 非常规标题·可有后续主体 ******/
			.__Chapter(regVal.t1.join('|'), '^{$f}({$t1})({$s}{$e}|{$sn}$)$', '|', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (m2.find(/^[\!\?！？。]{1,3}$/) || checkSkip(m) || checkSkip(m, 't1'))
					return m;
				return (m1 + handleTitle(m2)).setAlign(f, e, c);
			})
			/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
			// m1 章节 m2 间隔 m3 标题
			.__Chapter(regVal.t2, '^{$f}{$t2}({$sn})({$e}|$)$', '', function(m, m1, m2, m3) {
				m3 = m3.trims();
				// 如果是完结标记
				if (m3.find(/^(?:完|完结|待续|未完|终)$/))
					return ('【' + m1 + '·' + m3 + '】');
				// 防止错误，有句号不转；——开头不转；全标点不转
				if (m1.find(/^[\-\—]{2,4}/) || (!relax && m3.find(/^[！？。…]{1,3}$/)) || checkSkip(m))
					return m;
				// 防止错误，没有间隔符情况下
				// 如：第一部电影很好，很成功。
				// 如：一回头、一幕幕
				if (!m2 && ((!relax && m3.find(/，|[！？。…’”』」]{1,3}$/)) || checkSkip(m, 't2'))) 
					return m;

				if (!m1.find('{$n4}[{$c}]'.chapReg()))
					m1 = '第' + m1.replace(/^第+| /g, '');

				return (zero(m1) + handleTitle(m3)).setAlign(f, e, c);
			})
			/****** （01）/（02）标题/（一）/（一）标题 ******/
			.__Chapter(regVal.t3, '^{$f}{$t3}({$e}|$)$', '', function(m, m1, m2) {
				// 防止错误，有句号不转
				if (checkSkip(m)) return m;
				return (zero(m1) + handleTitle(m2, 'no')).setAlign(f, e, c);
			})
		
		// 标题居中直接返回
		if (c === 'center' || c === 'break') return re;

		/****** 以下为修复标题 ******/
		// 转换章节后缀名
		var ctr = strChapter.crt;
		return re
			/****** 卷一/卷一：标题 ******/
			.__Chapter(regVal.t4, '^{$f}{$t4}{$sn}({$e}|$)$', '', function(m, m1, m2, m3) {
				return (f + '第' + m2 + m1 + handleTitle(m3) + e);
			})
			/****** chapter 22/ chapter 55 abcd ******/
			.__Chapter(regVal.t5, '^{$f}{$t5}{$sn}({$e}|$)$', '', function(m, m1, m2) {
				return (f + '第' + zero(m1) + ctr + handleTitle(m2) + e);
			})
			/****** 01/01./01.标题/一/一、/一、标题 ******/
			.__Chapter(regVal.t6, '^{$f}{$t6}({$s}|{$s}{$e}|$)$', '', function(m, m1, m2) {
				m2 = m2.trims();
				// 防止错误，有句号不转；全标点不转
				var t = /^[！？。]{1,3}$/;
				if (m.indexOf('。') > -1 || m2.find(t) || checkSkip(m) || checkSkip(m, 't2'))
					return m;
				// 章节是数字格式情况下
				m1 = zero(m1);
				t = m1.find(/^\d+/) ? /[！？。]$/ : /[！？。…’”』」]$/;
				if (m2.find(t)) return m;
				// 其他处理过滤
				if (m.cleanSpace().eachArrayRegTest(regSkip.t6))
					 return m;

				return (f + '第' + m1 + ctr + handleTitle(m2) + e);
			})
	},
	// 修复错转的章节标题
	replaceTitleError: function() {
		// 第01章　连续
		var parent01 ='(?:^{$f}第{$n1}[{$crt}](?:：.{0,40}|$)$\\n+|^{$f}{$n1}(?:[：、。\\.\\,].{0,40}|$)$\\n+){2,}'.chapReg(),
			// 第一章　连续
			parent02 = '(?:^{$f}第{$n3}[{$crt}](?:[：].{0,40}|$)$\\n+|^{$f}{$n3}(?:[：、。\\.\\,].{0,40}|$)$\\n+){2,}'.chapReg(),
			// （01）　连续
			parent03 = '(?:\\n+^{$f}（(?:{$n2}|{$n3})）(?:.{0,40}|$)$\\n+){2,}'.chapReg(),
			/***** 修复相同的连续章节标题 *****/
			fix1 = '(^{$f}(?:{$w1}|{$w3})(?:[：、。\\.\\,].{0,40}|$)$\\n+)\\1'.chapReg('gm'),
			fix2 = '(^{$f}（(?:{$w1}|{$w3})）(?:.{0,40}|$)$\\n+)\\1'.chapReg('gm');

		var getParrentArr = function(str, v) {
			return str
				.replace('^{$f}第({$zz})[{$crt}](?:：|$)'.fmt(v).chapReg(), '$1、')
				.replace('^{$f}({$zz})[：、。\.\,]'.fmt(v).chapReg(), '$1、')
				.replace(/^0{1,4}/gm, '')
				.replace(/、$/gm, '')
				.replace(/\n\n+/g, '\n');
		}
		
		return this
			.replace(parent01, function(m) {
				return getParrentArr(m, '{$n1}')
			})
			.replace(parent02, function(m) {
				return getParrentArr(m, '{$n3}')
			})
			.replace(parent03, function(m) {
				return m.replace(/\n+/g, '\n')
			})
			.replace('\\n\\n((?:{$n1}|{$n3})、?)'.chapReg(), '$1')
			.replace(fix1, function(m, m1) {
				return m1.replaceTitle('\n\n', '')
			})
			.replace(fix2, function(m, m1) {
				return m1.replaceTitle('\n\n', '')
			});
	}
});
