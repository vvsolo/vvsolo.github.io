
/***** 空格 *****/
// \u0009\u000B\u000C = \t\v\f
// \u2000-\u200a\u205f\u2028\u2029\u3000\ufeff'
// DEL \x7f
// \x09\x0B\x0C\x20\x7f
// 21.12.27 删除所有控制字符，除 换行、回车和空格
// 22.10.05 新增 \u00a0
var
TYPO_SPACE = '\\x00-\\x09\\x0B\\x0C\\x0E-\\x20\\xA0\\x7f\\u3000\\u1680\\u180e\\u2000-\\u200f\\u2028-\\u202f\\u205f-\\u2064\\ue004\\ue07b\\ue11a\\ue4c6\\uf604\\uf04a\\uf8f5\\ufe0f\\ufeff',
TYPO_SPACE_REGEXP = RegExp('[' + TYPO_SPACE + ']+', 'g'),
TYPO_ALLSPACE_REGEXP = RegExp('[' + TYPO_SPACE + '\\x0A\\x0D\\xA0' + ']', 'g');

/***** 扩展 String *****/
Object.assign(String.prototype, {
	// 修正所有换行为 UNIX 标准
	toUNIX: function() {
		return this.replace(/\r\n?/g, '\n')
	},
	// 格式化所有空格样式为标准
	space: function() {
		return this.replace(TYPO_SPACE_REGEXP, ' ').toUNIX();
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
	// 安全转换正则
	getReg: function(f) {
		return RegExp(this.replace(/\x5C\x5C+/g, "\x5C\x5C"), (f === '') ? '' : (f || 'gm'));
	},
	// 安全转换正则
	getSafeReg: function(f) {
		// [\\\*\+\?\|\{\}\(\)\^\$\.\#\[\]]
		return this.replace(/[\\\*\+\?\|\{\}\(\)\^\$\.\#\[\]]/g, "\x5C\x5C$&").getReg(f);
	},
	// 循环正则替换，可处理对象
	replaces: function(arr) {
		var re = this + '';
		if (Array.isArray(arr)) {
			if (arr.length < 1) return re;
			arr.forEach(function(v) {
				// 如果传入是正则表达式
				!Array.isArray(v) && (v = [v, ''])
				// 如果 0 维是字符串，则转正则表达式
				typeof v[0] === 'string' && (v[0] = v[0].getReg())
				re = re.replace(v[0], v[1] || '')
			})
			return re;
		}
		for (var item in arr) {
			re = re.replaces(arr[item])
		}
		return re;
	},
	// 循环数组进行替换
	replaceArr: function(arr, callback) {
		var re = this + '';
		arr.forEach(function(v) {
			re = re.replace(v, callback)
		})
		return re;
	},
	// 字符串定位替换
	replaceAt: function(arr, rev) {
		if (rev) arr = arr.reverse();
		var nl = arr[1].split('');
		return this.replace(RegExp('[' + arr[0] + ']', 'g'), function(m) {
			return nl[arr[0].indexOf(m)] || m;
		});
	},
	// 正则去所有空格
	cleanSpace: function(find, greg) {
		greg = greg || /\s/g;
		return find ? this.replace(find, function(m) {
			return m.replace(greg, '');
		}) : this.replace(greg, '');
	},
	// 取正则查询匹配的次数
	findCount: function(reg) {
		return (this.match(reg) || '').length;
	},
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.length + this.findCount(/[^\x00-\xFF]/g);
	},
	// 简化搜索方式
	find: function(str) {
		return (typeof str === 'string' ? this.indexOf(str) : this.search(str)) > -1;
	},
	// 特殊方式替换字符串
	/*
	 * vals = {name:"loogn",age:22,sex:['man', 'woman']}
	 * var result0 = "我是{$name}，{$sex.0}，今年{$age}了".fmt(vals)
	 */
	fmt: function(vals, r) {
		// 字符串时，直接替换任意标签
		var vType = typeof vals, val;
		if (vType === 'string' || vType === 'number') {
			return this.replace(/\{\$zz\}/g, vals);
		}
		if (vType !== 'object') {
			return this;
		}

		return this.replace(/\{\$[\w\-\.]+\}/g, function(m) {
			// 分析逐级尝试获取数据
			val = vals;
			m.slice(2, -1).split('.').forEach(function(v) {
				try { val = val[v] }
				catch(e) { return false }
			})
			return typeof val === "undefined" ? m :
				Array.isArray(val) ? val.join(r || '') : val;
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
