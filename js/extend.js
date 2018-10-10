
// 对象批量赋值
Object.extend = function(a, b) {
	for (var i in b)
		a[i] = b[i]
	return a
}

// 删除字符首尾空格
var Space = "\x09\x0B\x0C\x20\u1680\u180E\u2000\u2001\u2002\u2003" +
	"\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B\u202F\u205F\u3000\u2028" +
	"\u2029\uE4C6\uF8F5\uE004\uF04A\uFEFF"
var allSpace = Space + '\x0A\x0D\xA0'

// 安全转换正则
if (!String.prototype.regSafe) {
	String.prototype.regSafe = function() {
		return String(this).replace(/\\/, '\\\\').replace(/[\\]{2,}/, '\\\\')
	}
}
if (!String.prototype.getReg) {
	String.prototype.getReg = function(m) {
		return new RegExp(this.regSafe(), m || 'g')
	}
}

// 格式化所有空格样式为标准
// 修正所有换行为 UNIX 标准
if (!String.prototype.space) {
	String.prototype.space = function() {
		return String(this).replace(new RegExp("[" + Space + ']', 'g'), ' ').replace(/(\r\n|\n\r|\r)/g, '\n')
	}
}

// 删除字符首尾空格
if (!String.prototype.trim) {
	var ws = "[" + Space + "]+"
	String.prototype.trim = function() {
		return String(this).replace(new RegExp("^" + ws + "|" + ws + '$', 'gm'), '')
	}
}

// 去除所有空格后的长度
if (!String.prototype.checkEmpty) {
	String.prototype.checkEmpty = function() {
		return this.replace(allSpace, '').length === 0
	}
}

// 循环正则替换
if (!String.prototype.replaces) {
	String.prototype.replaces = function(arr) {
		var re = this;
		for (var i in arr)
			re = re.replace(arr[i][0], arr[i][1]);
		return re;
	}
}

// 取双字节与单字节混排时的真实字数
if (!String.prototype.len) {
	String.prototype.len = function() {
		return this.replace(/[^\x00-\xff]/g, '**').length
	}
}

// 按真实字数进行分隔
if (!String.prototype.realSubstring) {
	String.prototype.realSubstring = function(start, len) {
		var str = this || ''
		if (str.length === 0) return str
		start = start || 0
		len = len || str.len()
		var byteL = 0
		var sub = ''

		for (var i = c = cl = 0; i < str.length; i++) {
			c = str.charCodeAt(i)
			cl = c > 0xff ? 2 : 1
			byteL += cl
			//还不到开始位
			if (start >= byteL) continue

			if (
				(len == str.len()) //取完
				||
				((len -= cl) >= 0) //取本字时不超过
			) {
				sub += String.fromCharCode(c)
			} else { //取超了
				break
			}
		}
		return sub
	}
}

// 重复连接字符串
if (!String.prototype.times) {
	String.prototype.times = function(m) {
		return m < 1 ? '' : new Array(m + 1).join(this);
	}
}

// 取双字节与单字节混排时的真实字数
if (!String.prototype.realLength) {
	String.prototype.realLength = function() {
		return this.replace(/[^\x00-\xff]/g, '**').length;
	}
}

// 取正则查询匹配的次数
if (!String.prototype.findCount) {
	String.prototype.findCount = function(reg) {
		var count = 0;
		var re = this.replace(reg, function() {
			count++;
		})
		return count;
	}
}

// 格式化时间
if (!Date.prototype.fmt) {
	Date.prototype.fmt = function(d) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(d))
			d = d.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(d))
				d = d.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return d;
	}
}

// 特殊方式替换字符串
/*
 * arrs = {name:"loogn",age:22,sex:['man', 'woman']}
 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(arrs)
 *
 */
if (!String.prototype.fmt) {
	String.prototype.fmt = function(args, r) {
		if (typeof args === "string")
			return this.replace(/\{\$s\}/g, args);
		if (typeof args !== "object" && typeof args !== "array")
			return this;
		var re = this;
		r = r || ''
		// 特殊标记 /\{\$([a-z0-9\.]+)}/gi
		if (/\{\$([a-z0-9\.\-\_]+)}/gi.test(re)) {
			re = re
				// 子项是数组{$name.t1.0}
				.replace(/\{\$([\w\-]+)\.([\d]{1,2}|[\w\.\-]{1,})\}/g, function(m, m1, m2) {
					// 如果子项是数组轮循
					var tmp = m2.indexOf('.') === 0 ? args[m1][m2] : m.replace(new RegExp('\\{\\$' + m1 + '\\.', 'g'), '\{\$').fmt(args[m1], r)
					return (typeof tmp === "array") ? tmp.join(r) : tmp || m
				})
				// 子项
				.replace(/\{\$([\w\-]+)\}/g, function(m, m1) {
					var tmp = args[m1] !== null ? args[m1] : ''
					return (typeof tmp === "array") ? tmp.join(r) : tmp
				})
		}
		return re;
	}
}

// 格式化数字 12,553.00
if (!Number.prototype.fmt) {
	Number.prototype.fmt = function() {
		// 验证输入的字符是否为数字
		if (isNaN(this)) return this
		return this.toLocaleString().replace(/\.00$/, '')
	}
}