/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */



CodeMirror.defineSimpleMode("text", {
  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type
    {regex: /^([ 　\t]*)(\[[bui]\])?([引楔]子|引言|[自]?序[言幕]?|序[篇]?章|题[注记]|題[註記]|文案|卷[首后後][语語]|开卷[语語]|(?:作者)?前言|[全本下][卷部篇集阙季册闕冊](?:[简簡]介|介[绍紹]|[预預]告)|(?:作品|作者|人物|内容)?(?:[简簡]介|介[绍紹]|[预預]告|自介)|篇[后後]|[后後][记话記話]|尾[声记聲記]|(?:完本|作者)感言|附[录錄]|作者的[话話]|正文|[最]?[初前后上中下续终尾断後續終斷][卷部篇集阙季册闕冊折章回话节幕節話]|同人|[前后外续後續][番传傳章篇]|外[一二三四五六七八九十百]+[章回折节话節話]|[续續][一二三四五六七八九十百]|番外[篇卷]?[0-9零一二三四五六七八九十百]{0,4})([ 　	\.。:：、]*.{0,30}[^。;；]|$)?$/gim, token: ["title-space", "title0", "title0", "title0"]},
    {regex: /^([ 　\t]*)(\[[bui]\])?([第]?[\-—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩上中下续终續終]{1,9}[ ]*[卷部篇集阙季册闕冊][ 　	\.。:：、]*)(.{0,30}[^。;；…]|$)?$/gim, token: ["title-space", "title1", "title1", "title1"]},
    {regex: /^([ 　\t]*)(\[[bui]\])?([\(（第][\-—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩上中下续终續終]{1,9}[ ]*[折章回话节幕話節\)）][ 　	\.。:：、]*)(.{1,30}[^。;；…]|$)$/gim, token: ["title-space", "title2", "title2", "title2"]},
    {regex: new RegExp('([（【“「<]?)(' + configs.endStrs + ')([）】”」>]?)$', 'gm'), token: "title-endstr"},
    {regex: /[0-9a-zA-Z]/, token: "title-number"},
    {regex: /[‘’“”『』「」]/, token: "title-quotes"},
    {regex: /[　 \t]/, token: "title-space"},
    //{regex: /(^[　 ]*)([，、。：；？！）］〕】｝·’』”」〉》])/, token: "title-punerror"},
    {regex: /([（［〔【｛·‘『“「〈《]$)/gm, token: "title-punerror"}
  ]
});
