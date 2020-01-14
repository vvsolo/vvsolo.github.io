
var tmpRegs = [
	'[{$hwPun}{$fwPun}\w ]'.fmtReg(strCommon),
	'([{$han}{$fwPun}])([0-9a-z])'.fmtReg(strCommon, 'i'),
	'([0-9a-z])([{$han}{$fwPun}])'.fmtReg(strCommon, 'i')
]
// 截取分段
function doSplit(str, sm, bm) {
	if (str.trim().len() === 0)
		return str + bm
	if (/^　{2,}/gm.test(str) || str === '＊'.times(35))
		return str + bm

	var text = '',
		linestr = '　　' + str.trim()
	var cutNum = cutNum || configs.Linenum * 2
	
	// 小于每行最大字数时直接返回
	if (cutNum > linestr.len())
		return linestr + bm
	
	var oNum = Math.floor(linestr.len() / cutNum) + 1
	for (var j = 0; j < oNum; j++) {
		var tmp = linestr
			// 预分段
			.realSubstring(0, cutNum)
			// 判断并处理行尾限制字符
			.replace(/([「“《『‘（]){1,2}$/gm, function(m) {
				linestr += m
				return ''
			})
		linestr = linestr
			// 剩下部分
			.realSubstring(tmp.len())
			// 判断并处理行首限制字符
			// 处理两个字符，因为经过整理过的标点只留两个
			.replace(/^[，。：、；：？！．）》」』]{1,2}/gm, function(m) {
				tmp += m
				return ''
			})
			// 处理单个连续标点
			.replace(/^[…～－]$/gm, function(m) {
				tmp += m
				return ''
			})
		// 如果有英文并奇数位，英文前加空格补齐
		// 测试一下全英文状态防止出错
		var testTmp = tmp
			.replace(tmpRegs[0], '')
			.length > 0
		if ((tmp.len() < cutNum) && testTmp) {
			var rStr = (tmpRegs[1].test(tmp)) ? tmpRegs[1] : tmpRegs[2]
			tmp = tmp
				.replace(rStr, '$1 $2')
				.replace(/[“‘『「] .*[」』’”]/i, function(m) {
					return m
						.replace(/([“‘『「]) /g, '$1')
						.replace(/ (?=[」』’”])/g, '')
						 + ' '
				})
			if (tmp.len() < cutNum && testTmp) {
				tmp = tmp
					.replace(/ ?([0-9a-z]) ?/i, '$1')
					.replace(/ (?=[“‘『「])/g, '')
					.replace(/([」』’”]) /g, '$1')
			}
		}
		text += tmp + '\n'
	}
	return text + sm
}

// 排版
function doTidy(str) {
	// 结尾的文字，编辑user.js文件
	var eStrs = ('^([（【“「<]?)(' + configs.endStrs + ')([）】”」>]?)$').getReg('gm')

	// 执行整理
	var str = str
		// 排版初始化，去空格空行
		.replaceInit()
		// 引号替换
		.replaceAt(configs.cnQuotes)
		.replace(/作者：.*?\n[\d\/]*[发發]表[于於]：.*?\n是否首[发發]：.*?\n字[数數]：.*?\n/gm, '')
		// 转换半角
		.convertNumberLetter()
		// 英文首字大写
		//.convertEnglish()
		// 修正分隔符号
		.replaceSeparator()
		// 分隔符居中
		.replace(('^' + configs.Separator + '$').getReg('gm'), function(m) {
			return m.setAlign('', '', 'center')
		})
		// 结尾居中
		.replace(eStrs, function(m) {
			return m.setAlign('', '', 'center')
		})
		// 标题居中
		.replaceTitle('', '', 'center')

	var words = str.split('\n'),
		re = ''

	// 开始进行分隔
	for (var i = 0; i < words.length; i++)
		re += doSplit(words[i], '\n', '\n\n');

	re = re
		// 作者类居左
		.replace(configs.novelAuthor, function(m) {
			return m.trim()
		})
		.replace(/^[ 　]+$\n/gm, '')
		.replace(/\n\n{2,}/gm, '\n\n')
		// 文章标题居中
		.replace(configs.novelTitle, function(m) {
			return m.setAlign('', '\n', 'center')
		})
		.replaces(configs.rEnd)
		.replace(/\n\n{3,}/gm, '\n\n\n')

	if ( !$('#Check_AddTop').is(':checked') )
		return re
	// 插入标头
	var headStr = ($('#chinese').html() !== '简') ?
		'作者：{$w}\n{$d}发表于：{$b}\n是否首发：{$y}\n字数：{$n} 字\n' :
		'作者：{$w}\n{$d}發表於：{$b}\n是否首發：{$y}\n字數：{$n} 字\n';
	headStr = headStr.fmt({
		'w': $('#inputAuthor').val().trim() || '',
		'b': $('#inputSite').val().trim() || '',
		'y': $('#Check_0').is(':checked') ? '是' : '否',
		'd': new Date().fmt("yyyy/MM/dd"),
		'n': (re.length - re.findCount(allSpace)).fmt()
	})
	return headStr + '\n' + re
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
		str = str.replaceQuotes('fr')
	// 修正英文
	if ($('#Check_11').is(':checked'))
		str = str.convertEnglish()
	// 结束
	return str.replaceEnd()
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
