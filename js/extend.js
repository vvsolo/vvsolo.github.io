// 空格 \uF604
var Space = "\\f\\t\\v\\x20\\u1680\\u180E\\u2000-\\u200B\\u202F\\u205F\\u3000\\u2028\\u2029\\uE4C6\\uF604\\uF8F5\\uE004\\uF04A\\uFEFF\\u202e\\u202c"
var allSpace = Space + '\\x0A\\x0D\\xA0'
//var regEscape = /([\\`\*_\{\}\[\]\(\)\>\#\+\-\.\!])/g
// *.?+$^[](){}|\/
var regEscapes = /([.?*+^$[\]\\(){}|-])/g

// 判断是否存在，可以为空
var checkNull = function(obj) {
	if (typeof obj === "undefined") return true
	if (obj === null) return true
	return false
}

// 判断类型
function isType(type) {
	return function(obj) {
		return Object.prototype.toString.call(obj) === "[object " + type + "]";
	}
}

var isArray = isType("Array"),
	isString = isType("String"),
	isObject = isType("Object"),
	isFunction = isType("Function")

// 对象批量赋值
Object.extend = function(a, b) {
	for (var i in b) a[i] = b[i]
	return a
}


// ***** 扩展字符处理 *****
Object.extend(String.prototype, {
	// 处理为正则字符串
	regEscape: function() {
		return this.replace(regEscapes, "\\$1").replace(/\u005c\u005c+/g, "\\")
	},
	// 安全转换正则
	getReg: function(m) {
		checkNull(m) && (m = 'g')
		return new RegExp(this.replace(/\u005c\u005c+/g, "\\"), m)
	},
	// 修正所有换行为 UNIX 标准
	toUNIX: function() {
		return this.replace(/\r\n|\n\r|\r/g, '\n')
	},
	// 格式化所有空格样式为标准
	space: function() {
		return this.replace(new RegExp('[' + Space + ']+', 'g'), ' ').toUNIX()
	},
	// 删除字符首尾空格
	trimSide: function() {
		return this.replace(/^[ 　]+/gm, '').replace(/[ 　]+$/gm, '')
	},
	// 删除字符首尾空格
	trim: function() {
		return this.space().trimSide()
	},
	// 删除字符首尾空格、换行
	trims: function() {
		return this.trimSide().replace(/\n/g, '')
	},
	// 循环正则替换，可处理对象
	replaces: function(arr) {
		var re = this
		if (isArray(arr)) {
			arr.each(function(v) {
				if (isArray(v)) {
					isString(v[0]) && (v[0] = v[0].getReg())
					re = re.replace(v[0], v[1] || '')
				} else {
					isString(v) && (v = v.getReg())
					re = re.replace(v, '')
				}
			})
		} else if (isObject(arr)) {
			for (var item in arr)
				re = re.replaces(arr[item])
		}
		return re
	},
	// 字符串定位替换
	replaceAt: function(a, rev) {
		if (rev) a = [a[1], a[0]]
		return this.replace(new RegExp('[' + a[0] + ']', 'g'), function(m) {
			return a[1].charAt(a[0].indexOf(m))
		})
	},
	// 正则去所有空格
	cleanSpace: function(reg) {
		return reg ? this.replace(reg, function(m) {
			return m.replace(/\s/g, '')
		}) : this.replace(/\s/g, '')
	},
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.replace(/[^\x00-\xff]/g, '**').length
	},
	// 按真实字数进行分隔
	realSubstr: function(start, len) {
		var str = this || ''
		if (str.length === 0) return str
		start = start || 0
		len = len || str.len()
		var byteL = 0, sub = '',
			i = c = cl = 0, l = str.length
		for (; i < l; i++) {
			c = str.charCodeAt(i)
			cl = c > 0xff ? 2 : 1
			byteL += cl
			// 还不到开始位
			if (start >= byteL) continue
			 // 取完 取本字时不超过
			if (len == str.len() || (len -= cl) >= 0)
				sub += String.fromCharCode(c)
			else
				break;
		}
		return sub
	},
	// 重复连接字符串
	times: function(m) {
		return m < 1 ? '' : new Array(m + 1).join(this);
	},
	// 取正则查询匹配的次数
	findCount: function(reg) {
		isString(reg) && (reg = reg.getReg())
		var re = this.match(reg)
		return (re !== null) ? parseInt(re.length) : 0;
	},
	// 正则字母全大写
	matchUpper: function(reg) {
		return this.replace(reg, function(m) {
			return m.toUpperCase()
		})
	},
	// 正则首字母大写
	matchFirstUpper: function(reg) {
		return this.matchUpper(/\b[a-z]/g)
	},
	// 正则字母小写
	matchLower: function(reg) {
		return this.replace(reg, function(m) {
			return m.toLowerCase()
		})
	},
	// 整数补零
	zeroize: function(b) {
		var n = this.replace(/^0+/g, '')
		if (b < 2) b = 2
		if (!/^[0-9]+$/.test(n) || b < n.length)
			return n

		n = '0'.times(b * 2) + n
		return n.substring(n.length - b)
	},
	// 特殊方式替换字符串
	/*
	 * arrs = {name:"loogn",age:22,sex:['man', 'woman']}
	 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(arrs)
	 */
	fmt: function(args, r) {
		// 字符串时，直接替换任意标签
		if (isString(args))
			return this.replace(/\{\$zz\}/g, args)
		if (!isObject(args) && !isArray(args))
			return this
		var val
		// 数组连接符号
		r = r || ''
		// 特殊标记 /\{\$([a-z0-9\.]+)}/gi
		return this
			// 子项是数组{$name.t1.0}
			.replace(/\{\$([\w\-]+)\.([\d]{1,2}|[\w\.\-]{1,})\}/g, function(m, m1, m2) {
				if (!checkNull(args[m1])) {
					val = args[m1]
					// 如果子项是数组轮循
					if (/\./g.test(m2))
						return m.replace(('\{\$' + m1 + '\.').getReg(), '\{\$').fmt(val, r)

					if (!checkNull(val[m2])) {
						val = val[m2]
						return isArray(val) ? val.join(r) : val
					}
				}
				return m
			})
			// 子项
			.replace(/\{\$([\w\-]+)\}/g, function(m, m1) {
				if (!checkNull(args[m1])) {
					val = args[m1]
					return isArray(val) ? val.join(r) : val
				}
				return m
			})
	},
	// 替换并返回正则式
	fmtReg: function(args, f, r) {
		return this.fmt(args, r).getReg(f)
	},
	// 循环测试正则
	eachRegTest: function(arr) {
		var isTrue = false, str = this
		if (isArray(arr)) {
			var l = arr.length, i = 0, v
			for (; i < l; i++) {
				v = arr[i]
				isTrue = isArray(v) ? str.eachRegTest(v) : v.test(str)
				if (isTrue)
					break;
			}
		} else if (isObject(arr)) {
			var tmp, v
			for (v in arr) {
				tmp = arr[v]
				isTrue = isArray(tmp) ? str.eachRegTest(tmp) : tmp.test(str)
				if (isTrue)
					return isTrue
			}
		}
		return isTrue
	}
});

// ***** 扩展数组处理 *****
Object.extend(Array.prototype, {
	each: function(callback) {
		var l = this.length, i = 0
		for (; i < l; i++) {
			if (isFunction(callback) && callback.call(this[i], this[i], i) === false)
				break;
		}
	},
	map: function(callback) {
		var res = [], tmp
		this.each(function(v, i) {
			tmp = callback.call(v, v, i)
			if (tmp != null)
				res.push(tmp)
		})
		return res
	}
});

// ***** 扩展时间处理 *****
if(!Date.prototype.fmt) {
	// 格式化时间
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

// 格式化数字 12,553.00
if (!Number.prototype.fmt) {
	Number.prototype.fmt = function() {
		// 验证输入的字符是否为数字
		if (isNaN(this)) return this
		return this.toLocaleString().replace(/\.00$/, '')
	}
}
