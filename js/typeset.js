// 分隔字数、实际分隔字数
var vNum = config.Linenum,
	cutNum = config.Linenum * 2

// 截取分段
function doSplit(str, sm, bm) {
	if (str.len() < 1) {
		return str + bm
	}
	if (str.search(/^　　+/) > -1 || str.search(/^＊{5,}/) > -1) {
		return str + bm
	}

	var linestr = '　　' + str
	// 小于每行最大字数时直接返回
	if (cutNum >= linestr.len())
		return linestr + bm

	var oNum = ~~(linestr.length / vNum) + 1,
		text = [], testTmp, rStr

	// 查询单字节总数
	var findEngStr = linestr.findCount(/[\x00-\xff]/g)
	// 如果全是单字节
	var findAllEngStr = linestr.replace(/^　　+/, '').search(/^[\x00-\xff]+$/) > -1
	while (oNum--) {
		var sublen = 0, sinBytes, tmp,
			FirstLine = true
		// 如果全是单字节
		if (findAllEngStr) {
			// 如果是首次截取
			if (FirstLine) {
				sublen = vNum - 2
				FirstLine = false
			} else {
				sublen = vNum
			}
		}
		// 如果有英文
		else if (findEngStr > 0) {
			// 预分段
			tmp = linestr.slice(0, vNum)
			// 英文单字节数
			if (sinBytes = tmp.findCount(/[\x00-\xff]/g)) {
				// 预取补齐字符串，如果全是双字节
				if (linestr.slice(vNum, sinBytes).len() === sinBytes*2) {
					sublen = ~~(sinBytes/2)
				} else {
					// 预取英文半数
					sublen = Math.round(sinBytes/2)
					var i = sublen
					while (i--) {
						sublen++
						if (linestr.slice(0, vNum + sublen).len() > cutNum) {
							sublen--
							break;
						}
					}
				}
			}
		}
		// 按修正后的字数截取字符串
		tmp = linestr
			.slice(0, vNum + sublen)
			// 防止行尾限制标点，放置到下行
			// 防止英文单词断行，放置到下行
			// ［〔【｛·‘『“「〈《
			//.replace(/[［〔【｛『「〈《]{1,2}$|\b\w+$/, function(m) {
			.replace(/[［〔【｛『「〈《]{1,2}$/, function(m) {
				linestr += m
				return ''
			})

		// 剩下部分
		linestr = linestr
			.replace(tmp, '')
			// 判断并处理行首限制字符
			// 处理两个字符，因为经过整理过的标点只留两个
			// ，、。：；？！）］〕】｝·’』”」〉》
			.replace(/^[，、。：；？！）］〕】｝』」〉》…～—]{1,2}/, function(m) {
				tmp += m
				return ''
			})
			
		text.push(tmp)
	}
	return text.join('\n') + bm
}

// 分段排版
function onTypeSetSplit(str) {
	// 执行整理
	str = '\n' + str
		// 排版初始化，去空格空行
		.replaceInit()
		// 引号替换
		.convertCNQuotes()
		.replace(/作者：.*?\n[\d\/]*[发發]表[于於]：.*?\n是否首[发發]：.*?\n字[数數]：.*?\n/gm, '')
		// 转换半角
		.convertNumberLetter()
		// 修正分隔符号
		.replaceSeparator()
		// 分隔符居中
		.replace(('^' + config.Separator + '$').getReg('gm'), function(m) {
			return m.setAlign('', '', 'center')
		})
		// 结尾居中
		.replace(('^[（【“「<]?(?:' + config.endStrs + ')[）】”」>]?$').getReg('gm'), function(m) {
			return m.setAlign('', '', 'center')
		})
		// 书名居中
		.replace(config.novelTitle, function(m) {
			return m.setAlign('', '', 'center')
		})
		// 标题居中
		.replaceTitle('', '\n', 'center')
		.split('\n')
		.map(function(v) {
			return doSplit(v, '\n\n', '\n\n')
		})
		.join('')
		.replace(/^[ 　]+$\n/gm, '')
		.replace(/\n\n{2,}/gm, '\n\n')
		// 作者类居左
		.replace(config.novelAuthor, function(m) {
			return m.trim() + '\n'
		})
		.replaceEnd()
		.replace(/\n\n{3,}/gm, '\n\n\n')

	if ( !$('#Check_AddTop').is(':checked') )
		return str
	// 插入标头
	var headStr = ($('#chinese').html() !== '简') ?
		'作者：{$w}\n{$d}发表于：{$b}\n是否首发：{$y}\n字数：{$n} 字\n' :
		'作者：{$w}\n{$d}發表於：{$b}\n是否首發：{$y}\n字數：{$n} 字\n';
	return headStr.fmt({
		'w': $('#inputAuthor').val().trim() || ' ',
		'b': $('#inputSite').val().trim() || ' ',
		'y': $('#Check_0').is(':checked') ? '是' : '否',
		'd': new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()),
		'n': (str.length - str.findCount(/[　\s]/g)).toLocaleString()
	}) + '\n' + str
}

// 阅读排版
function onTypeSetRead(str) {
	return str
		// 排版初始化，去空格空行
		.replaceInit()
		// 半角字母数字
		.convertNumberLetter()
		// 修正章节标题
		.replaceTitle('\n\n', '', 'break')
		// 修正分隔符号
		.replaceSeparator()
		// 修正作者后面未空行
		.replace(config.novelAuthor, '$1\n')
		.replace(/^/gm, '　　')
		.replace(/(^　　$\n)+/gm, '　　\n')
		.replace(/\n{3,}/gm, '\n\n')
		.replace(/^\n{2,}/, '\n')
}

// 一键整理
function editorCleanUp(str) {
	// 排版初始化，去空格空行
	str = str.replaceInit();
	// HTML 字符实体转换
	if ($('#Check_1').is(':checked'))
		str = str.convertHtmlEntity()
	// Unicode转换
	if ($('#Check_2').is(':checked'))
		str = str.convertUnicode()
	// 转换变体字母
	if ($('#Check_3').is(':checked'))
		str = str.convertVariant()
	// 转换变体序号
	if ($('#Check_4').is(':checked'))
		str = str.convertSerialNumber()
	// 半角字母数字
	if ($('#Check_6').is(':checked'))
		str = str.convertNumberLetter()
	// 修正章节标题
	if ($('#Check_7').is(':checked')) {
		// 修正错误标题
		str = str
			.replaceTitle()
			.replaceTitleError()
	}
	// 全角标点符号
	if ($('#Check_5').is(':checked'))
		str = str.convertPunctuation()
	// 去除汉字间的空格
	if ($('#Check_8').is(':checked'))
		str = str.replaceSpace()
	// 修正分隔符号
	if ($('#Check_9').is(':checked'))
		str = str.replaceSeparator()
	// 修正引号
	if ($('#Check_10').is(':checked'))
		str = str.replaceQuotes()
	// 修正英文
	if ($('#Check_11').is(':checked'))
		str = str.convertEnglish()
	// 结束
	return str.replaceEnd()
}

// 特殊整理
function editorCleanUpEx(str) {
	var safeStr = ['\n\u2620', '\u2620\n'],
		// 结尾
		endStr = ('^[\\(（【〖“「［<](?:' + config.endStrs + ')[>］」”〗】）\\)]$').getReg('gm')
	// 其他自定义修正
	var Others = [
		//****** 修正错误语句换行 ******/
		[/([^。！？…”」\.\!\?\~\x22\x27\u2620；〗】]$)\n+([^\u2620])/gm, '$1$2'],
		// 修正错误的换行
		[/^((?!第[\d一二三四五六七八九十百千]+|\u2620).+[“「][\u4E00-\u9FA5]+[”」]$)\n+/gm, '$1'],
		[/^([^\u2620]*[“「][^，。？！…~～\─]+[”」]$)\n+/gm, '$1'],
		[/，([”」])\n+/gm, '，$1'],
		// 修正被分隔的标点符号
		[/…\n+…/gm, '……'],
		[/\n+([”」])/gm, '$1'],
		[/…([“「])/g, '…\n$1'],
		[/(.$)\n+[）\)]([^，。…！？])/gm, '$1）\n$2'],
		[/分卷阅读(\d+)/g, ''],
		// 去除标题保护
		[safeStr.join('|').getReg('gm'), '\n'],
		//[/(^〖【|】〗$)/gm, '\n'],
		[/\u2620(?=第[\d一二三四五六七八九十百千]+章)/g, ''],
		[/(第[\d一二三四五六七八九十百千]+章：)/g, '\n$1']
	]

	str = str
		// 排版初始化，去空格空行
		.replaceInit()
		// 去除汉字间的空格
		.replaceSpace()
		// 保护书名不换行
		.replace(config.novelTitle, function(m) {
			return safeStr[0] + m + safeStr[1]
		})
		// 保护作者不换行
		.replace(config.novelAuthor, function(m) {
			return safeStr[0] + m + safeStr[1]
		})
		// 修正章节标题，加标题保护码
		.replaceTitle(safeStr[0], safeStr[1])
		// 修正引号
		.replaceQuotes()
		// 其他自定义修正
		.replaces(Others)
		.replace(endStr, '')

	return editorCleanUp(str)
}

// 组合文章标题
function setTitle(){
	var tmpReg = /^[（【“「<]|[）】”」>]$/g,
		iBookName = $('#inputBookName').val(),
		iChapter = $('#inputChapter').val(),
		iBookInfo = ''
	if(iBookName.length > 0)
		iBookInfo = '【' + iBookName.trim().replace(tmpReg, '') + '】'
	if(iChapter.length > 0)
		iBookInfo += '（' + iChapter.trim().replace(tmpReg, '') + '）'
	 $('#TitleMsg').html(iBookInfo || $('#TitleMsg').attr('data-tip'))
}
