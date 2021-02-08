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
var __os = Object.prototype.toString;
var isString = function(v) { return typeof v === 'string'; }
var isFunction = function(v) { return typeof v === 'function'; }
//var isRegExp = function(v) { return v instanceof RegExp; }
var isArray = function(v) { return __os.call(v) === "[object Array]"; }
var isObject = function(v) {
	return v !== null && __os.call(v) === "[object Object]";
}

// 对象批量赋值
Object.extend = function(d, s) {
	for (var i in s) d[i] = s[i];
	return d;
}

// ***** 扩展字符处理 *****
Object.extend(String.prototype, {
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
		} else {
			for (var item in arr) {
				re = re.replaces(arr[item]);
			}
		}
		return re;
	},
	// 字符串定位替换
	replaceAt: function(a, rev) {
		rev && (a = a.reverse());
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
	// 取正则查询匹配的次数
	findCount: function(reg) {
		return (this.match(isString(reg) ? new RegExp(reg, 'g') : reg) || '').length;
	},
	// 简化搜索方式
	find: function(str) {
		return this.search(str) > -1;
	},
	// 特殊方式替换字符串
	/*
	 * vals = {name:"loogn",age:22,sex:['man', 'woman']}
	 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(vals)
	 */
	fmt: function(vals, r) {
		// 字符串时，直接替换任意标签
		if (typeof vals === 'string') {
			return this.replace(/\{\$zz\}/g, vals);
		}
		if (typeof vals !== 'object') {
			return this;
		}
		var val;
		// {$name.t1.0}
		return this.replace(/\{\$[\w\-]+(?:\.[\w\-]+)*\}/g, function(m) {
			val = vals;
			m.slice(2, -1).split('.').each(function(v) {
				return (val = val[v]) || false;
			});
			return (val === undefined || isObject(val)) ? m :
				isArray(val) ? val.join(r || '') : val;
		});
	},
	// 替换并返回正则式
	fmtReg: function(args, f, r) {
		return this.fmt(args, r).getReg(f);
	},
	// 循环测试正则
	eachArrayRegTest: function(arr) {
		var l = arr.length, i = -1;
		while (++i < l) {
			if (this.search(arr[i]) > -1) return true;
		}
		return false;
	}
});

// ***** 扩展数组处理 *****
Object.extend(Array.prototype, {
	each: function(callback /*, thisArg*/) {
		if (typeof callback !== 'function') return;
		var t, l = this.length, i = -1;
		if (arguments.length > 1) t = arguments[1];
		while (++i < l) {
			if (callback.call(t, this[i], i, this) === false)
				break;
		}
	}
});
