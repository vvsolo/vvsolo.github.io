// 空格
// \u0009\u000B\u000C = \t\v\f
// \u2000-\u200a\u205f\u2028\u2029\u3000\ufeff'
var Space = '\x09\x0b\x0c\x20\u3000\u1680\u180e\u2000-\u200f\u2028-\u202f\u205f-\u2064\ue004\ue07b\ue4c6\uf604\uf04a\uf8f5\ufeff';
var allSpace = Space + '\x0A\x0D\xA0';

// 判断是否存在，可以为空
var checkNull = function(obj) {
	return obj === undefined || obj === null || false;
}
// 判断类型
var isString = function(val) { return typeof val === 'string'; }
var isArray = function(val) { return Object.prototype.toString.call(val) === "[object Array]"; }
var isRegExp = function(val) { return val instanceof RegExp; }
var isFunction = function(val) { return typeof val === 'function'; }
var isObject = function(val) {
	var type = typeof val;
	return val !== null && (type === 'object' || type === 'function');
}
// 对象批量赋值
var extend = function(a, b) {
	for (var i in b) a[i] = b[i];
	return a;
}

// ***** 扩展字符处理 *****
extend(String.prototype, {
	// 字符串正则，加正则保护
	regEscape: function() {
		var reRegExpChar = /[\\.*]/g;
		return this
			.replace(reRegExpChar, '\\$&')
			.replace(/\u005c\u005c+/g, "\u005c\u005c") || '';
	},
	// 字符串，加正则保护
	escapeRegExp: function() {
		var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
		//var reRegExpChar = /([\\\/\'*+?|()\[\]{}.^$-])/g;
		var reHasRegExpChar = new RegExp(reRegExpChar.source);
		return (this && reHasRegExpChar.test(this))
			? this.replace(reRegExpChar, '\\$&')
			: (this || '');
	},
	// 安全转换正则
	getReg: function(m) {
		return new RegExp(this.replace(/\u005c\u005c+/g, "\u005c\u005c"), checkNull(m) ? 'gm' : m);
	},
	// 修正所有换行为 UNIX 标准
	toUNIX: function() {
		return this.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		//return this.replace(/[\r\n]{1,2}/g, '\n')
	},
	// 格式化所有空格样式为标准
	space: function() {
		return this.replace(new RegExp('[' + Space + ']+', 'g'), ' ').toUNIX();
	},
	// 删除字符首尾空格
	trimSide: function() {
		return this.replace(/^[ 　]+/gm, '').replace(/[ 　]+$/g, '');
	},
	// 删除字符首尾空格
	trim: function() {
		return this.space().trimSide();
	},
	// 删除字符首尾空格、换行
	trims: function() {
		return this.replace(/^\s*/gm, '').replace(/\s*$/g, '');
	},
	// 循环正则替换，可处理对象
	replaces: function(arr) {
		var re = this;
		if (isArray(arr)) {
			arr.each(function(v) {
				!isArray(v) && (v = [v, '']);
				isString(v[0]) && (v[0] = v[0].getReg());
				re = re.replace(v[0], v[1] || '');
			})
		} else if (isObject(arr)) {
			for (var item in arr)
				re = re.replaces(arr[item]);
		}
		return re;
	},
	// 字符串定位替换
	replaceAt: function(a, rev) {
		rev && (a = [a[1], a[0]]);
		return this.replace(new RegExp('[' + a[0] + ']', 'g'), function(m) {
			return a[1].charAt(a[0].indexOf(m));
		});
	},
	// 正则去所有空格
	cleanSpace: function(reg, greg) {
		greg = greg || /\s/g;
		return reg ? this.replace(reg, function(m) {
			return m.replace(greg, '')
		}) : this.replace(greg, '');
	},
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.length + (this.match(/[^\x00-\xff]/g) || "").length;
	},
	// 重复连接字符串
	times: function(m) {
		m = ~~m;
		return m < 1 ? '' : m < 2 ? this : new Array(m + 1).join(this);
	},
	// 取正则查询匹配的次数
	findCount: function(reg) {
		return (this.match(isString(reg) ? reg.getReg() : reg) || '').length;
	},
	// 简化搜索方式
	find: function(str) {
		return this.search(str) > -1;
	},
	// 特殊方式替换字符串
	/*
	 * vals = {name:"loogn",age:22,sex:['man', 'woman']}
	 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(arrs)
	 */
	fmt: function(vals, r) {
		// 字符串时，直接替换任意标签
		if (isString(vals)) {
			return this.replace(/\{\$zz\}/g, vals);
		}
		if (!isObject(vals) && !isArray(vals)) {
			return this;
		}
			
		// 数组连接符号
		r = r || '';
		// 特殊标记 /\{\$([a-z0-9\.]+)}/gi
		return this
			// 子项
			.replace(/\{\$([\w\-]+)\}/g, function(m, m1) {
				if (checkNull(vals[m1])) return m;
				var val = vals[m1];
				return isArray(val) ? val.join(r) : val;
			})
			// 子项是数组{$name.t1.0}
			.replace(/\{\$([\w\-]+)\.([\d]{1,2}|[\w\.\-]{1,})\}/g, function(m, m1, m2) {
				if (!checkNull(vals[m1])) {
					var val = vals[m1];
					// 如果子项是数组轮循
					if (m2.indexOf('.') > -1)
						return m.replace(('\{\$' + m1 + '\.').getReg(), '\{\$').fmt(val, r);

					if (!checkNull(val[m2])) {
						val = val[m2];
						return isArray(val) ? val.join(r) : val;
					}
				}
				return m;
			})
	},
	// 替换并返回正则式
	fmtReg: function(args, f, r) {
		return this.fmt(args, r).getReg(f);
	},
	// 循环测试正则
	eachArrayRegTest: function(arr) {
		var l = arr.length;
		while (l--)
			if (this.find(arr[l])) return true;

		return false;
	},
	// 循环测试正则
	eachRegTest: function(arr) {
		if (isArray(arr)) return this.eachArrayRegTest(arr);

		if (isObject(arr)) {
			for (var v in arr) {
				var tmp = arr[v];
				if (isArray(tmp) ? this.eachArrayRegTest(tmp) : this.find(tmp))
					return true;
			}
		}
		return false;
	}
});

// ***** 扩展数组处理 *****
extend(Array.prototype, {
	each: function(func) {
		var l = this.length, i = -1;
		while (++i < l) {
			if (func(this[i], i, this) === false)
				break;
		}
	}
});

// ***** 扩展时间处理 *****
if(!Date.prototype.fmt) {
	// 格式化时间
	Date.prototype.fmt = function(d) {
		var c = this;
		var o = {
			"y+": c.getFullYear(), //年
			"M+": c.getMonth() + 1, //月份 
			"d+": c.getDate(), //日 
			"h+": c.getHours(), //小时 
			"m+": c.getMinutes(), //分 
			"s+": c.getSeconds(), //秒 
			"q+": Math.floor((c.getMonth() + 3) / 3), //季度 
			"S": c.getMilliseconds() //毫秒 
		};
		for (var k in o) {
			var tmp = '00' + o[k];
			d = d.replace(new RegExp(k), function(m) {
				if (m.length < 2) return o[k];
				return tmp.substr(tmp.length - m.length);
			});
		}
		return d;
	}
}

// 格式化数字 12,553.00
if (!Number.prototype.fmt) {
	Number.prototype.fmt = function() {
		return isNaN(this)? this : this.toLocaleString().replace(/\.00$/, '');
	}
}
