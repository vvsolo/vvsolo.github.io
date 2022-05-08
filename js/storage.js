(function (window) {
	'use strict';

	window.storage = (function () {
		return {
			val: null,
			set: function (key, value) {
				if (value !== null && value !== '') {
					window.localStorage[key] = window.JSON.stringify(value);
				}
				return value;
			},
			get: function (key, def) {
				return this.has(key)
					? this.val
					: def !== undefined
					? this.set(key, def)
					: '';
			},
			has: function (key) {
				try {
					this.val = window.JSON.parse(window.localStorage[key]);
					return true;
				} catch (e) {
					return false;
				}
			},
			remove: function (key) {
				window.localStorage.removeItem(key);
			},
			clean: function () {
				localStorage.clear();
			},
		};
	})();
})(window);
