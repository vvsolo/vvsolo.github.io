const $$ = {
	lang: $("#chinese"),
	editor: $("#TextareaEditor"),
	msg: $("#AlertMsg"),
	msgDiv: $("#AlertMsg").parent(),
	title: $("#TitleMsg"),
	links: $("#cdn-links"),
	bookname: $("#inputBookName"),
	chapter: $("#inputChapter"),
};

const store = {
	set: function (key, value) {
		if (value !== null && value !== "") {
			localStorage.setItem(key, JSON.stringify(value));
		}
		return value;
	},
	get: function (key, def) {
		const val = localStorage.getItem(key);
		return val !== null ? JSON.parse(val) : (def && localStorage.setItem(key, JSON.stringify(def))) || "";
	},
	remove: function (key) {
		localStorage.removeItem(key);
	},
	clean: function () {
		localStorage.clear();
	},
};

// message
const showMessage = (r) => {
	const tip = $(r).attr("data-tip");
	$$.msg.html(tip);
	$$.msgDiv.hide().show().delay(5000).fadeOut(400);
};
$$.msgDiv.delay(8000).fadeOut(400);

// title
$(() => {
	const setTitle = () => {
		const tmpReg = /^[（【“「<]|[）】”」>]$/g;
		const _name = $$.bookname.val().trim();
		const _chap = $$.chapter.val().trim();

		let str = "";
		if (_name.length > 0) str += `【${_name.replace(tmpReg, "")}】`;
		if (_chap.length > 0) str += `（${_chap.replace(tmpReg, "")}）`;
		$$.title.html(str || $$.title.attr("data-tip"));
	};
	$$.bookname.on("keyup keydown change focus input propertychange", setTitle);
	$$.chapter.on("keyup keydown change focus input propertychange", setTitle);
	setTitle();
});

// options
(() => {
	const inputVal = (() => {
		const inputs = ["inputBookName", "inputAuthor", "inputSite"];
		const max = 5;
		return {
			get: () => {
				inputs.forEach((v) => {
					$(`#${v}`).val(store.get(v, ""));
				});
				let i = -1;
				while (++i < max) {
					if (store.get(`Check_${i}`, "") === "checked") {
						$(`#Check_${i}`).attr("checked", "checked");
					}
				}
			},
			set: () => {
				inputs.forEach((v) => {
					const tmp = $(`#${v}`).val();
					tmp !== "" ? store.set(v, tmp) : store.remove(v);
				});
				let i = -1;
				while (++i < max) {
					const tmp = `Check_${i}`;
					$(`#${tmp}`).is(":checked") ? store.set(tmp, "checked") : store.remove(tmp);
				}
			}
		}

	})();
	// 读取默认值
	inputVal.get();
	// 保存设置
	$("#SaveConfig").on("click", function () {
		inputVal.set();
		showMessage(this);
	});
	// 清空设置
	$("#CleanConfig").on("click", function () {
		store.clean();
		showMessage(this);
	});
})();

// body language
(() => {
	const storeLang = store.get("language");
	const currentLang = storeLang ? storeLang : ($$.lang.html() === "简" ? "繁" : "简");
	if (currentLang === "繁") {
		$("body, title").s2t();
		$$.lang.html("简");
	}
	// 简繁互换
	$$.lang.on("click", function () {
		const tipVal = $$.lang.data("default").split("|");
		if (tipVal[0] === $$.lang.html()) {
			$("body, title").t2s();
			$$.lang.html(tipVal[1]);
			store.set("language", tipVal[0]);
		} else {
			$("body, title").s2t();
			$$.lang.html(tipVal[0]);
			store.set("language", tipVal[1]);
		}
	});
})();

// editor height
/**
(() => {
	// 编辑区域全屏占，修正编辑器高度
	function getEditorHeight() {
		const th = $("#editor-title").eq(0).outerHeight();
		$$.editor.height(parseInt($(this).outerHeight() - th));
	}
	getEditorHeight();
	$(window).resize(getEditorHeight);
})();
 */

// cdn links
(() => {
	const $pathname = location.pathname;
	$$.links.find("a").each(function(i) {
		const $this = $(this);
		const $span = $this.find("span");
		let $url = $this.attr("href");
		if ($pathname === $url || $pathname.endsWith("index.html") || $pathname.endsWith($url)) {
			$span.removeClass("text-bg-primary").addClass("text-bg-success");
			$span.unwrap();
		} else {
			$span.removeClass("text-bg-success").addClass("text-bg-primary");
		}
	})
})();

// editor init
$(function () {
	// 初始化编辑器
	const editor = ace.edit("TextareaEditor");
	editor.setOptions({
		theme: "ace/theme/novel",
		mode: "ace/mode/novel",
		// 折行
		wrap: "free",
		indentedSoftWrap: false,
		//autoScrollEditorIntoView: true,
		// 字体
		//fontFamily: 'Consolas,Monaco,Source Han Serif,NSimSun,SimSun,Courier New,monospace,serif',
		fontFamily: "Consolas,Monaco,Courier New,monospace,serif",
		fontSize: "1.1rem",
		// 打印线
		printMarginColumn: 70,
		// 显示空格
		showInvisibles: true,
		// 显示滚动条
		//vScrollBarAlwaysVisible: true,
		// 空字符是否可复制
		copyWithEmptySelection: true,
		// 行号固定宽度
		fixedWidthGutter: true,
	});
	// 状态栏
	const StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	const statusBar = new StatusBar(editor, document.getElementById("statusBar"));
	const sEditor = editor.getSession();
	sEditor.setValue(store.get("tmpContent", ""));

	// 左侧收缩工具
	$("#floatTool").on("click", function () {
		const cLeft = $("#c-left").position().left === 0;
		$("#c-left").animate({ left: cLeft ? -220 : 0, }, 100);
		$("#c-right").animate({ left: cLeft ? 0 : 220, }, 100, () => {
			editor.resize();
		});
		const tipVal = $(this).data("tip").split("|");
		$(this).html(cLeft ? tipVal[0] : tipVal[1]);
	});
	// 转简体 繁体
	$("[data-language]").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			sEditor.setValue($(this).data("language") === "t2s" ? $.t2s(sVal) : $.s2t(sVal));
		}
		editor.focus();
	});
	// 插入待续完结
	$("[data-insert]").on("click", function () {
		editor.insert($(this).data("insert"));
	});
	// 对齐
	$("[data-align]").on("click", function () {
		const row = editor.selection.getCursor().row;
		let str = sEditor.getLine(row);
		if (str.length > 0) {
			str = str.stringAlign("", "\n", $(this).data("align") || "left");
			const range = editor.selection.getLineRange();
			sEditor.replace(range, str);
			editor.gotoLine(row + 1, 0, false);
		}
	});
	// 保存文档
	$("#SaveEditor").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			store.set("tmpContent", sVal);
			sEditor.getUndoManager().markClean();
			showMessage(this);
		}
		editor.focus();
	});
	// 还原文档
	$("#RestoreEditor").on("click", function () {
		const sVal = store.get("tmpContent", "");
		if (sVal.length > 0) {
			sEditor.setValue(sVal);
			editor.focus();
			showMessage(this);
		}
	});
	// 新建文档
	$("#CreateEditor").on("click", function () {
		sEditor.setValue("");
		editor.focus();
	});
	// 清空文档
	$("#ClearEditor").on("click", function () {
		store.remove("tmpContent");
		showMessage(this);
		editor.focus();
	});
	// 一键整理
	$("#onCleanUp").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			sEditor.setValue(editorCleanUp(sVal));
			editor.focus();
		}
	});
	// 特殊整理
	$("#onCleanUpEx").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			sEditor.setValue(editorCleanUpEx(sVal));
			editor.focus();
		}
	});
	// 一键排版
	$("#onTypeSetSplit").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			store.set("tmpContent", sVal);
			showMessage(this);
			sEditor.setValue(onTypeSetSplit(sVal));
			editor.focus();
		}
	});
	// 阅读排版
	$("#onTypeSetRead").on("click", function () {
		const sVal = sEditor.getValue();
		if (sVal.length > 0) {
			store.set("tmpContent", sVal);
			showMessage(this);
			sEditor.setValue(onTypeSetRead(sVal));
			editor.focus();
		}
	});
	// 复制标题到剪贴板
	const clipboardTitle = new ClipboardJS(".copy-title");
	clipboardTitle.on("success", function (e) {
		e.clearSelection();
		showMessage($(".copy-title"));
	});
	// 复制文档到剪贴板
	const clipboardText = new ClipboardJS(".copy-content", {
		text: () => editor.getValue()
	});
	clipboardText.on("success", function (e) {
		e.clearSelection();
		showMessage($(".copy-content"));
	});
	// 绑定快捷键
	const _commands = [
		['#SaveEditor', 'ctrl-alt-s'],
		['#RestoreEditor', 'ctrl-alt-r'],
		['#CreateEditor', 'ctrl-alt-n'],
		['#onCleanUpEx', 'f7'],
		['#onCleanUp', 'f8'],
		['#onTypeSetSplit', 'f9'],
		['.copy-content', 'f10']
	].map((v, i) => {
		return {
			name: '__N_' + i,
			exec: () => { $(`${v[0]}`).trigger("click"); },
			bindKey: { win: v[1], mac: v[1] },
		}
	})
	editor.commands.addCommands(_commands);
});
