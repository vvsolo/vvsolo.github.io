define("ace/theme/novel",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-novel";
exports.cssText = ".ace-novel .ace_gutter {\
border-right: 1px solid #4d4d4d;\
text-shadow: 0px 1px 1px #4d4d4d;\
color: #888;\
}\
.ace-novel .ace_gutter-active-line {\
border-right: 1px solid #4d4d4d;\
background-color: rgba(45,46,45,0.8);\
}\
.ace-novel .ace_marker-layer .ace_active-line {\
background: rgba(45,46,45,0.7);\
}\
.ace-novel .ace_marker-layer .ace_selected-word {\
border-radius: 2px;\
border: 8px solid #3f475d;\
}\
.ace-novel .ace_print-margin {\
width: 0;\
border-left: 1px dashed #4d4d4d;\
}\
.ace-novel {\
color: #B7BDC8;\
background-color: #1E1E1E;\
}\
.ace-novel .ace_invisible {\
color: #504945;\
}\
.ace-novel .ace_marker-layer .ace_selection {\
background: rgba(179, 101, 57, 0.75)\
}\
.ace-novel.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #002240;\
}\
.ace-novel .ace_keyword {\
color: #8ec07c;\
}\
.ace-novel .ace_comment {\
font-style: italic;\
color: #928375;\
}\
.ace-novel .ace-statement {\
color: red;\
}\
.ace-novel .ace_variable {\
color: #84A598;\
}\
.ace-novel .ace_variable.ace_language {\
color: #D2879B;\
}\
.ace-novel .ace_constant {\
color: #C2859A;\
}\
.ace-novel .ace_constant.ace_language {\
color: #C2859A;\
}\
.ace-novel .ace_constant.ace_numeric {\
color: #C2859A;\
}\
.ace-novel .ace_string {\
color: #B8BA37;\
}\
.ace-novel .ace_support {\
color: #F9BC41;\
}\
.ace-novel .ace_support.ace_function {\
color: #F84B3C;\
}\
.ace-novel .ace_storage {\
color: #8FBF7F;\
}\
.ace-novel .ace_keyword.ace_operator {\
color: #EBDAB4;\
}\
.ace-novel .ace_punctuation.ace_operator {\
color: yellow;\
}\
.ace-novel .ace_bookmark { background-color: #8B0A6B; color: #fff; }\
.ace-novel .ace_title0 { background-color: #006200; color: #fff; }\
.ace-novel .ace_title1 { background-color: #8B0A6B; color: #fff; }\
.ace-novel .ace_title2 { background-color: #733730; color: #fff; }\
.ace-novel .ace_endstr { background-color: #245580; color: #fff; }\
.ace-novel .ace_number { color: #9D81DF; }\
.ace-novel .ace_halfpun { color: #3087CA; }\
.ace-novel .ace_quotes { color: #80FF80; }\
.ace-novel .ace_cnPunctuation { font-family: NSimSun, SimSun; font-size: 15px; }\
.ace-novel .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
                (function() {
                    window.require(["ace/theme/novel"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            