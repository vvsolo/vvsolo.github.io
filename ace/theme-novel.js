define("ace/theme/novel",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-novel";
exports.cssText = `
.ace-novel {
text-shadow: 0 1px 1px #444;
}
.ace-novel .ace_gutter {
border-right: 1px solid #4d4d4d;
color: #888;
}
.ace-novel .ace_gutter-active-line {
border-left: 4px solid #80FF80;
border-right: 1px solid #4d4d4d;
background-color: rgba(70,66,60,0.4);
color: #FFF;
}
.ace-novel .ace_marker-layer .ace_active-line {
background: rgba(70,66,60,0.4);
}
.ace-novel .ace_marker-layer .ace_selected-word {
border-radius: 2px;
border: 8px solid #3f475d;
}
.ace-novel .ace_print-margin {
width: 0;
border-left: 1px dashed #4d4d4d;
}
.ace-novel {
color: #C4CAD6;
background-color: #1E1E1E;
}
.ace-novel .ace_text {
color: #C4CAD6;
background-color: #1E1E1E;
}
.ace-novel .ace_invisible {
color: #504945;
}
.ace-novel .ace_marker-layer .ace_selection {
background: rgba(179, 101, 57, 0.75)
}
.ace-novel.ace_multiselect .ace_selection.ace_start {
box-shadow: 0 0 3px 0px #002240;
}
.ace-novel .ace_keyword {
color: #8ec07c;
}
.ace-novel .ace_comment {
font-style: italic;
color: #928375;
}
.ace-novel .ace-statement {
color: red;
}
.ace-novel .ace_variable {
color: #84A598;
}
.ace-novel .ace_variable.ace_language {
color: #D2879B;
}
.ace-novel .ace_constant {
color: #C2859A;
}
.ace-novel .ace_constant.ace_language {
color: #C2859A;
}
.ace-novel .ace_constant.ace_numeric {
color: #C2859A;
}
.ace-novel .ace_string {
color: #B8BA37;
}
.ace-novel .ace_support {
color: #F9BC41;
}
.ace-novel .ace_support.ace_function {
color: #F84B3C;
}
.ace-novel .ace_storage {
color: #8FBF7F;
}
.ace-novel .ace_keyword.ace_operator {
color: #EBDAB4;
}
.ace-novel .ace_punctuation.ace_operator {
color: yellow;
}
.ace-novel .ace_bookmark { background-color: #AC1F30; color: #fff; }
.ace-novel .ace_title1 { background-color: #4A0095; color: #fff; }
.ace-novel .ace_title2 { background-color: #AC1F30; color: #fff; }
.ace-novel .ace_title3 { background-color: #1D6F42; color: #fff; }
.ace-novel .ace_endstr { background-color: #245580; color: #fff; }
.ace-novel .ace_number { color: #9D81DF; }
.ace-novel .ace_fullpun { color: #BE9E5C; }
.ace-novel .ace_halfpun { color: #3087CA; }
.ace-novel .ace_quotes { color: #80FF80; }
.ace-novel .ace_error { background-color: #FDD701; color: #222;}
.ace-novel .ace_warn { position: relative; }
.ace-novel .ace_warn::before{
  content: '';
  position: absolute;
  bottom: -0.24em;
  width: 100%;
  height: 0.25em;
  background: 
    linear-gradient(150deg, transparent, transparent 35%, #FDD701, transparent 55%, transparent 100%), 
    linear-gradient(30deg, transparent, transparent 35%, #FDD701, transparent 55%, transparent 100%);
  background-size: 0.7em 0.5em;
  background-repeat: repeat-x, repeat-x;
  left: 0px;
}
.ace-novel .ace_indent-guide {
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y
}
.ace_scrollbar-v::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 5px;
}
.ace_scrollbar-v::-webkit-scrollbar { width: 8px; }
.ace_scrollbar-v::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}`;

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
            