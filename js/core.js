/**
 * typo is novel text typography tool
 * author: vsolo 
 */
Object.assign(String.prototype, {
	// 排版初始化，去空格空行
	replaceInit: function() {
		// 去除首尾所有空格
		// 行尾加换行
		// 去除所有多余空白行
		return (this.trim() + '\n').replace(/\n\n+/g, '\n');
	},
	// 排版结束
	replaceEnd: function() {
		return this
			// 结尾特殊修正 272
			.replaceHooks(config.rEndFix)
			// 293
			.replaces(config.rEnd)
			// 结尾修正 119
			.replaceFinish();
	},
	// 结尾修正
	replaceFinish: function() {
		var Q1 = '」』”’', Q2 = '「『“‘';
		return this
			// 段首引号替换
			.replace(/^[」』”’]/gm, function(m) {
				return Q2.charAt(Q1.indexOf(m));
			})
			.replace(/(?!^)[「『“‘](?:。|[！？…—~]{1,3}|$)$/gm, function(m) {
				return Q1.charAt(Q2.indexOf(m.charAt(0))) + m.charAt(1);
			})
			.replace(/：[」』”’]$/gm, function(m) {
				return m.replaceAt([Q1, Q2]);
			})
			// 去除多余空格
			.replace(/  +/g, ' ')
			// 去除多余行
			.replace(/\n\n\n+/g, '\n\n')
			.replace(/^\n+/, '')
			.replace(/\n\n+$/, '\n');
	},
	// 循环特殊修正
	// pre - 前置条件
	replaceHooks: function(arr, pre) {
		if (pre !== undefined && pre === false) return this;
		var re = this;
		var repHit = function(t, v) {
			re = re.replace(t, function(m) {
				return (
					('skip' in v && m.find(v.skip)) ||
					('need' in v && !m.find(v.need))
				) ? m : m.replaceHook(v)
			})
		}
		arr.forEach(function(v) {
			switch (true) {
				case 'hit' in v:
					repHit(v.hit, v);
					break;
				case 'hits' in v:
					v.hits.forEach(function(t) {
						repHit(t, v);
					})
					break;
				default:
					re = re.replaceHook(v)
			}
		})
		return re;
	},
	// 一些特殊的修正
	replaceHook: function(v) {
		var re = this, item
		for (item in v) {
			switch (item) {
			case 'hit':
			case 'skip':
			case 'need':
				break;
			case 'at':
				re = re.replaceAt(v.at)
				break;
			case 'rp':
				re = re.replace(v.rp[0], v.rp[1])
				break;
			case 'rps':
				re = re.replaces(v.rps)
				break;
			case 'lc':
				re = re.toLetterCase(v.lc)
				break;
			case 'mr':
				re = re.cleanSpace(v.mr)
				break;
			case 'mu':
			case 'ml':
			case 'mf':
			case 'ms':
			case 'mz':
				re = re.matchLetterCase(v[item], item.slice(-1))
				break;
			}
		}
		return re;
	},
	// 正则查找进行大小写转换——通用
	toLetterCase: function(lc) {
		switch (lc) {
			case 'u': // 全大写
				return this.toUpperCase();
			case 'l': // 全小写
				return this.toLowerCase();
			case 'f': // 整句首字大写
				return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
			case 's': // 单词首字大写
				return this.replace(/\b[a-z]/g, function(m) {
					return m.toUpperCase()
				});
			case 'z': // 重置单词首字大写
				return this.toLowerCase().replace(/\b[a-z]/g, function(m) {
					return m.toUpperCase()
				});
		}
		return this;
	},
	// 正则查找进行大小写转换——通用
	matchLetterCase: function(reg, lc) {
		return this.replace(reg, function(m) {
			return m.toLetterCase(lc);
		})
	},
	// 去除汉字间的空格
	replaceSpace: function() {
		return this.cleanSpace(config.hanSpace, / +/g)
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this.replaces(config.rSeparator).replaces(config.eSeparator);
	},
	// 引号修正，西文引号
	replaceQuotes: function() {
		return this.replaces(config.rQuotes);
	},
	// 引号修正，直角引号
	replaceCNQuotes: function() {
		return this
			.replaceQuotes()
			.replaceAt(config.aQuotes, true);
	},
	// to ‘’“”
	convertESQuotes: function() {
		return this.replaceAt(config.aQuotes);
	},
	// to 『』「」
	convertCNQuotes: function() {
		return this.replaceAt(config.aQuotes, true);
	},
	// 修正英文大小写
	convertEnglish: function() {
		// 无英文退出
		if (this.search(/\b[a-zA-Z0-9]/) < 0) {
			return this + '';
		}
		var eng = config.rEnglish,
			eSpecialLower = eng.Special.toLowerCase(),
			eUnitLower = eng.Unit.toLowerCase(),
			// 如果不包含空格的词组，不处理以下，以加快速度
			isSpace = this.search(/[a-zA-Z] \b[a-zA-Z]/) > -1;
			
		// 保护 作者 名称中的英文不转换
		var authorArr = [];
		this.replace(config.novelAuthor, function(m) {
			authorArr.push([m.trims().getSafeReg('gi'), m]);
		})

		return this
			// 包含所有拉丁字母的首字母大写
			.matchLetterCase(eng.Alphabets, 'f')
			// 英文间的其他字符
			.replaceHooks(eng.FixChar)
			// 常用英语书写
			.replace(('\\b(' + eng.Special + ')(\\d{1,4}[a-z]{0,6})?\\b').getReg('gi'), function(m, m1, m2) {
				var tmp = ('|' + eSpecialLower + '|').indexOf('|' + m1.toLowerCase() + '|') + 1;
				return ('|' + eng.Special + '|').substr(tmp, m1.length) + ((m2 && m2.toUpperCase()) || '');
			})
			// 英文单位
			.replace(('\\b(\\d[0-9。.]* ?)(' + eng.Unit + ')\\b').getReg('gi'), function(m, m1, m2) {
				var tmp = ('|' + eUnitLower + '|').indexOf('|' + m2.toLowerCase() + '|') + 1;
				return m1 + ('|' + eng.Unit + '|').substr(tmp, m2.length);
			})
			// 重叠连续单词
			.replace(eng.Overlap, function(m, m1) {
				return m.matchLetterCase(m1.getReg('gi'), 'f');
			})
			// 英文其他大小写规则
			.replaceHooks(eng.FixCase)
			// 修正 作者英文名
			.replaces(authorArr)
	},
	// 半角字母数字
	convertNumberLetter: function() {
		return this
			// 全角小写字母后紧跟大写，用空格分隔
			.replace(/[Ａ-Ｚ][ａ-ｚ]+(?:[Ａ-Ｚ][ａ-ｚ]+)+/g, function(m) {
				return m.replace(/(?!^)[Ａ-Ｚ]/g, ' $&')
			})
			.replaceAt(config.sNumberLetter);
	},
	// 全角字母数字
	convertFullNumberLetter: function() {
		return this
			.replaceAt(config.sNumberLetter, true)
			.replace(config.regFullNumberTitle, function(m) {
				return m.replaceAt(config.sNumber);
			})
	},
	// Unicode转换
	convertUnicode: function() {
		return this
			.replace(/＆#/g, '&#')
			.replace(/[\da-fA-F]；/g, function(m) {
				return m.replace(/；/g, ';')
			})
			.replace(/％[\da-fA-F]/g, function(m) {
				return m.replace(/％/g, '%')
			})
			.replace(/&#[xX][\da-fA-F]{4};?/g, function(m) {
				return unescape('%u' + m.slice(3, -1));
			})
			.replace(/\\[uU]?[\da-fA-F]{4};?/g, function(m) {
				return unescape('%u' + m.replace(/[\\uU;]/g, ''));
			})
			.replace(/\\[xX][\da-fA-F]{2}\b/g, function(m) {
				return unescape('%u00' + m.slice(2));
			})
			.replace(/&#\d+;/g, function(m) {
				return String.fromCharCode(m.slice(2, -1));
			})
			.replace(/(?:%[\da-fA-F]{2})+/g, function(m) {
				//try {
					return decodeURIComponent(m);
				//} catch(err) { return m; }
			});
	},
	// html转义符转换
	convertHtmlEntity: function() {
		var n;
		return this.replace(config.rHtmlEntity.hit, function(m) {
			n = m.replace(/\W/g, '');
			n = config.rHtmlEntity.data[n] || config.rHtmlEntity[n.toLowerCase()] || 0;
			return n > 0 ? String.fromCharCode(n) : m;
		})
	},
	// 转换变体字母
	convertVariant: function() {
		return this.replaceAt(config.sVariants);
	},
	// 转换变体序号
	convertSerialNumber: function() {
		var arr = config.sSerialNumber,
			find = arr[1].split('|');
		return this.replace(('[' + arr[0] + ']').getReg('g'), function(m) {
			return '（' + (find[arr[0].indexOf(m)] || '') + '）';
		})
	},
	// 全角标点符号
	convertPunctuation: function() {
		return this.replaceHook(config.rPunctuation);
	},
	// 标题位置函数，默认一行35全角字符
	setAlign: function(b1, b2, align) {
		var lineLen = config.Linenum * 2,
			str = this.trims(),
			strLen = str.len();

		if (align !== 'left' && lineLen > strLen) {
			if (align === 'center') {
				str = '　'.repeat(~~((lineLen - strLen) / 4)) + (strLen % 4 === 0 ? ' ' : '') + str;
			} else if (align === 'right') {
				str = '　'.repeat(~~((lineLen - strLen) / 2)) + (strLen % 2 === 0 ? '' : ' ') + str;
			}
		}
		return (b1 || '') + str + (b2 || '');
	},
	// 预先处理标题 tag
	__prepChapter: function(tag, func) {
		var re = this,
			res = getChapters[tag],
			t = regChapter[tag],
			r = '';

		if ('join' in res) {
			r = res.join
			t = t.join(r)
		}

		var tpl = res.tpl.chapFlag('gm', r),
			// 第一章：【标题】/【第一章：标题】/【第一章】标题
			pa = '^[{$b.0}](?:{$zz})[{$b.1}]?(?:{$sn}{$e})?$'.fmt(t).chapReg(),
			ta = '[{$b}]'.chapReg('g'),
			na = /，|。|(?:完|完结|待续|未完|终)$/,
			mn;

		// 处理标题的外框
		re = re.replace(pa, function(m) {
			mn = m.trim().replace(ta, ' ').replace(/^ +/, '')
			return mn.find(na) ? m : mn;
		})

		return !re.find(tpl.str.getReg(tpl.t)) ? re : re
			// 连续重复的章节，去重
			.replace('({$zz}\\n{1,2})\\1+'.fmtReg(tpl.str, 'g'), '$1')
		 	.replace(tpl.str.getReg(tpl.flag), func)
	},
	// 标题过滤
	__chaSkip: function(t) {
		return this.eachArrayRegTest(config.regSkipTitle[t || 't0']);
	},
	// 修正章节标题
	replaceTitle: function(f, e, c) {
		f = f || '\n\n';
		e = e || '';
		var re = this,
			// 替换值
			rChap = regChapter,
			xFinds = '{$n4}[{$c}]'.chapReg('g'),
			// 补零
			zero = function(n) {
				return n.replaceAt(config.sNumber).replace(/\b\d\b/g, '0$&');
			}

		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			str = str
				.replace(/  +/g, ' ')
				.replace('^[{$b.0}](.*)[{$b.1}]$'.chapReg('g'), '$1')
				.replace('^[{$sep}]+'.chapReg(''), '');

			if (str.length === 0) return '';
			// 只有数字的情况
			if (/^\d+$/.test(str)) {
				return str.replace(RegExp['$&'], function(m) {
					return config.Divide + (~~m > 20 ? m : '（' + zero(m) + '）');
				});
			}

			str = str
				// 修正结尾是上下的小标号
				.replace(/([^\d\.])[ ·—-]([上中下终終完]|[零一二三四五六七八九十百]{1,5})$/, '$1（$2）')
				// 修正标题是上下的小标号
				.replace(/^(?:[上中下终終完])$/, '（$&）')
				// 中文间空格转换为逗号
				.replace(' (?=[{$han}]{2,})'.comReg('g'), '，')
				.replace(' (?=[{$han}])'.comReg('g'), '')
				// 修正注释
				.replace(/注(\d{1,2})/g, '【注$1】')
				// 修正结尾是数字的小标号
				//.replace(/([^\w\.\-—·])(\d{1,2}\/\d{1,2})$/, '$1（$2）')
				.replace(/^([^\w\.\-—·]+)[ —-]?\b([1-9]|[012][0-9])$/, '$1（$2）')
				// 补零
				.replace(/（\d{1,3}）$/, function(m) {
					return zero(m)
				})
				// 修正结尾是希腊数字的小标号
				.replace(/[ ·]\b[IVXC]{1,6}\b$/i, function(m) {
					return '（' + m.slice(1).toUpperCase() + '）'
				});
			return sDiv ? str : config.Divide + str;
		}

		// 正则标题
		re = re
			/****** 修复标题间多余空格 ******/
			//.trim()
			.cleanSpace('^{$ts}'.chapReg('g'))
			/****** 保护有序列表 ******/
			.replaceArr(config.regListTitle, function(m) {
				return m.replace(/\n$/, '').replace(/^/gm, '〔\u2622〕') + '\n'
			})
			/****** 非常规标题·无后续主体 ******/
			.__prepChapter('t0', function(m, m1) {
				return m1.setAlign(f, e, c);
			})
			/****** 非常规标题·可有后续主体 ******/
			.__prepChapter('t1', function(m, m1, m2) {
				// 防止错误，有句号不转；全标点不转
				if (m2.find(/^[\!\?！？。]{1,3}$/) ||
					m.__chaSkip('t0') ||
					m.__chaSkip('t1')
				) return m;
				// 处理 之 分隔
				m2 = (m.find(/番外|同人|里番|[外前后][传傳]/) && m2.find(/^之/)) ?
					m2 : handleTitle(m2)
				return (m1 + m2).setAlign(f, e, c);
			})
			/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
			// m1 章节 m2 间隔 m3 标题
			.__prepChapter('t2', function(m, m1, m2, m3) {
				m3 = m3.trims();
				// 如果是完结标记
				if (m3.find(/^(?:完|完结|待续|未完|终)$/))
					return ('【' + m1 + '·' + m3 + '】');
				// 防止错误，有句号不转；——开头不转；全标点不转
				if (m1.find(/^[\-\—]{2,4}/) ||
					m.__chaSkip('t0') ||
					m.__chaSkip('t2') ||
					(m3.find(/^[！？。…]{1,3}$/)) ||
					// 如果有 `，` 的
					(!m2 && m3.find(/，/)) ||
					// 如果章节 `第` 开头，结尾限定
					(!m1.find(/^第/) && m3.find(/[！？。…’”』」]{1,3}$/))
				) return m;

				if (!m1.find(xFinds))
					m1 = '第' + m1.replace(/^第+| /g, '');

				return (zero(m1) + handleTitle(m3)).setAlign(f, e, c);
			})
			/****** （01）/（02）标题/（一）/（一）标题 ******/
			.__prepChapter('t3', function(m, m1, m2) {
				if (m.__chaSkip('t0')) return m;
				return (zero(m1) + handleTitle(m2, 'no')).setAlign(f, e, c);
			})
		
		// c 不设置或为 true 时执行
		if (typeof c === "undefined" || c === true) {
			/****** 以下为修复标题 ******/
			// 转换章节后缀名
			var ctr = strChapter.crt;
			re = re
				/****** 卷一/卷一：标题 ******/
				.__prepChapter('t4', function(m, m1, m2, m3) {
					return (f + '第' + m2 + m1 + handleTitle(m3) + e);
				})
				/****** chapter 22/ chapter 55 abcd ******/
				.__prepChapter('t5', function(m, m1, m2) {
					return (f + '第' + zero(m1) + ctr + handleTitle(m2) + e);
				})
				/****** 01/01./01.标题/一/一、/一、标题 ******/
				.__prepChapter('t6', function(m, m1, m2) {
					m2 = m2.trims();
					if (m.find(/。/) ||
						m2.find(/^[！？。]{1,3}$/) ||
						m.__chaSkip('t0') ||
						m.__chaSkip('t2') ||
						m2.find(m1.find(/^\d+/) ? /[！？。]$/ : /[！？。…’”』」]$/) ||
						m.cleanSpace().__chaSkip('t6')
					) return m;
					return (f + '第' + zero(m1) + ctr + handleTitle(m2) + e);
				})
		}

		return re
			.replaceTitleError()
			// 恢复保护
			.replace(/〔\u2622〕/g, '')
	},
	// 修复错转的章节标题
	replaceTitleError: function() {
		/***** 清除相连的类似的章节标题 *****/
		var c1 = '^({$t91}[{$c.2}]{$sn})(?:{$e}|$)$\\n+\\1.*$'.chapReg('gm'),
			c3 = '^{$t3}(?:{$e}|$)$\\n+\\1.*$'.chapReg('gm')

		var _rp = function(str) {
			// 判断两行重复标题，以长度保留
			var n = str.replace(/\n+/g, '\n').split('\n', 2);
			n.sort(function(a, b) { return b.length - a.length })
			// 如果第一行有结尾
			return n[0].find(/[。！？…～]$/) ?
				n[1] + '\n' + n[0].replace(n[1], '') : n[0]
		}

		return this
			.replace(c1, function(m) {
				return _rp(m);
			})
			.replace(c3, function(m) {
				return _rp(m);
			})
	}
});
