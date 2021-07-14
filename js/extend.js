// 空格
// \u0009\u000B\u000C = \t\v\f
// \u2000-\u200a\u205f\u2028\u2029\u3000\ufeff'
var Space = '\x09\x0B\x0C\x20\u3000\u1680\u180e\u2000-\u200f\u2028-\u202f\u205f-\u2064\ue004\ue07b\ue4c6\uf604\uf04a\uf8f5\ufeff';
var allSpace = Space + '\x0A\x0D\xA0';

// 类型判断
// ES3 将 Array 类型视为 Object;
var __os = Object.prototype.toString;
var isObject = function(v) {
	return v !== null && __os.call(v) === "[object Object]";
}

// ***** 扩展字符处理 *****
Object.assign(String.prototype, {
	// 安全转换正则
	getReg: function(f) {
		return RegExp(this.replace(/\x5C\x5C+/g, "\x5C\x5C"), (f === '') ? '' : (f || 'gm'));
	},
	// 修正所有换行为 UNIX 标准
	toUNIX: function() {
		return this.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	},
	// 格式化所有空格样式为标准
	space: function() {
		return this.replace(RegExp('[' + Space + ']+', 'g'), ' ').toUNIX();
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
		if (Array.isArray(arr)) {
			arr.forEach(function(v) {
				// 如果传入是正则表达式
				if (!Array.isArray(v)) {
					v = [v, ''];
				}
				// 如果 0 维是字符串，则转正则表达式
				if (typeof v[0] === 'string') {
					v[0] = v[0].getReg();
				}
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
	replaceAt: function(arr, rev) {
		if (rev) {
			arr = arr.reverse();
		}
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
	// 取双字节与单字节混排时的真实字数
	len: function() {
		return this.length + (this.match(/[^\x00-\xFF]/g) || "").length;
	},
	// 取正则查询匹配的次数
	findCount: function(reg) {
		return (this.match(reg) || '').length;
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
		if (typeof vals === 'string' || typeof vals === 'number') {
			return this.replace(/\{\$zz\}/g, vals);
		}
		if (typeof vals !== 'object') {
			return this;
		}
		var val, tmp;
		return this.replace(/\{\$[\w\-\.]+\}/g, function(m) {
			// 防止 1 级就输入 {$b.c} 的情况，先行判断
			tmp = m.slice(2, -1);
			if (tmp in vals) {
				val = vals[tmp];
				return Array.isArray(val) ? val.join(r || '') : val;
			}
			// 分析逐级尝试获取数据
			val = vals;
			tmp.split('.').forEach(function(v) {
				if (v in val) {
					val = val[v];
				} else {
					return null;
				}
			});
			return isObject(val) ? m :
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
			if (this.find(arr[i])) return true;
		}
		return false;
	}
});
