define("ace/mode/textile_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var TextileHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : ["text", "title0", "title0", "title0"],
                regex : /^([ 　\t]*)(\[[bui]\])?([引楔]子|引言|[自]?序[言幕]?|序[篇]?章|题[注记]|題[註記]|文案|卷[首后後][语語]|开卷[语語]|(?:作者)?前言|[全本下][卷部篇集阙季册闕冊](?:[简簡]介|介[绍紹]|[预預]告)|(?:作品|作者|人物|内容)?(?:[简簡]介|介[绍紹]|[预預]告|自介)|篇[后後]|[后後][记话記話]|尾[声记聲記]|(?:完本|作者)感言|附[录錄]|作者的[话話]|正文|[最]?[初前后上中下续终尾断後續終斷][卷部篇集阙季册闕冊折章回话节幕節話]|同人|[前后外续後續][番传傳章篇]|外[一二三四五六七八九十百]+[章回折节话節話]|[续續][一二三四五六七八九十百]|番外[篇卷]?[0-9零一二三四五六七八九十百]{0,4})([ 　	\.。:：、]*.{0,30}[^。;；]|$)?$/
            },
            {
                token : ["text", "title1", "title1", "title1"],
                regex : /^([ 　\t]*)(\[[bui]\])?([第]?[\-—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩上中下续终續終]{1,9}[ ]*[卷部篇集阙季册闕冊][ 　	\.。:：、]*)(.{0,30}[^。;；…]|$)?$/
            },
            {
                token : ["text", "title2", "title2", "title2"],
                regex : /^([ 　\t]*)(\[[bui]\])?([\(（第][\-—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩上中下续终續終]{1,9}[ ]*[折章回话节幕話節\)）][ 　	\.。:：、]*)(.{1,30}[^。;；…]|$)$/
            },
            {
                token : ["text", "title1"],
                regex : /^([ 　]*)(《(?:.+)》(?:.*?)|书名[：\:](?:.+))$/
            },
            {
                token : "endstr",
                regex : '([（【“「<])(' + config.endStrs + ')([）】”」>])'
            },
            // 省略号补丁，修正为宋体
            {
                token : "cnPunctuation",
                regex : /[…～]/
            },
            {
                token : "halfpun",
                regex : /[\/\\\-\'\.\<\>\[\]\!\(\)\,\:\;\?~`&@#%=]/
            },
            {
                token : "number",
                regex : "([0-9a-zA-Z]+)"
            }, {
                token : "quotes",
                regex : "([‘“『「]|[’”』」])"
            }
        ]
    };
};

oop.inherits(TextileHighlightRules, TextHighlightRules);

exports.TextileHighlightRules = TextileHighlightRules;

});

define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/novel",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/textile_highlight_rules","ace/mode/matching_brace_outdent"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var TextileHighlightRules = require("./textile_highlight_rules").TextileHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.HighlightRules = TextileHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "novel";
    this.getNextLineIndent = function(state, line, tab) {
        if (state == "intag")
            return tab;
        
        return "";
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
    
    this.$id = "ace/mode/novel";
}).call(Mode.prototype);

exports.Mode = Mode;

});
                (function() {
                    window.require(["ace/mode/novel"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            