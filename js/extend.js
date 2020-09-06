// 空格 \uF604
var Space = '\\f\\t\\v\x20\u1680\u180E\u2000-\u200d\u202F\u205F\u3000\u2028\u2029\uE4C6\uF604\uF8F5\uE004\uF04A\uFEFF\u202e\u202c';
var allSpace = Space + '\x0A\x0D\xA0';

// 判断是否存在，可以为空
var checkNull = function(obj) {
	return (obj === undefined) || (obj === null) || false
}

// 判断类型
var isString = function(val) {
	return typeof val === 'string'
}

var isArray = function(val) {
	return Object.prototype.toString.call(val) === "[object Array]"
}

var isFunction = function(val) {
	return typeof val === 'function'
}

var isObject = function(val) {
	var type = typeof val
	return val !== null && (type === 'object' || type === 'function')
}

// 对象批量赋值
Object.extend = function(a, b) {
	for (var i in b) a[i] = b[i]
	return a
}


// ***** 扩展字符处理 *****
Object.extend(String.prototype, {
	// 字符串正则，加正则保护
	regEscape: function() {
		var reRegExpChar = /[\\.*]/g
		return this
			.replace(reRegExpChar, '\\$&')
			.replace(/\u005c\u005c+/g, "\u005c\u005c") || ''
	},
	// 字符串，加正则保护
	escapeRegExp: function() {
		var reRegExpChar = /[\\^$.*+?()[\]{}|]/g
		var reHasRegExpChar = new RegExp(reRegExpChar.source)
		return (this && reHasRegExpChar.test(this))
			? this.replace(reRegExpChar, '\\$&')
			: (this || '')
	},
	// 安全转换正则
	getReg: function(m) {
		checkNull(m) && (m = 'gm')
		return new RegExp(this.replace(/\u005c\u005c+/g, "\\"), m)
	},
	// 修正所有换行为 UNIX 标准
	toUNIX: function() {
		return this.replace(/\r\n/g, '\n').replace(/\n\r/g, '\n').replace(/\r/g, '\n')
		//return this.replace(/[\r\n]{1,2}/g, '\n')
	},
	// 格式化所有空格样式为标准
	space: function() {
		return this.replace(new RegExp('[' + Space + ']+', 'g'), ' ').toUNIX()
	},
	// 删除字符首尾空格
	trimSide: function() {
		return this.replace(/^[ 　]+/gm, '').replace(/[ 　]+$/g, '')
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
				!isArray(v) && (v = [v, ''])
				isString(v[0]) && (v[0] = v[0].getReg())
				re = re.replace(v[0], v[1] || '')
			})
		} else if (isObject(arr)) {
			for (var item in arr)
				re = re.replaces(arr[item])
		}
		return re
	},
	// 字符串定位替换
	replaceAt: function(a, rev) {
		rev && (a = [a[1], a[0]])
		return this.replace(new RegExp('[' + a[0] + ']', 'g'), function(m) {
			return a[1].charAt(a[0].indexOf(m))
		})
	},
	// 正则去所有空格
	cleanSpace: function(reg, greg) {
		greg = greg || /\s/g
		return reg ? this.replace(reg, function(m) {
			return m.replace(greg, '')
		}) : this.replace(greg, '')
	},
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.length + (this.match(/[^\x00-\xff]/g) || "").length
	},
	// 重复连接字符串
	times: function(m) {
		return m < 1 ? '' : new Array(m + 1).join(this)
	},
	// 取正则查询匹配的次数
	findCount: function(reg) {
		isString(reg) && (reg = reg.getReg())
		var tmp = this.match(reg)
		return tmp !== null ? tmp.length : 0
	},
	// 简化搜索方式
	find: function(str) {
		return this.search(str) > -1;
	},
	// 整数补零
	zeroize: function(b) {
		if (this.search(/^\d+$/) < 0) {
			return this
		}

		if (b < 2) b = 2
		var n = ~~this
		if (n === 0) {
			return '0'.times(b)
		}
		var m = String(n).length
		if (b < m) {
			return n
		}

		n = '0'.times(b + m) + n
		return n.substring(n.length - b)
	},
	// 特殊方式替换字符串
	/*
	 * vals = {name:"loogn",age:22,sex:['man', 'woman']}
	 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(arrs)
	 */
	fmt: function(vals, r) {
		// 字符串时，直接替换任意标签
		if (isString(vals)) {
			return this.replace(/\{\$zz\}/g, vals)
		}
		if (!isObject(vals) && !isArray(vals)) {
			return this
		}
			
		// 数组连接符号
		r = r || ''
		// 特殊标记 /\{\$([a-z0-9\.]+)}/gi
		return this
			// 子项
			.replace(/\{\$([\w\-]+)\}/g, function(m, m1) {
				if (!checkNull(vals[m1])) {
					var val = vals[m1]
					return isArray(val) ? val.join(r) : val
				}
				return m
			})
			// 子项是数组{$name.t1.0}
			.replace(/\{\$([\w\-]+)\.([\d]{1,2}|[\w\.\-]{1,})\}/g, function(m, m1, m2) {
				if (!checkNull(vals[m1])) {
					var val = vals[m1]
					// 如果子项是数组轮循
					if (m2.indexOf('.') > -1) {
						return m.replace(('\{\$' + m1 + '\.').getReg(), '\{\$').fmt(val, r)
					}

					if (!checkNull(val[m2])) {
						val = val[m2]
						return isArray(val) ? val.join(r) : val
					}
				}
				return m
			})
	},
	// 替换并返回正则式
	fmtReg: function(args, f, r) {
		return this.fmt(args, r).getReg(f)
	},
	// 循环测试正则
	eachArrayRegTest: function(arr) {
		var l = arr.length
		while (l--) {
			if (this.search(arr[l]) > -1)
				return true
		}
		return false
	},
	// 循环测试正则
	eachRegTest: function(arr) {
		if (isArray(arr)) {
			return this.eachArrayRegTest(arr)
		}
		if (isObject(arr)) {
			for (var v in arr) {
				var tmp = arr[v]
				if (isArray(tmp) ? this.eachArrayRegTest(tmp) : this.search(tmp) > -1)
					return true
			}
		}
		return false
	},
	// 判断是否对象有效 Key
	hasIn: function(object) {
		return this in Object(object)
	}
});

// ***** 扩展数组处理 *****
Object.extend(Array.prototype, {
	each: function(func) {
		var l = this.length, i = -1, back
		while (++i < l) {
			back = func(this[i], i, this)
			if (back === '@next')
				continue;
			if (back === false)
				break;
		}
	},
	map: function(func) {
		var l = this.length, i = -1
		var arr = new Array(l)
		while (++i < l) {
			arr[i] = func(this[i], i, this)
		}
		return arr
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
