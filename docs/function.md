
> 脚本传入的文本分两种情况：选中字符、未选中所有字符
> 两种文字处理会有不同，需特别注意

### 全局

> 整理：规范文本格式，是细分功能的集合处理方式
> 排版：整理后，排版文本

#### 01.整理 → 全局

> 对换行、空格、标点、字符、字母、数字和段落，进行批量处理，一般只需**执行一次**即可

- HTML 字符实体转换
- Unicode转换
- 排版初始化，去空格空行
- 去乱码、广告、不可读字符
- 半角字母数字
- 修正章节标题，包括非常规的章节标题
- 修正错误标题
- 全角标点符号
- 去除汉字间的空格
- 修正分隔符号
- 修正引号为西式引号
- 修正英文
- 其他自定义修正

#### 02.整理 → 增强

> 对段落进行处理，修正多余换行
> 若引号未成对，会进行提醒

- 修正章节标题，包括非常规的章节标题
- 修正错误标题
- 去除汉字间的空格
- 修正分隔符号
- 半角字母数字
- 修正引号为西式引号
- 修正段落间的错误换行
- 修正引号内的错误换行

#### 03.整理 → 普通

> 对空格、缩进进行处理，基础标准化格式

- Unicode转换
- 排版初始化，去空格空行
- 修正章节标题，不包括非常规的章节标题
- 修正错误标题
- 去除汉字间的空格
- 修正分隔符号
- 其他自定义修正

#### 04.整理 → 特殊

> 整理无任何排版规则的文本（多为网络复制）

- HTML 字符实体转换
- Unicode转换
- 转换变体字母
- 转换变体序号
- 排版初始化，去空格空行
- 去除汉字间的空格
- 半角字母数字
- 去乱码、广告、不可读
- 保护书名、作者、无结尾标点的歌词类不换行
- 修正章节外加括号
- 保护章节最后是句号的
- 保护章节标题
- 修正引号
- 修正错误换行
- 其他自定义修正
- 去除汉字间的空格
- 修正分隔符号
- 再次修正章节标题

#### 05.整理 → 分段

> 对 35 字分段排版的文本进行反向处理

#### 11.排版 → 阅读

> 阅读样式，常用于 TXT 格式阅读器

- 段落前两个全角空格
- 章节标题间隔两行

#### 12.排版 → 论坛
- 段落前两个全角空格
- 段落间间隔一行
- 章节标题间隔一行

#### 13.排版 → 网页
- 段落无缩进
- 段落间间隔一行
- 中文间无空格
- 英文和数字与中文间美化空格

#### 14.排版 → 分段

> 分段样式，常用于特定论坛

- 段落按 35 字（可自定义）分隔换行
- 段落首行前两个全角空格
- 分隔部分不换行
- 段落间间隔一行
- 章节标题居中
- 分隔符居中
- 结尾标注性文本居中

### 转换

- 01.空格标准
  - 删除段落首尾空格
  - 删除中文间空格
  - 删除空白行
- 02.标点符号
  - 全角标点符号
  - 修正多余标点符号
- 03.数字字母
  - 半角数字字母
- 04.英文格式
  - 英文大小写规范
  - 句式首字母大写，其余小写
  - 约定的英文缩写全大写
  - 虚词小写
  - 书名首字母全大写，其余小写
  - 表示型号，有字母和数字，全大写
- 05.字符修正
  - 修正中文间字符
  - 修正数字、字母间字符
- 06.分隔符号
  - 修正分隔符
- 07.西式引号
  - 【全局状态】转换引号样式为西式引号 `“”‘’`
  - 【选中状态】转换引号样式为西式引号，并对选中字符的错误换行进行修正
- 08.直角引号
  - 【全局状态】转换引号样式为直角引号 `「」『』`
  - 【选中状态】转换引号样式为直角引号，并对选中字符的错误换行进行修正
- 09.章节标准
  - 规范章节标题样式
  - 修正有序列表
  - 修正相连的重复章节标题
- 11.Unicode 字符
- 12.HTML 字符实体
- 13.变体字母
- 14.变体序号
- 21.全局标准

### 修正
- 01.章节 → 数字
  - 例：`第八章 → 第08章`
- 02.章节 → 大写
  - 例：`第100章 → 第一百章`
- 03.章节 → 括号转标准
  - 例：`（100） → 第100章`
- 04.章节 → 标准转括号
  - 例：`100 → （100）`
  - 例：`第100章 → （100）`
- 05.章节 → 强制标准
  - 删除 `正文、大结局` 等前缀
  - 修正章节在段落行尾
  - 检索所有章节，查找缺失的章节并修正
  - 强制性转换不标准的章节标题为标准
- 06.章节 → 修正错误
  - 删除 `正文、大结局` 等前缀
  - 修正卷章相连，并删除重复的卷名
  - 修正错转换的章节
  - 修正错转换的有序列表
  - 修正大写的多章章节标题，例 `第三十八——四十章`
- 11.标点 → 双引号缺失
  - 【选中字符】前后补齐双引号
  - 【未选中字符】分析光标所在行，智能补齐前后双引号
- 12.标点 → 单引号缺失
  - 【选中字符前后无引号】所选文本中的双引号全转换成单引号
  - 【选中字符前后是引号】所选文本前后全转换成单引号，中间不处理
- 13.标点 → 单双引号互换
- 14.标点 → 引号嵌套
  - 尝试修正双引号中嵌套的双引号为单引号
  - 尝试修正单引号中嵌套的单引号为双引号
- 15.标点 → 行尾缺失
  - 尝试修正段落最后无标点的情况
  - 尝试修正引用中无结尾标点的情况
- 21.段落 → 智能分隔
  - 按设定长度进行分隔，句号、引号、省略号进行换行处理，分隔段落不够字数的合并
  - 【全局状态】对超长的段落进行智能分隔，避免段落过长
  - 【选中状态】对选中字符进行智能分隔，并处理引号分行的情况
- 22.段落 → 强制分隔
  - 按规则进行分隔，以句号、引号、省略号后进行换行处理
  - 【全局状态】对超长的段落进行强制分隔，避免段落过长
  - 【选中状态】对选中字符进行强制分隔，并处理引号分行的情况
- 23.段落 → 重组分隔
  - 现有段落重组后，智能再分隔
  - 分隔引用中的超长文本
  - 为性能考虑，不建议进行全文重组分隔
- 31.清除 → 广告
- 32.清除 → 多余分隔符
  - 尝试修正多个分隔符相连的
  - 尝试修正分隔符和章节标题相连的

### 检查

> 检查全文，各项错误在左侧大纲视图显示
> 大纲视图，双击错误可快速定位到该行

#### 分项
- 01.引号标点
- 02.引号标点〔疑似〕
- 03.引用缺失〔疑似〕
- 04.常规标点〔疑似〕
- 05.标题检查〔疑似〕
- 06.英文超长
- 07.段落超长

#### 集合
- 11.标点检查
  - `01、02、03、04` 集合检查
- 12.其他检查
  - `05、06、07` 集合检查

#### 全局
- 21.全局检查
  - 【疑似】章节标题
  - 【疑似】引用内结尾标点缺失
  - 【疑似】双引号嵌套
  - 【疑似】单引号嵌套
  - 【疑似】引号缺失
  - 【疑似】单双引号混用
  - 【错误】章节标题
  - 【错误】行首标点
  - 【错误】行尾标点
  - 【错误】错误标点后跟随
  - 【错误】行尾标点缺失
  - 【错误】段落超长
  - 【错误】英文超长
  - 【错误】单引号不成对
  - 【错误】双引号不成对
- 22.章节检查
  - 章节重复
  - 章节相连
  - 章节缺失
  - 疑似章节
- 23.重复行检查

### 校对〔标注〕

> 手工校对时，标注勘误文本

- 01.校对 → 手工标注.ejs
  - 手工校对选中的字符，标注勘误
- 02.校对 → 自动标注〔拼音〕.ejs
  - 自动查找可能的拼音错误，并标注勘误到文本最后
- 03.校对 → 自动标注〔中文混淆〕.ejs
  - 自动查找可能的中文间隔混淆，并标注勘误到文本最后
- 04.校对 → 自动标注〔英文混淆〕.ejs
  - 自动查找可能的英文间隔混淆，并标注勘误到文本最后
- 05.校对 → 自动标注〔星号整句〕.ejs
  - 自动查找可能的星号
  - 提取整句，并标注勘误到文本最后
- 06.校对 → 自动标注〔重复行〕.ejs
  - 自动查找可能的重复行，并标注勘误到文本最后
- 07.缩拼标注〔事件〕.ejs
  - 选中字符，标注拼音缩拼
  - 根据标注的缩拼，使用 `缩拼+Tab` 快速输出
  - 常用于写作时姓名、名称等快捷输出
- 11.校对 → 标注全局替换.ejs
  - 01～06 标注的文本，进行全局替换校对

### 校对〔词典〕

> 根据可自定义的词典，对文本进行修正

- 01.敏感词组
- 02.敏感地名
- 03.拼音缺字
- 04.错用字词
- 05.词组混淆
- 06.量词小写
- 11.自动校对
  - `01、02、03、04、05` 集合校对，无提醒
  - 提醒：大文本自动校对时，速度将很慢
  - 敏感词组转拼音首字母组合、单字拼音修正时，错误较多
- 12.自动校对〔确认〕
  - `01、02、03、04、05` 集合校对，敏感词组转拼音首字母时会提醒

### 排版

> 排版后的一些辅助功能

- 01.插入标头
- 02.统计字数
- 11.段落 → 居左
- 12.段落 → 居中
- 13.段落 → 居右
- 21.广告 → 按字数插入
- 22.广告 → 按段落插入
- 23.广告 → 清除所有

### 设置
- 01.用户设置
- 02.词典管理
- 91.性能测试
- 92.章节正则
- 99.刷新大纲

### 简繁转换

> 简体、繁体（标准、台湾繁体标准、香港繁体标准）和日文新字体的互相转换

### node 版本
- 对应上述功能的 node 版本
- 针对大文本，速度更快
- 针对小文本，速度会慢
- 校对时无提醒，但速度更快

### 辅助功能

> 一些不常用，但很有用的脚本集合

#### 排版

- 41.排版 → 阅读〔修正小标题〕.ejs
- 42.排版 → 阅读〔章节无缩进〕.ejs

#### 章节

- 01.章节 → 卷章相连〔去重〕.ejs
- 02.章节 → 章回统一.ejs
- 03.章节 → 按顺序重排〔章序〕.ejs
  - 按现有章节顺序，重新计数生成序号
  - 分卷计数时，按现有章节顺序，分卷重新计数生成序号
- 04.章节 → 按章序重排〔整章〕.ejs
  - 按现有章节序号，移动整章顺序排列
- 11.无章节 → 添加序号〔规则〕.ejs
  - 有相同前缀的，替换为章节
- 12.无章节 → 添加序号〔智能〕.ejs
  - 无相同前缀
  - 弹窗确认方式智能添加序号
- 21.小标题 → 添加括号〔智能〕.ejs
  - 小标题 `1`、`一`
  - 有章节标题，大小写小标题同时存在时 `一 → （一）` `1 → 【01】`
  - 有章节标题，大小写小标题只有其一时 `一 → （一）` `1 → （01）`
  - 无章节标题，大小写小标题同时存在时 `一 → 第一章` `1 → （01）`
  - 无章节标题，大小写小标题只有其一时 `一 → （一）` `1 → （01）`
- 22.小标题 → 排版后修正.ejs
  - 小标题 `1`、`一`
  - 排版后在小标题前加换行

#### 修正

- 01.字符 → 全角数字字母.ejs
- 11.标点 → 转半角标点.ejs
- 12.标点 → 半角方括号转引号.ejs
- 13.标点 → 按行整理引号嵌套.ejs
  - 按行查找单双引号，进行匹对整理
  - 适用于引号嵌套的情况
  - 不确定的引号嵌套，请选中字符后进行整理
- 14.标点 → 缺失引号补齐.ejs
  - 按行查找双引号缺失，补齐行尾缺失
- 21.英文 → 按大小写分词.ejs
  - 相连的英文句子，按大小写字母进行分割
- 22.英文 → 按词典分词.ejs
  - 相连的英文句子，按英文单词进行分割
- 31.清除 → 第一版主广告.ejs

#### 标注

- 01.标注 → 拼音〔无声调〕.ejs
  - 在选中字符后添加拼音标注，无声调
- 02.标注 → 拼音〔声调〕.ejs
  - 在选中字符后添加拼音标注，带声调
- 03.标注 → 拼音〔小写〕.ejs
  - 修正标注的拼音为小写

#### 勘误〔实验性〕

> 实验性功能，有错误
> 利用 OpenCC，进行词组勘误

- 01.勘误 → 词组.ejs
- 02.勘误 → 拼音.ejs
- 03.勘误 → 星号.ejs
- 04.勘误 → 临时.ejs
- 99.编辑 → 词典.ejs

#### 取名

- 01.中国.ejs
- 02.欧美.ejs
- 03.日本.ejs
- 04.韩国.ejs
- 05.俄国.ejs
- 10.—————.ejs
- 11.中国〔姓〕.ejs
- 12.欧美〔姓〕.ejs
- 13.日本〔姓〕.ejs
- 14.韩国〔姓〕.ejs
- 15.俄国〔姓〕.ejs

#### 分析

- 01.分析 → 提取词组频率.ejs
- 02.分析 → 提取唯一汉字.ejs
- 03.分析 → 提取非GBK文字.ejs
