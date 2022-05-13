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
			// 修正英文单独行
			//.convertEngLine()
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
				return Q1.charAt(Q2.indexOf(m.charAt(0))) + m.slice(1);
			})
			// 去除所有多余行
			.replace(/\n\n\n+/g, '\n\n')
			.replace(/^\n+/, '')
			.replace(/\n\n+$/, '\n');
	},
	// 循环特殊修正
	replaceHooks: function(arr) {
		var re = this;
		arr.forEach(function(v) {
			if ('find' in v) {
				if (!Array.isArray(v.find)) {
					v.find = [v.find];
				}
				v.find.forEach(function(t) {
					re = re.replace(t, function(m) {
						return (('skip' in v && m.eachArrayRegTest(v.skip)) ||
							('pass' in v && !m.find(v.pass))
						) ? m : m.replaceHook(v);
					})
				})
			} else {
				re = re.replaceHook(v);
			}
		})
		return re;
	},
	// 一些特殊的修正
	replaceHook: function(v, cfind) {
		var re = this, item, tmp;
		for (item in v) {
			switch (item) {
			case 'find':
			case 'skip':
			case 'pass':
				break;
			case 'at':
				re = re.replaceAt(v.at);
				break;
			case 'rp':
				re = re.replace(v.rp[0], v.rp[1]);
				break;
			case 'rps':
				re = re.replaces(v.rps);
				break;
			case 'mr':
				re = re.cleanSpace(v.mr);
				break;
			case 'mu':
				re = re.matchLetterCase(v.mu, 'u');
				break;
			case 'ml':
				re = re.matchLetterCase(v.ml, 'l');
				break;
			case 'mf':
				re = re.matchLetterCase(v.mf, 'f');
				break;
			case 'lc':
				re = re.toLetterCase(v.lc);
				break;
			}
		}
		return re;
	},
	// 正则查找进行大小写转换——通用
	toLetterCase: function(lc) {
		switch (lc) {
			case 'u':
				return this.toUpperCase();
			case 'l':
				return this.toLowerCase();
			case 'f':
				return this.charAt(0).toUpperCase() + this.toLowerCase().slice(1);
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
		return this.cleanSpace(config.hanSpace, / +/g);
	},
	// 修正分隔符号
	replaceSeparator: function() {
		return this.replaces(config.rSeparator);
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
		var re = this,
			eng = config.rEng,
			eSpecialLower = eng.Special.toLowerCase(),
			eUnitLower = eng.Unit.toLowerCase(),
			tmp;

		// 保护 作者 名称中的英文不转换
		var authorArr = [];
		re.replace(config.novelAuthor, function(m) {
			authorArr.push([m.trims().getReg('gi'), m]);
		})

		re = re
			// 包含所有拉丁字母的首字母大写 60
			.matchLetterCase(eng.Alphabets, 'f')
			// 英文间的其他字符 400
			.replaceHooks(eng.Char)
			// 处理常用英语书写
			.replace(('\\b(' + eng.Special + ')(\\d{1,4}[a-z]{0,6})?\\b').getReg('gi'), function(m, m1, m2) {
				tmp = ('|' + eSpecialLower + '|').indexOf('|' + m1.toLowerCase() + '|') + 1;
				return ('|' + eng.Special + '|').substr(tmp, m1.length) + ((m2 && m2.toUpperCase()) || '');
			})
			// 处理英文单位
			.replace(('\\b(\\d[0-9。.]* ?)(' + eng.Unit + ')\\b').getReg('gi'), function(m, m1, m2) {
				tmp = ('|' + eUnitLower + '|').indexOf('|' + m2.toLowerCase() + '|') + 1;
				return m1 + ('|' + eng.Unit + '|').substr(tmp, m2.length);
			})
			// 重叠连续单词
			.replace(eng.Overlap, function(m, m1) {
				return m.replace(m1.getReg('gi'), m1.toLetterCase('f'));
			})
			// 英文其他大小写规则 400
			.replaceHooks(eng.End)

		// 修正 作者英文名
		if (authorArr.length > 0) re = re.replaces(authorArr)
		return re;
	},
	// 半角字母数字
	convertNumberLetter: function() {
		return this
			// 全角小写字母后紧跟大写，用空格分隔
			.replace(/([Ａ-Ｚ][ａ-ｚ]+)(?=[Ａ-Ｚ][ａ-ｚ]+)/g, '$1 ')
			.replaceAt(config.sNumberLetter);
	},
	// 转换标题内的全角数字
	__prepChapterFullNumber: function() {
		return this.replace(config.regFullNumberTitle, function(m) {
			return m.replaceAt(config.sNumber);
		})
	},
	// 全角字母数字
	convertFullNumberLetter: function() {
		return this
			.replaceAt(config.sNumberLetter, true)
			.__prepChapterFullNumber();
	},
	// Unicode转换
	convertUnicode: function() {
		return this
			.replace(/(?:[＆&]#[xX]|\\[uU]?)[\da-fA-F]{4}[;；]?/g, function(m) {
				return unescape('%u' + m.replace(/[^\da-fA-F]/g, ''));
			})
			.replace(/\\[xX][\da-fA-F]{2}\b/g, function(m) {
				return unescape('%u00' + m.slice(2));
			})
			.replace(/[＆&]#\d+[;；]/g, function(m) {
				return String.fromCharCode(m.slice(2, -1));
			})
			.replace(/(?:[%％][\da-fA-F]{2})+/g, function(m) {
				try {
					return decodeURIComponent(m.replace(/％/g, '%'));
				} catch(err) { return m; }
			});
	},
	// html转义符转换
	convertHtmlEntity: function() {
		var n;
		return this.replace(config.rHtmlEntity.find, function(m) {
			n = m.replace(/[&＆;； ]/g, '');
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
		return this.replace(('[' + arr[0] + ']').getReg(), function(m) {
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

		if (lineLen > strLen) {
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
		var res = getChapters[tag]
		// 取 regChapter 变量
		var t = regChapter[tag], r = '';
		if ('join' in res) {
			r = res.join
			t = t.join(r)
		}
		// 取模板
		var tpl = res.tpl.chapFlag('gm', r)

		var pa = '^[{$b.0}]?(?:{$zz})[{$b.1}]?(?:{$s}[{$b.0}]?{$e}[{$b.1}]?)?$'.fmt(t).chapReg(),
			ta = '[{$b}]'.chapReg('g'),
			na = /，|。|(?:完|完结|待续|未完|终)$/,
			mn;

		return this
			// 连续重复的章节，去重
			.replace('({$zz}\\n{1,2})\\1+'.fmt(tpl.str).chapReg(), '$1')
			// 处理标题的外框
			// 第一章：【标题】/【第一章：标题】/【第一章】标题
			.replace(pa, function(m) {
				mn = m.trim().replace(ta, ' ')
				return mn.find(na) ? m : mn;
			})
			.replace(tpl.str.getReg(tpl.flag), func)
	},
	// 标题过滤
	__chaSkip: function(t) {
		return this.eachArrayRegTest(config.regSkipTitle[t || 't0']);
	},
	// 修正章节标题
	replaceTitle: function(f, e, c, relax) {
		f = f || '\n\n';
		e = e || '';
		var re = this,
			// 替换值
			rChap = regChapter,
			xFinds = '{$n4}[{$c}]'.chapReg(),
			// 补零
			zero = function(n) {
				return n.replaceAt(config.sNumber).replace(/\b\d\b/g, '0$&');
			}

		// 非严格限定
		if (relax) {
			// 标题间隔符（非严格限定）
			rChap.s = rChap.sn;
			// 行尾（非严格限定）
			rChap.es = rChap.e;
		}

		// 处理标题内容
		var handleTitle = function(str, sDiv) {
			str = str
				.replace(/  +/g, ' ')
				.replace('^[{$sep}]+'.chapReg(), '');

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
				.replace(/【?注(\d{1,2})】?/g, '【注$1】')
				// 修正结尾是数字的小标号
				.replace(/([^\w\.\-—·])(\d{1,2}\/\d{1,2})$/, '$1（$2）')
				.replace(/([^\w\.\-—·])[ —-]?\b([012]?[0-9])$/, '$1（$2）')
				// 补零
				.replace(/（\d{1,3}）$/, function(m) {
					return zero(m)
				})
				// 修正结尾是希腊数字的小标号
				.replace(/[ ·]\b[IVXC]{1,6}\b$/i, function(m) {
					return '（' + m.slice(1).toUpperCase() + '）'
				});
			return (sDiv === undefined) ? config.Divide + str : str;
		}

		// 正则标题
		re = re
			/****** 修复标题间多余空格 ******/
			.replace(/^[ 　]*/g, '')
			.cleanSpace('^{$ts}'.chapReg())
			/****** 保护有序列表 ******/
			.replaceArr(config.regListTitle, function(m) {
				return m.replace(/\n$/, '').replace(/^/gm, '\u2620') + '\n'
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
				if (m1.find(/番外|同人|里番|[外前后][传傳]/) && m2.find(/^之/)) {
					return (m1 + m2).setAlign(f, e, c);
				}
				return (m1 + handleTitle(m2)).setAlign(f, e, c);
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
					(!relax && m3.find(/^[！？。…]{1,3}$/)) ||
					// 如果有 `，` 的
					(!m2 && !relax && m3.find(/，/)) ||
					// 如果章节 `第` 开头，结尾限定
					(!m1.find(/^第/) && m3.find(/[！？。…’”』」]{1,3}$/))
				) return m;

				if (!m1.find(xFinds))
					m1 = '第' + m1.replace(/^第+| /g, '');

				return (zero(m1) + handleTitle(m3)).setAlign(f, e, c);
			})
			/****** （01）/（02）标题/（一）/（一）标题 ******/
			.__prepChapter('t3', function(m, m1, m2) {
				// 防止错误，有句号不转
				if (m.__chaSkip('t0')) return m;
				return (zero(m1) + handleTitle(m2, 'no')).setAlign(f, e, c);
			})
		
		// 标题居中直接返回
		if (c !== 'center' && c !== 'break') {
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
					// 章节是数字格式情况下
					m1 = zero(m1);
					if (m.find(/。/) ||
						m2.find(/^[！？。]{1,3}$/) ||
						m.__chaSkip('t0') ||
						m.__chaSkip('t2') ||
						m2.find(m1.find(/^\d+/) ? /[！？。]$/ : /[！？。…’”』」]$/) ||
						m.cleanSpace().__chaSkip('t6')
					) return m;
					return (f + '第' + m1 + ctr + handleTitle(m2) + e);
				})
		}

		return re
			.replaceTitleError()
			// 恢复保护
			.replace(/^\u2620/gm, '')
	},
	// 修复错转的章节标题
	replaceTitleError: function() {
		/***** 清除相连的类似的章节标题 *****/
		var c1 = '^({$t91}[{$c.2}]{$sn})(?:{$e}|$)$\\n+\\1.*$'.chapReg('gm'),
			c3 = '^{$t3}(?:{$e}|$)$\\n+\\1.*$'.chapReg('gm')

		var _rp = function(str) {
			// 判断两行重复标题，以长度保留
			var n = str.replace(/\n+/g, '\n').split('\n', 2);
			// 如果第二行有结尾
			if (n[1].search(/[。！？…～]$/) > -1) {
				return n[0] + '\n' + n[1].replace(n[0], '');
			}
			return n[0].length > n[1].length ? n[0] : n[1];
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
