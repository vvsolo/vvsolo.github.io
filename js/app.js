//sEditor.setMode("ace/mode/novel");
$(function() {
	var isLanguage = $('#chinese'),
		tEditor = $('#TextareaEditor'),
		editorTitleHeight = 50;

	// 简繁互换
	function setLanguage() {
		var tipVal = isLanguage.data('default').split('|')
		if (tipVal[0] == isLanguage.html()) {
			$('body, title').t2s();
			isLanguage.html(tipVal[1]);
		} else {
			$('body, title').s2t();
			isLanguage.html(tipVal[0]);
		}
	}
	// 提示信息
	function showMessage(r) {
		$('#AlertMsg').html($(r).attr('data-tip'))
		$('.editor-message').eq(0).hide().show().delay(5000).fadeOut(400)
	}
	// 编辑区域全屏占，修正编辑器高度
	function getEditorHeight() {
		editorTitleHeight = $('.editor-title').eq(0).outerHeight()
		tEditor.height(parseInt($(this).outerHeight() - editorTitleHeight))
	}
	getEditorHeight()
	$(window).resize(function() {
		getEditorHeight()
	});
	$('.editor-message').eq(0).delay(8000).fadeOut(400)
	// 初始化编辑器
	var editor = ace.edit("TextareaEditor")
	editor.setOptions({
		theme: "ace/theme/novel",
		mode: "ace/mode/novel",
		// 折行
		wrap: 'free',
		indentedSoftWrap: false,
		//autoScrollEditorIntoView: true,
		// 字体
		//fontFamily: 'Consolas,Monaco,Source Han Serif,NSimSun,SimSun,Courier New,monospace,serif',
		fontFamily: 'Consolas,Monaco,Courier New,monospace,serif',
		fontSize: '1.1rem',
		// 打印线
		printMarginColumn: 70,
		// 显示空格
		showInvisibles: true,
		// 显示滚动条
		//vScrollBarAlwaysVisible: true,
		// 空字符是否可复制
		copyWithEmptySelection: true,
		// 行号固定宽度
		fixedWidthGutter: true
	});
	// 状态栏
	var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
	var sEditor = editor.getSession()
	sEditor.setValue(storage.get('tmpContent', ''))
	isLanguage.html(storage.get('language', '简'))
	// 读取保存的设置
	var inputVals = ['inputBookName', 'inputAuthor', 'inputSite'],
		i = -1;
	inputVals.forEach(function(v, i) {
		$('#' + v).val(storage.get(v, ''));
	});
	while (++i < 5) {
		var tmp = 'Check_' + i;
		(storage.get(tmp, '') !== '') ?
			$('#' + tmp).attr('checked', 'checked') :
			$('#' + tmp).removeAttr('checked');
	}
	// 保存设置
	$('#SaveConfig').on('click', function() {
		inputVals.forEach(function(v) {
			($('#' + v).val() !== '') ?
				storage.set(v, $('#' + v).val()) :
				storage.remove(v);
		});
		var i = -1;
		while (++i < 5) {
			var tmp = 'Check_' + i;
			$('#' + tmp).is(':checked') ?
				storage.set(tmp, 'checked') :
				storage.remove(tmp);
		}
		storage.set('language', (isLanguage.html() == '简') ? '繁' : '简')
		showMessage(this);
	})
	// 保存设置
	$('#CleanConfig').on('click', function() {
		storage.clean()
		showMessage(this);
	})
	// 简繁互换
	setLanguage();
	isLanguage.on('click', function(e) {
		e.preventDefault();
		setLanguage();
	});
	// 左侧收缩工具
	$('#floatTool').on('click', function() {
		var cLeft = $('#c-left').position().left === 0
		$('#c-left').animate({
			left: (cLeft ? -220 : 0)
		}, 0)
		$('#c-right').animate({
			left: (cLeft ? 0 : 220)
		}, 0)
		var tipVal = $(this).attr('data-tip').split('|');
		$(this).html(cLeft ? tipVal[0] : tipVal[1]);
		editor.resize();
	})
	// 转简体 繁体
	$('[data-language]').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			var tmp = $(this).data('language');
			sEditor.setValue(tmp === 't2s' ? $.t2s(sVal) : $.s2t(sVal));
		}
		editor.focus();
	})
	// 简单UBB
	$('[data-ubbcode]').on('click', function() {
		var selection = sEditor.getTextRange(editor.getSelectionRange());
		if (selection.length > 0) {
			var tmp = $(this).data('ubbcode').replace(/\{s\}/g, selection);
			editor.insert(tmp);
		} else {
			showMessage(this);
		}
	});
	// 插入待续完结
	$('[data-insert]').on('click', function() {
		editor.insert($(this).data('insert'));
	});
	// 对齐
	$('[data-align]').on('click', function() {
		var row = editor.selection.getCursor().row
		var str = sEditor.getLine(row)
		if (str.length > 0) {
			str = str.ChapterAlign('', '\n', $(this).data('align') || 'left')
			var range = editor.selection.getLineRange()
			sEditor.replace(range, str)
			editor.gotoLine(row + 1, 0, false)
		}
	});
	// 实时显示文章标题
	setTitle();
	$('#inputBookName, #inputChapter').on('keyup keydown change focus input propertychange', function() {
		setTitle();
	})
	// 保存文档
	$('#SaveEditor').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			storage.set('tmpContent', sVal);
			sEditor.getUndoManager().markClean();
			showMessage(this);
		}
		editor.focus();
	});
	// 还原文档
	$('#RestoreEditor').on('click', function() {
		var sVal = storage.get('tmpContent', '');
		if (sVal.length > 0) {
			sEditor.setValue(sVal);
			editor.focus();
			showMessage(this);
		}
	});
	// 新建文档
	$('#CreateEditor').on('click', function() {
		sEditor.setValue('');
		editor.focus();
	});
	// 清空文档
	$('#ClearEditor').on('click', function() {
		storage.remove('tmpContent');
		showMessage(this);
		editor.focus();
	});
	// 一键整理
	$('#onCleanUp').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			sEditor.setValue(editorCleanUp(sVal));
			editor.focus();
		}
	});
	// 特殊整理
	$('#onCleanUpEx').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			sEditor.setValue(editorCleanUpEx(sVal));
			editor.focus();
		}
	});
	// 一键排版
	$('#onTypeSetSplit').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			storage.set('tmpContent', sVal);
			showMessage(this);
			sEditor.setValue(onTypeSetSplit(sVal));
			editor.focus();
		}
	});
	// 阅读排版
	$('#onTypeSetRead').on('click', function() {
		var sVal = sEditor.getValue();
		if (sVal.length > 0) {
			storage.set('tmpContent', sVal);
			showMessage(this);
			sEditor.setValue(onTypeSetRead(sVal));
			editor.focus();
		}
	});
	// 复制标题到剪贴板
	var clipboardTitle = new ClipboardJS('.copy-title');
	clipboardTitle.on('success', function(e) {
		e.clearSelection();
		showMessage($('.copy-title'));
	});
	// 复制文档到剪贴板
	var clipboardText = new ClipboardJS('.copy-content', {
		text: function(trigger) {
			return editor.getValue();
		}
	});
	clipboardText.on('success', function(e) {
		e.clearSelection();
		showMessage($('.copy-content'));
	});
	// 绑定快捷键
	editor.commands.addCommands([{
		name: "__save",
		exec: function() {
			$('#SaveEditor').trigger('click');
		},
		bindKey: { win: "ctrl-alt-s", mac: "cmd-alt-s" }
	},{
		name: "__restore",
		exec: function() {
			$('#RestoreEditor').trigger('click');
		},
		bindKey: { win: "ctrl-alt-r", mac: "cmd-alt-r" }
	},{
		name: "__create",
		exec: function() {
			$('#CreateEditor').trigger('click');
		},
		bindKey: { win: "ctrl-alt-n", mac: "cmd-alt-n" }
	},{
		name: "__cleanup_ex",
		exec: function() {
			$('#onCleanUpEx').trigger('click');
		},
		bindKey: { win: "f7", mac: "f7" }
	},{
		name: "__cleanup",
		exec: function() {
			$('#onCleanUp').trigger('click');
		},
		bindKey: { win: "f8", mac: "f8" }
	},{
		name: "__typeset",
		exec: function() {
			$('#onTypeSetSplit').trigger('click');
		},
		bindKey: { win: "f9", mac: "f9" }
	},{
		name: "__copydoc",
		exec: function(){
			$('.copy-content').trigger('click');
		},
		bindKey: { win: "f10", mac: "f10" }
	}]);
});