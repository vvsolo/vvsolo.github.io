// 找到最快响应的网站
async function getFastest(domains, timeout = 5000) {
	// 创建带超时的fetch请求
	const requests = domains.map((u) => {
		const url = u.url
		return new Promise((resolve) => {
			//const start = performance.now();
			const timer = setTimeout(() => resolve(u), timeout);

			fetch(url, { method: 'HEAD' })
				.then(() => {
					clearTimeout(timer);
					resolve(u);
				})
				.catch(() => resolve(u));
		});
	});

	// 获取最快响应
	return Promise.race(requests).then((res) => {
		return {
			type: res.type,
			prefix: res.prefix,
			exp: Date.now()
		};
	});
}

// 加载资源
function loadResource(url, sync = "async") {
	const _type = url.endsWith(".css") ? "link" : "script";
	const el = document.createElement(_type);

	if (_type === 'script') {
		el.src = url;
		if (sync === 'async') {
			el.async = true;
		} else if (sync === 'defer') {
			el.defer = true;
		}
		[...document.querySelectorAll('script')].at(-1).after(el);
	} else if (_type === 'link') {
		el.rel = 'stylesheet';
		el.href = url;
		document.head.appendChild(el);
	}
	if (url.startsWith("http")) {
		console.log(url);
	}
}

// 存取最快 CDN
async function getFastestCDN(cdns, res) {
	// 过期时间，每3小时
	const expTime = 2*60*60*1000;
	
	const key = "fastestCDNDomain";
	let cdn = localStorage.getItem(key);
	if (cdn !== null) {
		cdn = JSON.parse(cdn);
		// 是否过期
		if (cdn.exp && Date.now() - parseInt(cdn.exp) > expTime) {
			cdn = null;
		}
	}
	if (cdn === null) {
		// 寻找用于测试的文件地址
		const t = res.find((u) => u?.test);
		// 拼接用于测试的文件地址
		const testUrls = cdns.map((u) => {
			if (typeof t.file === "string") {
				return null;
			}
			u.url = u.prefix.replace(':file', t.file[u.type].replace(':version', t.version));
			return u;
		})
		//console.log(testUrls);
		cdn = await getFastest(testUrls);
		localStorage.setItem(key, JSON.stringify(cdn));
	}
	return cdn || null;
}

// 测试最快响应
async function loadAllResources(cdns, res, locals) {
	const cdn = await getFastestCDN(cdns, res);
	if (cdn === null) {
		console.log(`error: no load fastest CDN!`);
		return;
	}
	// 加载 CDN 资源
	res.map((url) => {
		const file = typeof url.file === "string" ?
			url.file :
			cdn.prefix.replace(':file', url.file[cdn.type].replace(':version', url.version));

		loadResource(file, "");
	})
	// 延迟加载本地资源
	setTimeout(() => {
		locals.map((file) => {
			loadResource(file, "");
		})
		document.getElementById("mask").remove();
	}, 3000);
}

const cdnList = [
	{
		type: 'npm',
		prefix: 'https://cdn.jsdelivr.net/npm/:file'
	},
	{
		type: 'ajax',
		prefix: 'https://cdnjs.cloudflare.com/ajax/libs/:file'
	},
	{
		type: 'unpkg',
		prefix: 'https://unpkg.com/:file'
	},
	{
		type: 'ajax',
		prefix: 'https://cdnjs.onmicrosoft.cn/ajax/libs/:file'
	},
	{
		type: 'ajax',
		prefix: 'https://s4.zstatic.net/ajax/libs/:file'
	},
	{
		type: 'ajax',
		prefix: 'https://use.sevencdn.com/ajax/libs/:file'
	}
];

const resList = [
	{
		version: '3.7.1',
		file: {
			npm: 'jquery@:version/dist/jquery.min.js',
			ajax: 'jquery/:version/jquery.min.js',
			unpkg: 'jquery@:version/dist/jquery.min.js'
		},
		// 测试该项
		test: true
	},
	{
		version: '5.3.8',
		file: {
			npm: 'bootstrap@:version/dist/css/bootstrap.min.css',
			ajax: 'twitter-bootstrap/:version/css/bootstrap.min.css',
			unpkg: 'bootstrap@:version/dist/css/bootstrap.min.css'
		}
	},
	{
		file: 'css/style.css'
	},
	{
		version: '2.0.11',
		file: {
			npm: 'clipboard@:version/dist/clipboard.min.js',
			ajax: 'clipboard.js/:version/clipboard.min.js',
			unpkg: 'clipboard@:version/dist/clipboard.min.js'
		}
	},
	{
		version: '1.36.3',
		file: {
			npm: 'ace-builds@:version/src-min/ace.min.js',
			ajax: 'ace/:version/ace.min.js',
			unpkg: 'ace-builds@:version/src-min/ace.js'
		}
	}
];

// 本地资源
const localResources = [
	'ace/theme-novel.js',
	'ace/mode-novel.js',
	'ace/ext-statusbar.js',
	'js/cores.min.js',
	'js/typeset.js',
	'js/jquery.s2t.js',
	'js/app.js'
]

document.addEventListener('DOMContentLoaded', loadAllResources(cdnList, resList, localResources));
