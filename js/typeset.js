/**** 截取分段 ****/
const _safeStr = common.sf;
function doSplit(str) {
	const bm = '\n';
	if (str.length < 1 || str.startsWith('　　') || str.startsWith('＊＊＊＊＊')) {
		return str + bm;
	}

	const _safeReg = '^' + _safeStr;
	if (~str.search(_safeReg.getReg(''))) {
		return str.replace(_safeReg.getReg('g'), '')
	}

	// 分隔字数、实际分隔字数
	const vNum = config.Linenum;
	const cutNum = vNum * 2;
	let linestr = '　　' + str;
	// 小于每行最大字数时直接返回
	if (cutNum >= linestr.len()) {
		return linestr + bm;
	}

	let oNum = ~~(linestr.length / vNum) + 1;
	// 查询单字节总数
	const findEngStr = linestr.findCount(/[\x00-\xff]/g);
	// 如果全是单字节
	const findAllEngStr = ~str.search(/^[\x00-\xff]+$/);
	const text = [];

	while (oNum--) {
		let sublen = 0, FirstLine = true, sinBytes, tmp, i;
		// 如果全是单字节
		if (findAllEngStr) {
			// 如果是首次截取
			if (FirstLine) {
				sublen = vNum - 2;
				FirstLine = false;
			} else sublen = vNum;
		}
		// 如果有英文
		else if (findEngStr > 0) {
			// 预分段
			tmp = linestr.slice(0, vNum);
			// 英文单字节数
			if (sinBytes = tmp.findCount(/[\x00-\xff]/g)) {
				// 预取补齐字符串，如果全是双字节
				if (linestr.slice(vNum, sinBytes).len() === sinBytes * 2) {
					sublen = ~~(sinBytes / 2);
				} else {
					// 预取英文半数
					sublen = Math.round(sinBytes / 2);
					i = sublen;
					while (i--) {
						sublen++;
						if (linestr.slice(0, vNum + sublen).len() > cutNum) {
							sublen--;
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
			});
		// 剩下部分
		linestr = linestr
			.replace(tmp, '')
			// 判断并处理行首限制字符
			// 处理两个字符，因为经过整理过的标点只留两个
			// ，、。：；？！）］〕】｝·’』”」〉》
			.replace(/^[，、。：；？！）］〕】｝』」〉》…～—]{1,2}/, function(m) {
				tmp += m
				return ''
			});
		text.push(tmp);
	}
	return text.join('\n').replace(/\n+$/, '') + bm;
}

// 分段排版
function onTypeSetSplit(str) {
	// 执行整理
	str = '\n' + str
		// 排版初始化，去空格空行
		// 转直角引号
		.conv('Init,CNQuote')
		// 清除原标头
		.replace(/作者：.*?\n[\d\/]*[发發]表[于於]：.*?\n是否首[发發]：.*?\n字[数數]：.*?\n/gm, '')
		// 转换半角
		// 修正分隔符号
		.conv('NumberLetter,Separator')
		// 书名居中
		.findCenter(/^《[^》]+》$/m)
		// 分隔符居中
		.findCenter(config.Separator.getReg('gm'))
		// 结尾居中
		.findCenter(config.endStrs)
		// 标题居中
		.conv('Chapter', 'center')
		// 分割段落
		.mapLine(doSplit)
		.conv('Finish');

	if ( !$('#Check_AddTop').is(':checked') )
		return str;
	// 插入标头
	const headStr = ($('#chinese').html() !== '简') ?
		'作者：{$w}\n{$d}发表于：{$b}\n是否首发：{$y}\n字数：{$n} 字\n' :
		'作者：{$w}\n{$d}發表於：{$b}\n是否首發：{$y}\n字數：{$n} 字\n';
	return headStr.fmt({
		'w': $('#inputAuthor').val().trim() || ' ',
		'b': $('#inputSite').val().trim() || ' ',
		'y': $('#Check_0').is(':checked') ? '是' : '否',
		'd': new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()),
		'n': (str.length - str.findCount(/[　\s]/g)).toLocaleString()
	}) + '\n' + str;
}

// 阅读排版
function onTypeSetRead(str) {
	return str
		.conv('Init,Separator')
		.conv('Chapter', 'nofix')
		.replace(config.novelAuthor, '$1\n')
		.replace(/^/gm, '　　')
		.replace(/(^　　$\n)+/gm, '　　\n')
		.replace(/\n\n{2,}/g, '\n\n')
		.replace(/^\n{2,}/, '\n');
}

// 一键整理
function editorCleanUp(str) {
	var _met = [
		'HtmlEntity', 'Unicode', 'Variant', 'SerialNumber',
		'Punctuation', 'NumberLetter', 'Space', 'Chapter',
		'Separator', 'Quote', 'English'
	].filter((v, i) => $(`#Check_${i + 1}`).prop('checked'))
	return str.conv(["Init"].concat(_met).concat("End"));
}

// 特殊整理
function editorCleanUpEx(str) {
	/****** 修正错误换行 ******/
	const _break = [
		'[^。！？…”：；〗】{$sf}]\\n[^{$sf}]'.commReg('gm'),
		'[^。！？…”：；〗】{$sf}]\\n[^{$sf}]'.commReg('gm'),
		'^(?!第[\\d一二三四五六七八九十百千]+|{$sf}).+“[{$han}]+”\n+'.commReg('gm'),
		'^[^{$sf}\\n]*“[^，：。？！…～\\─\\n]+”\\n+'.commReg('gm'),
		/…\n[^”\n]+”$/gm,
		/，”\n/g,
		// 修正被分隔的标点符号
		/…\n…/g,
		/\n”/g,
		/\n^“$/gm
	].map(v => [v, (m) => m.replace(/\n/g, '')]);
	/****** 其他自定义修正 ******/
	const _other = [
		// 去除标题保护
		['[{$sf}]+'.commReg('g'), '\n'],
		// 文章中的书名换行
		['(?=[^。！？…”：；〗】{$sf}])\n《'.commReg('g'), '《'],
		[/第[\d一二三四五六七八九十百千]+章：/g, '\n$&'],
		// 其他修正
		[config.endStrs, ''],
		[/“$/gm, '”'],
		[/^“”$/gm, '“……”']
	];

	return str
		// 排版初始化，去空格空行
		// 去除汉字间的空格
		.conv('Init,Space,NumberLetter')
		// 保护无结尾标点的歌词类
		.maskSafe(/(?:^[\u4E00-\u9FA5]+[^，：;。…！？:;\,\.\!\?]\n){3,16}/gm)
		// 修正章节最后是句号的
		.replace(/章[节節]$/g, '章')
		.replace('^({$t91}[{$c.2}]{$sn}.{$en})。$'.chapReg(), '$1')
		// 修正章节前面是 `正文` 的
		.replace('^正文 *({$t91}[{$crt}]{$sn}.{$en})$'.chapReg(), '$1')
		// 修正章节标题，加标题保护码
		.conv('Chapter', 'fix', 'safe')
		// 修正引号
		.conv('Quote')
		// 修正错误换行
		.replaces(_break)
		// 其他自定义修正
		.replaces(_other)
		// 去除汉字间的空格
		.conv('Init,Space,Punctuation,Separator')
		// 修正章节标题
		.conv('Chapter', 'nofix')
		// 修正引号
		.conv('Quote,End');
}
