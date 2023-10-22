define("ace/mode/textile_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var TextileHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : "title3",
                regex : /^([ 　\s]*)((?:序篇章|首部曲|[作译譯编編著]者序|[续續外][0-9０-９零一二三四五六七八九十]?[章折回话节幕節話]|(?:楔子|弁言|前[言记記]|引[言子文]|[首小节自次总代節總简原]序|序[章言目曲传傳]|序|[后後附][记话記話序语語]|尾[声记聲記]|大?[结結]局|附[录錄]|同人[续續]?|[前后外续正後續间間转轉][传篇傳章]|完[结結]篇|特[别別]篇|[前后外里裏]番|[番篇]外[篇卷章语語]?)[（\(]?[0-9０-９一二三四五六七八九十上中下续终續終]{0,3}[）\)]?)[： 　，、．·。—.,:|-]{0,4}(?:.{0,40}[^。：;；\n]|$))$/
            }, {
                token : "title2",
                regex : /^([ 　\s]*)((?:第?[0-9０-９]{1,5}(?:[-—.][0-9０-９]{1,5})?|第?[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7}|最[初终尾終]|[上下]半|[序初前始后终首末尾後終]之?|[上中下续断开續斷開])(?:章[节節]|段落|[段场阙場闕]|[章折回话节幕節話])[： 　，、．·。—.,:|-]{0,4}(?:.{0,40}[^。：;；\n]|$))$/
            }, {
                token : "title1",
                regex : /^([ 　\s]*)((?:第?[0-9０-９]{1,5}(?:[-—.][0-9０-９]{1,5})?|第?[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7}|最[初终尾終]|[上下]半|[序初前始后终首末尾後終]之?|[上中下续断开續斷開])(?:部分|[单單]元|[卷部集篇册辑季冊輯])[： 　，、．·。—.,:|-]{0,4}(?:.{0,40}[^。：;；\n]|$))$/
            }, {
                token : "title2",
                regex : /^([ 　\s]*)([\(（〔](?:[0-9０-９]{1,5}(?:[-—.][0-9０-９]{1,5})?|[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7}|[上中下续终續終])[\)）〕])(.{0,40}[^。：;；\n]|$)$/
            }, {
                token : "title1",
                regex : /^([ 　\s]*)(《[^》]+》|书名[：\:].+)$/
            }, {
                token : "endstr",
                regex : /([（【“「<])(未完待[续續]|未完|待[续續]|完[结結]?|全[文书書][完终終])([）】”」>])/
            }, {
                token : "error",
                regex : /^[\s　]*[，、。：；？！）］〕】｝·’』”」〉》]|[（［〔【｛·‘『“「〈《]$/
            }, {
                token : "warn",
                regex : /([，、：；）］〕】｝’』”」〉》])\1+/
            }, {
                token : "warn",
                regex : /([（［〔【｛‘『“「〈《])\1+/
            }, {
                token : "warn",
                regex : /”([^“，。？！…—：]{1,12}[^，。？！…—：])“|’([^‘，。？！…—：]{1,12}[^，。？！…—：])‘/
            }, {
                token : "warn",
                regex : /^[\s　]*第(?:[0-9０-９]{1,5}|[0０○〇零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌貳叄陸兩]{1,7})[章折回话节幕節話][ 　，、．·。：—.,:|-]{1,4}.{0,40}[。：;；]$/
            }, {
                token : "fullpun",
                regex : /[·–—―…※、。〈〉《》【】〔〕〖〗〝〞・！-／：-＠～￠-￥‘“『「’”』」]/
            }, {
                token : "halfpun",
                regex : /[\x21-\x28-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E\xA1-\xBF\.]/
            }, {
                token : "number",
                regex : /([0-9a-zA-Z]+)/
            }, {
                token : "quotes",
                regex : /[‘“『「]|[’”』」]/
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
            