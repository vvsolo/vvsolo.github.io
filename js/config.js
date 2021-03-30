/****** 常用 - 正则设定 ******/
var strCommon = {
	// 英文间隔符
	'enSep': '\x27`＇‘’『』',
	// 中文
	// CJK is short for Chinese, Japanese, and Korean.
	'han': '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff',
	// 所有拉丁字母，除去英文
	// \u00A0-\u00FF\u0100-\u017F\u0180-\u024F
	//'latin': '\\u00A0-\\u00FF\\u0100-\\u017F\\u0180-\\u024F',
	'latin': '\u00aa\u00ba\u00c0-\u0183\u0186-\u01a6\u01a9-\u01b9\u01ba\u01bf\u01c4-\u01c6\u01c9-\u020b\u0210-\u0240\u0243-\u0293\u0299-\u029f\u02a0\u02a3-\u02ac\u02ae-\u02af\u02b1-\u02b8\u02e0-\u02e3\u036a\u0391-\u03c9\u0401-\u0451\u1d00-\u1dbf\u1e00-\u1eff\u207f\u2090-\u2099\u209c\u211e\u2c60-\u2c7f\ua726-\ua729\ua730-\ua767\ua771-\ua7b7\ua7fb-\ua7ff\uab30-\uab5f\ufb00-\ufb04',
	// 半角标点，无引号
	'hwPun': '\x21-\x26\x28-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E\xA1-\xBF',
	// 半角标点，引号 \x22\x27 双单
	'qhwPun': "\x27",
	// 全角标点，无引号
	'fwPun': '·–—―…※、。〈〉《》【】〔〕〖〗〝〞・！-／：-＠～￠-￥',
	// 全角标点，引号
	'qfwPun': '‘’“”「」『』',
	// 其他标点 @
	'ofwPun': '℃%％‰℉'
}

/****** 标题 - 正则设定 ******/
var strChapter = {
	'space': Space,
	'sep': ' 　，、．·。：—\\.\\,\\:\\-\\|',
	'c': ['卷部', '集篇阙季册闕冊', '章折回话节幕節話'],
	'cf': '[折卷册冊]',
	'crt': '章',
	's0': '[上中下续终續終]',
	's1': '[0-9０-９零一二三四五六七八九十]',
	'n1': '[0-9０-９]{1,4}',
	'n2': '[0-9０-９]{1,4}(?:[-—.][0-9０-９]{1,3})?',
	'n3': '[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7}',
	'n4': '最[初终尾終]|[初前后终尾後終]|[上中下续断續斷]',
	// 短标题
	'w0': '(?:[简簡自]介|介[绍紹]|[预預]告)',
	'w1': '[0-9]{1,2}',
	'w3': '[一二三四五六七八九十]{1,3}',
	// 限制后面的字符最大数
	'en': '{0,40}',
	// 数字间的空格
	'nn': '[0-9０-９\\s]{1,8}'
}

// 标题正则
var regChapter = {
	// 标题无用的外框
	'b': ['〖【\\[', '\\]】〗'],
	// 标题行首空格 regStart
	'f': '[{$space}]*',
	// 标题间隔符（严格限定）regSeparator
	's': '[{$sep}]{1,4}',
	// 标题间隔符 regSeparatorNull
	'sn': '[{$sep}]{0,4}',
	// 行尾 regEnd
	'e': '.{$en}[^。：;；\\n]',
	// 行尾（严格限定） regStrictEnd ’”』」
	'es': '.{$en}[^，。：;；、…？！’”』」?!\\n]',
	/****** 非常规标题·无后续主体 ******/
	't0': '[首小节自次節]序|[题題][注记註記跋]|[题題开開][卷篇头场頭場][诗词语詩詞語]|文案|卷[首后後][语語]|(?:作者)?前言|[全本下][{$c.0}{$c.1}]{$w0}|(?:作品|作者|人物|内容|本书)?{$w0}|篇[后後]|(?:完本|作者)感言|作者[后後的][话話]|正文|导读|導讀|[附目][录錄][0-9]{0,2}',
	/****** 非常规标题·可有后续主体 ******/
	't1': [
		'楔子|引[言子文]|序篇?章|序[言幕目曲传傳卷]?|[后後][记话記話序]|尾[声记聲記]|大?[结結]局',
		'同人[续續]?|[前后外续正後續间間][传篇傳章]|[前后外里裏]番|[续續]{$s1}{1,3}[{$c.2}]?|[番篇]外[篇卷章]?（?{$s1}{0,3}）?',
		'外{$s1}{0,3}[{$c.2}]'
	],
	/****** 01章/第02章/第02-18章/03章：标题/第０９章：标题 ******/
	/****** 一章/第一章/一章：标题/第一章：标题 ******/
	/****** 终卷/终章 ******/
	't2': '((?:第?{$n2}|第?{$n3}|{$n4})[{$c}])',
	/****** （01）/（02）标题/（一）/（一）标题 ******/
	't3': '([\\(（](?:{$n2}|{$n3}|{$s0})[\\)）])',
	/****** 卷一/卷一：标题 ******/
	't4': '({$cf})[{$sep}]{0,4}({$n1}|{$n3})',
	/****** chapter 22 ******/
	't5': '(?:chapter|section|chap|ch|part|☆|★|○|●|◎|◇|◆|□|■|△|▲|※|＃)[ \\.]*({$n1})',
	/****** 01/01./01.标题/一/一、标题 ******/
	't6': '({$n2}|{$n3})',
	/****** 其他标题 ******/
	// 修正括号类标题（一） --> 第一章
	't80': '[\\[\\(（〖【〈［]({$n2}|{$n3})[\\]\\)）〗】〉］]',
	// 修正括号类标题（第一章） --> 第一章
	't81': '[\\[\\(（〖【〈［]((?:第?{$n2}|第?{$n3}|{$n4})[{$c}])[\\]\\)）〗】〉］]',
	// 松散标题
	't90': '(?:第?{$n2}|第?{$n3}|{$n4})',
	// 严格标题
	't91': '(?:第{$n2}|第{$n3}|{$n4})',
	// 修复标题间多余空格
	'ts': '[第\\(（]{$nn}[{$c}\\）)]'
}

// 处理自由组合的标题
Object.extend(String.prototype, {
	chapReg: function(f, r) {
		checkNull(f) && (f = 'gm');
		var d = this.fmt(regChapter, r);
		// 优化速度，只有章节有英文时加入标识
		if (f != '' && f.indexOf('i') == -1 && d.indexOf('chapter') > -1) {
			f += 'i';
		}
		return d.fmtReg(strChapter, f);
	},
	comReg: function(f) {
		checkNull(f) && (f = 'gm');
		return this.fmtReg(strCommon, f);
	}
})

/***** 常规部分 *****/
var configs = {
	// 分隔符样式
	'Separator': '＊＊＊　　＊＊＊　　＊＊＊',
	// 题外话·分隔符样式
	'tSeparator': '＊'.repeat(35),
	// 章节与标题分隔符
	'Divide': '：',
	// 排版时每行最大字数（按双字节计算）
	'Linenum': 35,
	// 段落最大字数换行
	'maxLinenum': 200,
	// 结尾的标识语，用于排版输出时居中，用|分隔
	'endStrs': '待[续續]|未完|未完待[续續]|完|完[结結]|全[文书書][完终終]',
	/****** 文章标题 - 正则设定 ******/
	'novelTitle': /^[ 　]*(《([^》]+)》(.*[^。？！…]|$)|[书書]名[：\:](.+))$/m,
	'novelAuthor': /^[ 　]*((?:[作编译編譯]者|排版|整理)[：\:].*)$/gm,
	/****** 标题忽略 - 正则设定 ******/
	// 全角数字标题
	'regFullNumberTitle': '[第\\(（][０-９]{1,9}[{$c}\\)）]'.chapReg(),
	'regSkipTitle': {
		't0': [
			/[。;；—]$/
		],
		't1': [
			/^[\-—]{1,4}/,
			/^序[长词战兴常稿歌秩次传述長詞戰興傳]/,
			/^[上下]回/,
			/^断章取义/,
			/^同人不/
		],
		't2': [
			/^第?[零一二三四五六七八九十百两]{1,3}(?:部[分]|季[度]|卷[书经]|篇[篇经文]|[部集](?:戏|戲|电[影视視]|的)|部好莱坞|回合|节课)/,
			'^一(?:[{$c}]|[直切生世味]|回[合首头])'.chapReg(''),
			/^(?:二话[没不沒]|三[生世]|四[周边处]|五[谷更]|[百千][折转])/,
			/^上节目/
		],
		't3': [
			'^[一二三四五六七八九十百两兩][{$c}][^，]*[，]'.chapReg(''),
			'^一二三四?五?六?七?[，]'.chapReg(''),
			'^([壹贰叁肆伍陆柒捌玖拾])\\1'.chapReg(''),
			'^(?:{$n1}|{$n2})[年月日]'.chapReg('')
		],
		't6': [
			// 忽略此格式开始的
			// * 日期格式 2010.10.10, 17.10.10, 17/10/10
			// * IP 格式 192.168.0.1
			// * 时间格式 20:22:21
			// * 比分格式 3:0
			// * 2.3亿
			/^\b\d{1,4}(?:[\.。\-\—\/、,，:：]\d{1,12}){1,}/,
			// 忽略日期格式 2010年10月10日
			/^[\d０-９一二三四五六七八九十]{1,4}[年月][\d０-９一二三四五六七八九十]{1,3}[月日]/,
			// 其他不规则格式 100%, 60°
			/^\b[\d\.\-\—\至]{1,12}[%％‰℃°百千万亿wmbk]/i,
			// 10元！20。
			/^[\d０-９一二三四五六七八九十百千万]{1,12}(?:元|块|次|多)?[！？。…]{1,3}$/,
			// 排比数字 1、2、3……
			/^[\d０-９]{1,4}(?:[、，][\d０-９]{1,4}){1,}/
		]
	},
	/****** 英文处理 - 正则设定 ******/
	'rEng': {
		// 约定英语，用|分隔
		'Special': 'iPhone|iPhoneSE|iPhoneX|iPhoneXR|iPhoneXRMax|iPhoneXR|iPad|iPadPro|iPadAir|iMac|iTv|iPod|iOS|ThinkPad|Windows|Linux|Unix|FreeBSD|JavaScript|JScript|VBScript|TikTok|BiuBiu|ByeBye|ing',
		// 约定英文单位，用|分隔
		'Unit': 'MHz|GHz|KHz|kWh|kW|mWh|gWh|mA|μA|mV|μV|mΩ|μΩ|Mbps',
		// 约定英语大写，用|分隔
		'Upper': 'OMG|MTV|SUV|HUV|ORV|TV|ID|CIA|FBI|VIP|CEO|CFO|CTO|COO|CIO|CBD|OA|PC|OEM|SOS|SOHO|PS|ISO|APEC|WTO|USA|GPS|GSM|NASDAQ|MBA|EMBA|EDBA|ATM|GDP|AIDS|CD|VCD|DVD|CDMA|DIY|EMS|EQ|IQ|PDA|DJ|SARS|DNA|RNA|UFO|AV|WTF|TMD|IC|SM|TM|NTR|QQ|DP|KTV|OL|PK|NDE|XXOO|OOXX|PM|CAA|CNN|CBS|BBS|ICM|IMAX|AMC|DC|NG|ABC|VS|SPA|VR|AR|MR|CR|XR|ICU|IPO|IMDB|SWAT|IPTV|GPA|UI|LOL|IP|PVP|PVE|BBC|CCTV|TVB|NHK|PPT|NBC|NBA|CBA|MPV|ESPN|SEGA|YQF|YQ|MMP|IBM|CPU|HDMI|GPU|B2B|C2C|B2C|B2M|B2A|C2A|O2O|CCD|CSS|HTML|WPS|IOS|OS|IMF|LED|OLED|SB|NND|WQLMLGB',
		// 虚词小写，非行首
		'Structural': /(?:!^)\b(?:a|about|an|and|as|at|be|but|by|for|from|in|into|is|nor|of|off|on|onto|or|out|over|should|so|the|to|under|will|with)\b/gi,
		// 特殊的连续单词 转大写
		'Continuou': /\b(?:([a-z])\1+|abcdefg|abcdef|abcde|abcd|abc|bca|dbca|edbca|xyz)\b/gi,
		// 称谓单词前缀
		'Honor': /\b(?:Mrs?|Ms|Doc|Dr|Jr|Rev|Hon|Mmes?|Esq|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec)\b。(?!$)/g,
		// 小写的后缀
		'Suffix': /。\b(?:Avi|Jpg|Bmp|Png|Net)\b/g,
		// 单个字母大写
		'Single': '\\b[a-z]\\b[^ {$latin}]'.comReg('g'),
		// 型号类全部大写
		'Model': /\b[\w\-\~～\\\/]+\b/g,
		// 英文间单引号样式替换
		'Sep': '\\b[a-zA-Z]+[{$enSep}](?: |\\b[a-zA-Z]+\\b)'.comReg('g'),
		// 姓名中的间隔
		'NameSep': '\\b[iodlIODL][{$enSep}]'.comReg('g'),
		//'NameFix': /\b(?:[iodlIODL]\'|Mac|Mc)[a-zA-Z]/g,
		'NameFix': /\b[iodlIODL]\'[a-zA-Z]/g,
		// 括号中的英文 - 20.12.12 删除《》〈〉〔〖〗〕
		'Bracket': '[（【][\\w{$hwPun}{$fwPun}{$latin}]{2,}[】）]'.comReg('g'),
		// 符合的英文
		'PunFix': "\\b[0-9A-Z][ \\w{$latin}']+[0-9a-z]\\b".comReg('g'),
		// 拉丁字母、某些标点后的大写
		'PunAfter': '[，\, {$latin}][A-Z]'.comReg('g'),
		// 拉丁字母后的大写
		'LatinAfter': '[{$latin}]\\b[a-zA-Z]+\\b'.comReg('g'),
		// 重叠连续单词
		'Overlap': /\b(no|go|up)\1+\b/gi,
		// 引用中的英文
		'Quote': '[“‘「『][ \\w{$hwPun}{$qhwPun}{$fwPun}{$latin}]{2,}[』」’”]'.comReg('g'),
		'QuoteTest': /[，。！？…]/,
		// 英文单独一行
		'Line': '^[ \\w{$hwPun}{$qhwPun}{$fwPun}{$qfwPun}{$latin}]{2,}$'.comReg('gm'),
		'LineSkip': '[\\w{$latin}]'.comReg('g')
	},
	/****** 空格 - 正则设定 ******/
	// 汉字间空格
	'hanSpace': ' +[{$han}{$fwPun}{$qfwPun}{$ofwPun}]|[{$han}{$fwPun}{$qfwPun}{$ofwPun}] +'.comReg('g'),
	// 英文间空格
	//'engSpace': '[^0-9a-zA-Z] +\\b[0-9a-zA-Z]+\\b'.comReg('g'),
	// 英文间隔
	'enSep': '\\b([a-zA-Z]+)[{$enSep}]( |\\b[a-zA-Z]+\\b)'.comReg('g'),
	/****** 半角标点符号 ******/
	//'halfPuns': ['。，：；？！＆–—─－（）“”「」‘’『』', '.,:;?!&----()\u0022\u0022\u0022\u0022\u0027\u0027\u0027\u0027'],
	'halfPuns': ['。，：；？！＆–—─－（）', '.,:;?!&----()'],
	'halfSymbol': [
		[/"/g, ' " '],
		[/&/g, ' & '],
		[/\,(?=[0-9a-zA-Z])/g, ', '],
		[/[?:;!]/g, '$& '],
		[/\(/g, ' ('],
		[/\)/g, ') '],
		// fix
		[/\" *([^"]*[…,.!?~]) *\" */g, ' "$1" '],
		[/\" *([^"]*) *\"/g, '"$1"'],
		[/ +\" +/g, '" '],
		[/(\d) ?\" ?(?=\d)/g, '$1"'],
		[/ +(?=[?….!])/g, ''],
		[/([\.\?\!]) *(?=[》】'"”」’』])/g, '$1'],
		[/([A-Z]) *& *(?=[A-Z])/g, '$1&'],
		[/\. *(?=[》】'"])/g, '.'],
		[/\.(?=[0-9a-zA-Z])/gi, '. '],
		[/(\w)……/g, '$1...']
	],
	/****** 引用符号 ******/
	// 法式引号 fr：'‘’“”'
	// 中式引号 cn：'『』「」'
	'cnQuotes': ['‘’“”', '『』「」'],
	// 引号修正
	'rQuotes': [
		// 修正单引号
		[/[`＇‘’『』]/g, '\''],
		[/'([^\'\n]+)'/g, '‘$1’'],
		[/^([ 　]*)'/g, '$1‘'],
		[/'/g, '’'],
		[/’([^‘’]+)’/g, '’$1‘'],
		[/^([ 　]*)’/g, '$1‘'],
		//[/‘$/g, '’'],
		[/：’/g, '：‘'],
		// 修正双引号
		// \[\]
		[/[〝〞［］＂″｢｣“”「」]/g, '\"'],
		[/"([^\"\n]+)"/g, '“$1”'],
		[/^([ 　]*)"/g, '$1“'],
		[/"/g, '”'],
		[/”([^“”]+)”/g, '”$1“'],
		[/^([ 　]*)”/g, '$1“'],
		[/：”/g, '：“']
	],
	/****** 分隔符 ******/
	// !@!@!@!@! 注释符
	// @@@@ 分隔符
	'rSeparator': [
		[/ +(?=[#§●◎◇◆□■△▲※〓＝﹡＋＊☆★@\*×\—\-\+－─=~～])/g, ''],
		// 注释标记※
		[/＊＊{34,}/g, '\n!@!@!@!@!\n'],
		[/[☆★]{4,}/g, '@@@@'],
		[/``{4,}/g, '@@@@'],
		[/&&{4,}/g, '@@@@'],
		// 处理一般情况
		[/[#§●◎◇◆□■△▲※〓＝﹡＋]{3,}/g, '@@@@'],
		[/([。！？…—”」’』])[*＊×xX]{4,}/g, '$1\n@@@@\n'],
		[/^[\*＊×]{3,}/gm, '@@@@'],
		[/\*\*{3,}$/gm, '@@@@'],
		[/^\*\*{2,}$/gm, '@@@@'],
		[/[\—\-－─=\+]{4,}/g, '@@@@'],
		[/^[\—\-－─=~～\+]{2,}$/gm, '@@@@'],
		// 处理特殊情况
		[/^……\n……$/gm, '@@@@'],
		[/^。。+\n。。+$/gm, '@@@@'],
		[/[——]{2,}[分切]割线[——]{2,}/g, '@@@@'],
		[/^.*[分切]割线$/gm, '@@@@'],
		// 修正车牌号
		[/([a-zA-Z])[\-—]@@@+/g, '$1-XXXXX'],
		// 修正多个相连
		[/^@@@+……$/gm, '@@@@'],
		// 修正数字和某些标点后的*号
		[/([\w：，；])\n?@@@@\n?/g, '$1****'],
		[/@@@@\n?([，。！？…’”』」])/g, '****$1'],
		// 处理换行
		[/@@\n+@@/g, '@@@@'],
		[/@@@+/g, '\n@@@@\n'],
		[/\n\n@@@@\n\n/g, '\n@@@@\n']
	],
	/****** 标点符号 ******/
	// 异体标点
	// 角分′
	// 角秒″
	// 连接符–
	// 圆点．
	// 省略号⋯ \u2026
	// 间隔号•●
	'punSymbol': [
		// 按键盘顺序 ﹏﹋﹌ˇ
		'｀‐━―─－ーˉ﹣﹦~﹗!﹫＠﹟＃﹩＄﹪％﹠＆﹡(﹙﹚)﹐,.．∶﹕︰:﹔;﹑﹖?⋯┅¨▪•‧・﹒︳﹛{﹜}〝｢″〃｣‴﹤﹥︿﹀﹢＋／︱¦＂′＇',
		'`———————－＝～！！@@##$$%%&&＊（（）），，。。：：：：；；、？？………·····〉｛｛｝｝““””””＜＞∧∨++/\x7C\x7C\x22\x27\x27'
	],
	// 标点符号修正
	'punSymbolFix': [
		// 破折号 ——
		[/——+/g, '——'],
		// 两个标点以上留一 「」『』“”‘’
		// ：；（）［］｛｝%∧∨〈〉-
		[/([：；（）［］｛｝%∧∨〈〉\-])\1+/g, function(m) {
			return m.slice(0, 1);
		}],
		// 波折号处理
		[/～～+/g, '～～'],
		[/。～～\n/g, '。\n～～'],
		[/？～～\n/g, '？\n～～'],
		[/！～～\n/g, '！\n～～'],
		[/”～～\n/g, '”\n～～'],
		[/…～～\n/g, '…\n～～'],
		//[/」～～$/gm, '」\n～～'],
		// 省略号处理
		[/··+/g, '…'],
		[/、、+/g, '…'],
		[/``+/g, '…'],
		[/°°+/g, '…'],
		[/。。+/g, '…'],
		[/，，，+/g, '…'],
		[/，，+/g, '，'],
		[/…[，：；。`\—·]/g, '…'],
		[/[，：；。`\—·]…/g, '…'],
		[/…+/g, '……'],
		// 修正省略号错误用法
		[/……(等[，。！？])/g, '$1'],
		// 去错误和相联标点
		[/“：/g, '：“'],
		[/：“”/g, '：“'],
		[/“[；，。]/g, '“'],
		//[/「：/g, '：「'],
		//[/：「」/g, '：「'],
		//[/([…。，！？])”[，。！？]/g, '$1”'],
		[/…”[，。！？]/g, '…”'],
		[/。”[，。！？]/g, '。”'],
		[/，”[，。！？]/g, '，”'],
		[/！”[，。！？]/g, '！”'],
		[/？”[，。！？]/g, '？”'],
		[/：[·`]/g, '：'],
		[/。）。/g, '）。'],
		[/。[，、；]/g, '。'],
		//[/([：、，])[；：、？！]/g, '$1'],
		[/、[；：？！。]/g, '、'],
		[/：[；：、？！。]/g, '：'],
		[/，[；：、？！。]/g, '，'],
		[/([…；：？！。])、/g, '$1'],
		// 修正问号和感叹号
		[/？！[？！]+/g, '？！'],
		[/！？[？！]+/g, '？！'],
		[/！！？+/g, '？！'],
		[/？？！+/g, '？！'],
		[/！！！+/g, '！！！'],
		[/？？？+/g, '？？？']
	],
	/****** 结尾修正 ******/
	/**
	 * find     - RegExp 正则查询
	 * skip     - RegExp 正则过滤，和 find 配套
	 * at       - Array  字符逐字替换
	 * rp       - Array  字符替换
	 * rps      - Array  字符批量替换
	 * fix      - Array  替换后修正
	 * upper    - RegExp 正则查询
	 * lower    - RegExp 正则查询
	 * lc       - String 字母大小写，u -> 大写; l -> 小写; f -> 首字母大写
	 **/
	'rEndFix': [
		// 英文连接符–
		{
			'find': /\b[0-9a-zA-Z]+(?:[～—-]+[0-9a-zA-Z]+\b)+/g,
			'rp': [/[～—]/g, '-']
		},
		// 中文连接符–
		{
			'find': /\W(?:[\-]{1,2}\W+)+/g,
			'rp': [/\-/g, '—']
		},
		// 处理 Sid·Meier -> Sid Meier
		{
			'find': /\b[a-zA-Z]{2,}(?:·[a-zA-Z]{2,}\b)+/g,
			'rp': [/·/g, ' ']
		},
		// C:\
		//{
		//	'find': /\b[a-zA-Z]：/g,
		//	'rp': [/：/, ':']
		//},
		// 处理 E。T。 -> E.T.
		{
			'find': /\b(?:[a-zA-Z][\.．。]){1,}(?!$|\W)/g,
			'rp': [/[．。]/g, '.']
		},
		// 处理 url
		{
			//'find': /\b(?:(?:https?|ftp|file)[:：]\/\/)?\b[-a-z0-9+&@#\/%?=~_|!:：,.。；;]+[-a-z0-9+&@#\/%=~_|]/gi,
			'find': /\b(?:(?:https?|ftp|file)[:：]\/{2})?\b(?:[-\w]+[。\.])+(?:com|net|org|gov|top|xyz|cn|me)\b/gi,
			'at': ['：。，～—', ':.,~-'],
			'lc': 'l'
		},
		// 处理 email
		{
			'find': /\b[\w-—]+@[\w-—]+(?:[。\.][\w-—]+)+\b/gi,
			'at': ['。—', '.-'],
			'lc': 'l'
		},
		// 经纬度 20"65'
		{
			'find': '\\b[0-9]{1,3}(?:[.。][0-9]{1,2})? ?[\x22\x27{$qfwPun}] ?[0-9]{1,3}(?:[.。][0-9]{1,2})? ?[\x22\x27{$qfwPun}]'.comReg('g'),
			'at': ['“‘”’「『」』 ', '\x22\x27'.repeat(4)]
		},
		// 修正数字间的全角 （）()
		{
			'find': '\\b[a-zA-Z]*[\\d\\.。]+\\b[{$ofwPun}]?(?:[。·.：〉〈＝＊，,—]\\b[\\d\\.。]+\\b[{$ofwPun}]?)+'.comReg('g'),
			'skip': ['[{$ofwPun}][.,]'.comReg('')],
			'at': ['。·.：〉〈＝＊，—', '...:><=*,-']
		},
		// 计量单位后跟标点，还原
		{
			'find': '[{$ofwPun}][.,]'.comReg('g'),
			'at': ['.,', '。，']
		},
		// 小数字点后是三位，还原
		{
			'find': /\b\d+\.\d{3,}\b/g,
			'skip': [/\b0\.\d{3,}\b/g],
			'rp': [/\./g, '。']
		},
		// 修正数字后缀 20,000.00 12.99%
		{
			'find': '\\b(?:[0-9]+[,，。.]*)+(?:[a-zA-Z]+\\b|\\b(?:人民币|软妹币?|元|[韩美日港澳]元|英镑|港币|新?台币|法郎|比索|[金人千万亿]|[{$ofwPun}]))'.comReg('g'),
			'at': ['，。', ',.']
		},
		// 倒计时样式的，还原逗号
		{
			'find': /\b\d+(?:[\,，]\d+\b){2,10}/g,
			'rp': [/\,/g, '，']
		},
		// 非标准中文数字间隔样式，还原逗号
		{
			'find': /\b\d+\,\d{1,2}\b/g,
			'rp': [/\,/g, '，']
		},
		// IP 格式 192.168.0.1
		{
			'find': /\b[12]?\d{1,2}(?:[。.][12]?\d{1,2}){3}\b/g,
			'rp': [/。/g, '.']
		},
		// 时间 00:00:05，150
		//{
		//	'find': /\b\d{1,2}[:：]\d{1,2}(?:[:：]\d{1,2})?(?:，\b\d{1,4}\b| ?A。?M。?| ?P。?M。?)?/gi,
		//	'at': ['。：， ', '.:,']
		//},
		// 修复字母数字最后的标点
		{
			'find': /\w[.,:]([^\w\"\'”」]|$)/g,
			'at': ['.:, ', '。：，']
		},
		// 大写的英文 代词、经纬度
		{ 'upper': /\b(?:i|ok|n|e|w|s)\b/gi },
		// 特定的大写的英文
		{ 'upper': /\b(?:it|at)\b[^ \']/gi },
		// 引用开始的第一个字母大写
		{ 'upper': /[《〈〔〖（【]\b[a-z]/g },
		// 缩拼字母的省市县
		{ 'upper': /\b[a-zA-Z]{1,3}[国省市县山城江河]/g },
		// 特定的小写的英文
		{ 'lower': /\'\b[a-zA-Z]+ /g }
	],
	'rEnd': [
		// 处理 Up / Down -> Up/Down
		[/ *\/ *(?=\b[a-zA-Z]+\b)/g, '/'],
		// 修正箭头
		[/ *—{1,2}> */g, ' --> '],
		[/ *={1,2}> */g, ' => '],
		// 公司简称
		[/Co。，? ?Ltd。?/gi, 'Co.,Ltd.'],
		// 处理 No。1 -> NO.1
		[/\bno[。\.](?=\d{1,2})/gi, 'NO.'],
		[/\bgame ?over\b/gi, 'Game Over'],
		[/[&＆]\b[Aa]mp\b[；;]?/g, '&']
	],
	/****** 其他替换设定 ******/
	// 全半角数字字母
	'sNumberLetter': [
		'０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	],
	// 全半角数字
	'sNumber': ['０１２３４５６７８９', '0123456789'],
	// 拼音声调
	'sPinYinTone': ['āáǎàēéěèōóǒòīíǐìūúǔùǖǘǚǜüḿńň', 'aaaaeeeeooooiiiiuuuuvvvvvmmnn'],
	// 变体字母
	'sVariants': [
		'ÀÁÂÃÄÅĀАǍⱭàáâãäåāǎɑаßЬЪьъÇçÐÈÉÊËĒĚèéêëēěΗんÌÍÎÏĪǏΙìíîïīǐιМḿмΝÑŃŇИñńňиηÒÓÔÕÖŌǑØОòóôõöōðǒøоÞΡþρΤτÙÚÛÜŪǓǕǗǙǛυùúûüūǔǖǘǚǜⅤⅴνЩщωΥÝŸγýÿ',
		'AAAAAAAAAaaaaaaaaaaaBbbbbCcDEEEEEEeeeeeeHhIIIIIIIiiiiiiiMmmmNNNNNnnnnnOOOOOOOOOooooooooooPPppTtUUUUUUUUUUuuuuuuuuuuuVvvWwwYYYyyy'
	],
	// 变体序号
	'sSerialNumber': [
		'⓪⓿⒈①➀⓵➊❶⑴⒉②⓶➁➋❷⑵⒊③⓷➂➌❸⑶⒋④⓸➃➍❹⑷⒌⑤⓹➄➎❺⑸⒍⓺⑥➅➏❻⑹⒎⓻⑦➆➐❼⑺⒏⓼⑧➇➑❽⑻⒐⑨➈⓽➒❾⑼⒑⑩➉⓾➓❿⑽⒒⑪⑾⒓⑫⑿⒔⑬⒀⒕⑭⒁⒖⑮⒂⒗⑯⒃⒘⑰⒄⒙⑱⒅⒚⑲⒆⒛⑳⒇㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩',
		'00|00|01|01|01|01|01|01|01|02|02|02|02|02|02|02|03|03|03|03|03|03|03|04|04|04|04|04|04|04|05|05|05|05|05|05|05|06|06|06|06|06|06|06|07|07|07|07|07|07|07|08|08|08|08|08|08|08|09|09|09|09|09|09|09|10|10|10|10|10|10|10|11|11|11|12|12|12|13|13|13|14|14|14|15|15|15|16|16|16|17|17|17|18|18|18|19|19|19|20|20|20|一|二|三|四|五|六|七|八|九|十|一|二|三|四|五|六|七|八|九|十'
	],
	// HTML 字符实体
	'regHtmlEntity': /[&＆]? ?[a-zA-Z1-8]{2,18}[;；]/g,
	'sHtmlEntity': {dollar:36,cent:162,pound:163,curren:164,yen:165,copy:169,reg:174,trade:8482,commat:64,Copf:8450,incare:8453,gscr:8458,hamilt:8459,Hfr:8460,Hopf:8461,planckh:8462,planck:8463,Iscr:8464,image:8465,Lscr:8466,ell:8467,Nopf:8469,numero:8470,copysr:8471,weierp:8472,Popf:8473,Qopf:8474,Rscr:8475,real:8476,Ropf:8477,rx:8478,Zopf:8484,mho:8487,Zfr:8488,iiota:8489,bernou:8492,Cfr:8493,escr:8495,Escr:8496,Fscr:8497,Mscr:8499,oscr:8500,alefsym:8501,beth:8502,gimel:8503,daleth:8504,DD:8517,dd:8518,ee:8519,ii:8520,starf:9733,star:9734,phone:9742,female:9792,male:9794,spades:9824,clubs:9827,hearts:9829,diams:9830,loz:9674,sung:9834,flat:9837,natural:9838,sharp:9839,check:10003,cross:10007,malt:10016,sext:10038,VerticalSeparator:10072,lbbrk:10098,rbbrk:10099,excl:33,num:35,percnt:37,amp:38,lpar:40,rpar:41,ast:42,comma:44,period:46,sol:47,colon:58,semi:59,quest:63,lbrack:91,bsol:92,rbrack:93,Hat:94,lowbar:95,grave:96,lbrace:123,vert:124,rbrace:125,tilde:126,circ:710,nbsp:160,ensp:8194,emsp:8195,thinsp:8201,zwnj:8204,zwj:8205,lrm:8206,rlm:8207,iexcl:161,brvbar:166,sect:167,uml:168,ordf:170,not:172,shy:173,macr:175,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,sup1:185,ordm:186,iquest:191,hyphen:8208,ndash:8211,mdash:8212,horbar:8213,Vert:8214,dagger:8224,Dagger:8225,bull:8226,nldr:8229,hellip:8230,permil:137,pertenk:8241,prime:8242,Prime:8243,tprime:8244,bprime:8245,oline:8254,caret:8257,hybull:8259,frasl:8260,bsemi:8271,qprime:8279,quot:34,apos:39,laquo:171,raquo:187,lsquo:8216,rsquo:8217,sbquo:8218,ldquo:8220,rdquo:8221,bdquo:8222,lsaquo:8249,rsaquo:8250,frac14:188,frac12:189,frac34:190,frac13:8531,frac23:8532,frac15:8533,frac25:8534,frac35:8535,frac45:8536,frac16:8537,frac56:8538,frac18:8539,frac38:8540,frac58:8541,frac78:8542,plus:43,minus:8722,times:215,divide:247,equals:61,ne:8800,plusmn:177,lt:60,gt:62,deg:176,fnof:402,forall:8704,comp:8705,part:8706,exist:8707,nexist:8708,empty:8709,nabla:8711,isin:8712,notin:8713,ni:8715,notni:8716,prod:8719,coprod:8720,sum:8721,mnplus:8723,plusdo:8724,setminus:8726,lowast:8727,compfn:8728,radic:8730,prop:8733,infin:8734,angrt:8735,ang:8736,angmsd:8737,angsph:8738,mid:8739,nmid:8740,parallel:8741,npar:8742,and:8743,or:8744,cap:8745,cup:8746,int:8747,Int:8748,iiint:8749,conint:8750,Conint:8751,Cconint:8752,cwint:8753,cwconint:8754,awconint:8755,there4:8756,because:8757,ratio:8758,Colon:8759,minusd:8760,mDDot:8762,homtht:8763,sim:8764,bsim:8765,ac:8766,acd:8767,wreath:8768,nsim:8769,esim:8770,sime:8771,nsime:8772,cong:8773,simne:8774,ncong:8775,asymp:8776,nap:8777,approxeq:8778,apid:8779,bcong:8780,asympeq:8781,bump:8782,bumpe:8783,esdot:8784,eDot:8785,efDot:8786,erDot:8787,colone:8788,ecolon:8789,ecir:8790,cire:8791,wedgeq:8793,veeeq:8794,trie:8796,equest:8799,equiv:8801,nequiv:8802,le:8804,ge:8805,lE:8806,gE:8807,lnE:8808,gnE:8809,Lt:8810,Gt:8811,between:8812,NotCupCap:8813,nlt:8814,ngt:8815,nle:8816,nge:8817,lsim:8818,gsim:8819,nlsim:8820,ngsim:8821,lg:8822,gl:8823,ntlg:8824,ntgl:8825,pr:8826,sc:8827,prcue:8828,sccue:8829,prsim:8830,scsim:8831,npr:8832,nsc:8833,sub:8834,sup:8835,nsub:8836,nsup:8837,sube:8838,supe:8839,nsube:8840,nsupe:8841,subne:8842,supne:8843,cupdot:8845,uplus:8846,sqsub:8847,sqsup:8848,sqsube:8849,sqsupe:8850,sqcap:8851,sqcup:8852,oplus:8853,ominus:8854,otimes:8855,osol:8856,odot:8857,ocir:8858,oast:8859,odash:8861,plusb:8862,minusb:8863,timesb:8864,sdotb:8865,vdash:8866,dashv:8867,top:8868,perp:8869,models:8871,vDash:8872,Vdash:8873,Vvdash:8874,VDash:8875,nvdash:8876,nvDash:8877,nVdash:8878,nVDash:8879,prurel:8880,vltri:8882,vrtri:8883,ltrie:8884,rtrie:8885,origof:8886,imof:8887,mumap:8888,hercon:8889,intcal:8890,veebar:8891,barvee:8893,angrtvb:8894,lrtri:8895,xwedge:8896,xvee:8897,xcap:8898,xcup:8899,diamond:8900,sdot:8901,Star:8902,divonx:8903,bowtie:8904,ltimes:8905,rtimes:8906,lthree:8907,rthree:8908,bsime:8909,cuvee:8910,cuwed:8911,Sub:8912,Sup:8913,Cap:8914,Cup:8915,fork:8916,epar:8917,ltdot:8918,gtdot:8919,Ll:8920,Gg:8921,leg:8922,gel:8923,cuepr:8926,cuesc:8927,nprcue:8928,nsccue:8929,nsqsube:8930,nsqsupe:8931,lnsim:8934,gnsim:8935,prnsim:8936,scnsim:8937,nltri:8938,nrtri:8939,nltrie:8940,nrtrie:8941,vellip:8942,ctdot:8943,utdot:8944,dtdot:8945,disin:8946,isinsv:8947,isins:8948,isindot:8949,notinvc:8950,notinvb:8951,isinE:8953,nisd:8954,xnis:8955,nis:8956,notnivc:8957,notnivb:8958,lceil:8968,rceil:8969,lfloor:8970,rfloor:8971,lang:9001,rang:9002,Alpha:913,Beta:914,Gamma:915,Delta:916,Epsilon:917,Zeta:918,Eta:919,Theta:920,Iota:921,Kappa:922,Lambda:923,Mu:924,Nu:925,Xi:926,Omicron:927,Pi:928,Rho:929,Sigma:931,Tau:932,Upsilon:933,Phi:934,Chi:935,Psi:936,Omega:937,alpha:945,beta:946,gamma:947,delta:948,epsilon:949,zeta:950,eta:951,theta:952,iota:953,kappa:954,lambda:955,mu:956,nu:957,xi:958,omicron:959,pi:960,rho:961,sigmaf:962,sigma:963,tau:964,upsilon:965,phi:966,chi:967,psi:968,omega:969,thetasym:977,upsih:978,piv:982,Agrave:192,Aacute:193,Acirc:194,Atilde:195,Auml:196,Aring:197,AElig:198,Ccedil:199,Egrave:200,Eacute:201,Ecirc:202,Euml:203,Lgrave:204,Lacute:313,Lcirc:206,Luml:207,ETH:208,Ntilde:209,Ograve:210,Oacute:211,Ocirc:212,Otilde:213,Ouml:214,Oslash:216,Ugrave:217,Uacute:218,Ucirc:219,Uuml:220,Yacute:221,THORN:222,szlig:223,agrave:224,aacute:225,acirc:226,atilde:227,auml:228,aring:229,aelig:230,ccedil:231,egrave:232,eacute:233,ecirc:234,euml:235,igrave:236,iacute:237,icirc:238,iuml:239,eth:240,ntilde:241,ograve:242,oacute:243,ocirc:244,otilde:245,ouml:246,oslash:248,ugrave:249,uacute:250,ucirc:251,uuml:252,yacute:253,thorn:254,yuml:255,Amacr:256,amacr:257,Abreve:258,abreve:259,Aogon:260,aogon:261,Cacute:262,cacute:263,Ccirc:264,ccirc:265,Cdot:266,cdot:267,Ccaron:268,ccaron:269,Dcaron:270,dcaron:271,Dstrok:272,dstrok:273,Emacr:274,emacr:275,Edot:278,edot:279,Eogon:280,eogon:281,Ecaron:282,ecaron:283,Gcirc:284,gcirc:285,Gbreve:286,gbreve:287,Gdot:288,gdot:289,Gcedil:290,Hcirc:292,hcirc:293,Hstrok:294,hstrok:295,Itilde:296,itilde:297,Imacr:298,imacr:299,Iogon:302,iogon:303,Idot:304,imath:305,IJlig:306,ijlig:307,Jcirc:308,jcirc:309,Kcedil:310,kcedil:311,kgreen:312,lacute:314,Lcedil:315,lcedil:316,Lcaron:317,lcaron:318,Lmidot:319,lmidot:320,Lstrok:321,lstrok:322,Nacute:323,nacute:324,Ncedil:325,ncedil:326,Ncaron:327,ncaron:328,napos:329,ENG:330,eng:331,Omacr:332,omacr:333,Odblac:336,odblac:337,OElig:338,oelig:339,Racute:340,racute:341,Rcedil:342,rcedil:343,Rcaron:344,rcaron:345,Sacute:346,sacute:347,Scirc:348,scirc:349,Scedil:350,scedil:351,Scaron:352,scaron:353,Tcedil:354,tcedil:355,Tcaron:356,tcaron:357,Tstrok:358,tstrok:359,Utilde:360,utilde:361,Umacr:362,umacr:363,Ubreve:364,ubreve:365,Uring:366,uring:367,Udblac:368,udblac:369,Uogon:370,uogon:371,Wcirc:372,wcirc:373,Ycirc:374,ycirc:375,Yuml:376,Zacute:377,zacute:378,Zdot:379,zdot:380,Zcaron:381,zcaron:382,DownBreve:785,olarr:8634,orarr:8635,lharu:8636,lhard:8637,uharr:8638,uharl:8639,rharu:8640,rhard:8641,dharr:8642,dharl:8643,rlarr:8644,udarr:8645,lrarr:8646,llarr:8647,uuarr:8648,rrarr:8649,ddarr:8650,lrhar:8651,rlhar:8652,nlArr:8653,nhArr:8654,nrArr:8655,lArr:8656,uArr:8657,rArr:8658,dArr:8659,hArr:8660,vArr:8661,nwArr:8662,neArr:8663,seArr:8664,swArr:8665,lAarr:8666,rAarr:8667,ziglarr:8668,zigrarr:8669,larrb:8676,rarrb:8677,duarr:8693,hoarr:8703,loarr:8701,roarr:8702,xlarr:10229,xrarr:10230,xharr:10231,xlArr:10232,xrArr:10233,xhArr:10234,dzigrarr:10239,xmap:10236,nvlArr:10498,nvrArr:10499,nvHarr:10500,Map:10501,lbarr:10508,rbarr:10509,lBarr:10510,rBarr:10511,RBarr:10512,DDotrahd:10513,UpArrowBar:10514,DownArrowBar:10515,Rarrtl:10518,latail:10521,ratail:10522,lAtail:10523,rAtail:10524,larrfs:10525,rarrfs:10526,larrbfs:10527,rarrbfs:10528,nwarhk:10531,nearhk:10532,searhk:10533,swarhk:10534,nwnear:10535,nesear:10536,seswar:10537,swnwar:10538,cudarrr:10549,ldca:10550,rdca:10551,cudarrl:10552,larrpl:10553,curarrm:10556,cularrp:10557,rarrpl:10565,harrcir:10568,Uarrocir:10569,lurdshar:10570,ldrushar:10571,RightUpDownVector:10575,DownLeftRightVector:10576,LeftUpDownVector:10577,LeftVectorBar:10578,RightVectorBar:10579,RightUpVectorBar:10580,RightDownVectorBar:10581,DownLeftVectorBar:10582,DownRightVectorBar:10583,LeftUpVectorBar:10584,LeftDownVectorBar:10585,LeftTeeVector:10586,RightTeeVector:10587,RightUpTeeVector:10588,RightDownTeeVector:10589,DownLeftTeeVector:10590,DownRightTeeVector:10591,LeftUpTeeVector:10592,LeftDownTeeVector:10593,lHar:10594,uHar:10595,rHar:10596,dHar:10597,luruhar:10598,ldrdhar:10599,ruluhar:10600,rdldhar:10601,lharul:10602,llhard:10603,rharul:10604,lrhard:10605,udhar:10606,duhar:10607,RoundImplies:10608,erarr:10609,simrarr:10610,larrsim:10611,rarrsim:10612,rarrap:10613,ltlarr:10614,gtrarr:10616,subrarr:10617,suplarr:10619,lfisht:10620,rfisht:10621,ufisht:10622,dfisht:10623}
}
