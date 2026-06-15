-- 自动生成: 评价种子导入 (粘贴到 Supabase SQL Editor 执行)
-- 由 scripts/seed_reviews_sql.ts 从 course_reviews.csv 生成

-- 0) 清掉之前导入的种子评价后重插当前版本。
--    只删匿名种子行(author_id 为空 且 作者名="匿名同学")——真实用户评价 author_id 不为空，不受影响。
delete from course_reviews
where author_id is null and author_name = '匿名同学'
  and course_id in (select id from courses where code in ('COMP7045', 'COMP7810', 'COMP7930', 'COMP7640', 'COMP7650', 'COMP7025', 'COMP7780', 'COMP7095', 'COMM7020', 'COMM7010', 'COMM7250', 'COMM7300', 'COMM7310', 'COMM7580', 'COMM7910', 'COMM7060', 'AIDM7480', 'COMP7180', 'COMP7015', 'COMP7035', 'COMP7990', 'COMP7950', 'COMP7540', 'COMP7530', 'COMP7125'));

-- 1) 缺失的课程建最小行(id=code，name 用 CSV 课程名，仅当该 code 不存在)
insert into courses (id, code, name, credits)
select code, code, name, 3 from (values
  ('COMP7045', 'COMP7045'),
  ('COMP7810', 'COMP7810'),
  ('COMP7930', 'COMP7930'),
  ('COMP7640', 'Database Systems & Administration'),
  ('COMP7650', 'Data Mining & Knowledge Discovery'),
  ('COMP7025', 'COMP7025'),
  ('COMP7780', 'Special Topics in Knowledge & Info Mgmt'),
  ('COMP7095', 'Big Data Management'),
  ('COMM7020', 'COMM7020'),
  ('COMM7010', 'COMM7010'),
  ('COMM7250', 'COMM7250'),
  ('COMM7300', 'COMM7300'),
  ('COMM7310', 'COMM7310'),
  ('COMM7580', 'COMM7580'),
  ('COMM7910', 'COMM7910'),
  ('COMM7060', 'COMM7060'),
  ('AIDM7480', 'AIDM7480'),
  ('COMP7180', 'COMP7180'),
  ('COMP7015', 'COMP7015'),
  ('COMP7035', 'COMP7035'),
  ('COMP7990', 'COMP7990'),
  ('COMP7950', 'COMP7950'),
  ('COMP7540', 'COMP7540'),
  ('COMP7530', 'IT Forum'),
  ('COMP7125', 'Prompt Engineering for Generative AI')
) as t(code, name)
where not exists (select 1 from courses c where c.code = t.code);

-- 2) 插入评价(course_id 解析到课程 id)
insert into course_reviews
  (course_id, author_id, author_name, author_avatar, rating, difficulty, workload, grading, tags, content, semester, is_anonymous, created_at)
select
  (select id from courses where code = v.code order by created_at asc limit 1),
  null, '匿名同学', null,
  v.rating::int, v.difficulty::int, v.workload::int, v.grading::int,
  v.tags::jsonb, v.content, v.semester, true,
  now() - (v.days_ago || ' days')::interval
from (values
  ('COMP7045', 4, 3, 2, null, '["实用","Chill课"]', '内容主要是 NLP 和大语言模型，方向挺实用的，以后想往 AI、LLM、文本处理走的可以考虑。平时作业不多，group project 占比也不大，整体节奏蛮舒服。唯一是平时练得少，期末复习反而要花点功夫，老师讲的东西课后得自己再消化一遍。', null, 56),
  ('COMP7810', 4, 3, 3, null, '["实用","考试难"]', '各种数据分析的应用，BI、数据仓库、OLAP、数据挖掘这些都会碰。考试难度不算大，肯背就有分，适合愿意花时间复习的人。有 group project 但占比小。缺点是平时作业和实操偏多要持续跟，考试要记的点也比较杂。', null, 55),
  ('COMP7930', 4, 4, 4, null, '["作业多","考试难"]', '大数据分析方向，讲方法和算法逻辑。好处是没有 group project。考试因人而异，有的部分挺难有的还好。作业偏多、要看的材料也多，考试更看重算法逻辑和概念，得真的理解过程，死记没用。', null, 54),
  ('COMP7640', 4, 4, 2, null, '["讲解清晰","要小组","考试难"]', '数据库系统与管理，想补数据库基础或者以后走数据、后端的很合适。平时作业挺轻松，老师讲得也清楚，有 group project。就是考试对我来说偏难，要理解的概念和计算题逻辑不少，别指望裸考。', null, 53),
  ('COMP7650', 4, 3, 4, 2, '["考试难"]', '数据挖掘、分类、聚类、关联规则、文本处理都会讲。考试相对友好，认真复习体验比想象中好。但平时作业难度偏高，给分也比较严，糊弄不过去。', null, 52),
  ('COMP7650', 4, 2, null, null, '["Chill课","实用"]', '就一个作业加一个期中，没有小组作业。内容不算难，跟着老师顺下来就行，题量大但题目简单。期末复习的时候算很轻松的一门了。', null, 51),
  ('COMP7640', 2, 5, null, null, '["考试难"]', '一个作业、没期中、有个小组作业要交 pre 视频。考试比作业难太多，证明题加计算题，计算题是真的难。想水过的话不太推荐。', null, 50),
  ('COMP7025', 3, 2, null, null, '["Chill课"]', '一个作业、没期中、两个小组作业不用 pre。期末只占 30%，而且老师会给范围，背一背就过了，不算难。', null, 49),
  ('COMP7780', 4, 3, 2, null, '["讲解清晰","干货多","考试难"]', '有期中、两个小组作业不用 pre。内容很广，作业能学得挺深，上课反而轻松，一次就一两个小时，老师人很好。考试不考代码、有点点难，范围广要背的东西不少。', null, 48),
  ('COMP7095', 2, 3, 5, null, '["作业多"]', '一个作业、五个 lab、一个小组作业要交 pre 视频。作业是真的多。期末考得不算难，但老师不划重点、内容又多，复习起来很折腾。', null, 47),
  ('COMM7020', 4, 3, null, null, '["讲解清晰"]', '偏理论的一门，一学期几个 quiz、期末闭卷。听着吓人，但跟着 Vincent 老师的节奏走基本稳稳的，别慌。', null, 46),
  ('COMM7010', 4, 2, null, null, '["Chill课"]', '也是偏理论，课上比较轻松，期末开卷。Andy 的讲课风格要稍微适应一下，但作业和考试按要求来就稳，不太会翻车。', null, 45),
  ('COMM7250', 5, 2, 3, null, '["要小组","实用"]', 'PR 课，Gloria 人超好。以实践为主，期末是模拟新闻发布会加模拟答记者问那一套。组队作业占比大，一定要找靠谱队友。', null, 44),
  ('COMM7300', 4, 3, 4, null, '["干货多","要小组"]', '偏市场营销，想做奥美那类或者对消费者方向感兴趣的很合适，课上会分享不少营销思路和案例。Royce 的课每周偏长，三个半小时，但比别的课更早结课。期末是给一家公司做课题、请嘉宾来现场打分，挺吃队友的。', null, 43),
  ('COMM7310', 5, 1, 3, null, '["Chill课","要小组"]', '课堂氛围很轻松，k k 经常组织户外活动，自愿参加。考核是几个 quiz 加个人作业加小组作业，没有笔试，整体很舒服。', null, 42),
  ('COMM7580', 4, 3, null, null, '["实用"]', '网上说这门偏难，但我自己觉得还好。没相关工作背景的话能学到些系统的东西，比如广告行业的一些黑话和传播逻辑，对以后工作有点帮助。', null, 41),
  ('COMM7910', 4, 2, null, null, '["讲解清晰","Chill课"]', '节奏对学生很友好，Lola 把大纲定得很清楚，哪个时间点该干嘛一目了然，跟着做就行。', null, 40),
  ('COMM7060', 3, 2, 3, null, '["点名严"]', '两学期下来唯一一位会每节课随机分组的老师。没考试，按课题在课上规定时间内赶一份 ppt 然后汇报，Raymond 当场记录每个人表现还给建议。我个人觉得评分标准不太透明，对出勤也卡得挺紧。', null, 39),
  ('AIDM7480', 3, 2, 3, null, '["要小组"]', '日常基本是跟助教对接。整学期就是跟着小组完成一份论文，保过但不太好拿高分，想冲绩点的要有心理准备。', null, 38),
  ('COMP7180', 3, 4, null, null, '["考试难"]', '期末 Prof Liu 负责的 Part A 偏难，Dr Ma 的 Part B 知识点多但给分偏稳。期中第一次是 Prof Liu 的风格、偏难；第二次跟着 ppt 好好复习就没问题，计算题多一些。Dr Ma 那部分体验不错。', null, 37),
  ('COMP7015', 4, 4, null, null, '["考试难"]', '期末覆盖面广、知识点多，但不会因为一个点不会就丢一大片分，所以复习得全面、重理解，花的时间会长一些。期中还挺难的，带代码的题不少。', null, 36),
  ('COMP7035', 4, 3, null, null, '["讲解清晰"]', '期末跟着 Dr Zhang 的总结能拿到不少基础分，剩下的看个人能力，有代码题。期中代码题不多，更多是考对输出结果的判断，也就是对代码的理解。', null, 35),
  ('COMP7990', 4, 3, null, null, '["考试难"]', '期末偏技术、量不小，计算加简答，覆盖面广，SQL 由浅入深。把 ppt 上的知识点学会基本能 pass。我自己留给它的复习时间最少，主要是跟 AI 那门考试挨太近了。期中按老师给的复习题准备就能应对。', null, 34),
  ('COMP7950', 4, 2, 2, null, '["Chill课"]', '一次个人作业、一次小组作业，保证完成就行，挺轻松的。', null, 33),
  ('COMP7095', 4, 4, 4, 3, '["作业多","讲解清晰"]', 'Dr. Henery 应该是内地来的老师，人很儒雅，交流起来也轻松。课程内容听着挺有难度的，作业比别的课多那么一点点，而且还有 lab。好像没有期中，期末的复习资料给得比较多，给分中规中矩。', null, 32),
  ('COMP7095', 4, 4, 4, 3, '["作业多","讲解清晰"]', '課有點難度，作業偏多還有 lab，不過沒期中，期末複習資料給超足。Dr. Henery 人很斯文好相處，給分中規中矩。', null, 31),
  ('COMP7095', 4, 4, 4, 3, '["作业多","讲解清晰"]', 'Bit of a tough one, more homework than usual and labs too, but no midterm and he hands out loads of revision material. Henery''s a soft-spoken, friendly guy. Grading''s just average.', null, 30),
  ('COMP7810', 4, 3, 4, 4, '["作业多","给分高","讲解清晰"]', 'Dr. Wilson 英语很好，是香港人，不过在国外（好像是牛津）待了很久，所以他讲课英语特别清晰、好懂。就是 lab 偏多！不过都是有指引的那种，照着步骤一步步走问题不大，只是一直有任务压着，体验感一般。期末给分倒是挺大方的。', null, 29),
  ('COMP7810', 4, 3, 4, 4, '["作业多","给分高","讲解清晰"]', 'lab 有夠多，還好都有指引跟著做就行，就是一直有東西要交。Dr. Wilson 英文超清楚（香港人但在牛津待過很久），期末給分很佛。', null, 28),
  ('COMP7810', 4, 3, 4, 4, '["作业多","给分高","讲解清晰"]', 'So many labs, but they''re all guided so just follow along, you''ve just always got something due. Wilson''s English is super clear (local guy, was at Oxford for ages) and he''s generous with the final.', null, 27),
  ('COMP7540', 5, 3, null, null, '["讲解清晰","实用"]', 'Dr. Kristen 的课不用多说，课堂互动特别多，老师讲得有意思，英语也好。顺带一提，她是我见过一口气能不停说英语最久的老师，几乎没有停顿和思考，顺得不行。如果上过她上学期的课，考试内容会很相似、大差不差。比较推荐喜欢她这种风格、又能接受商科内容偏多的同学。', null, 26),
  ('COMP7540', 5, 3, null, null, '["讲解清晰","实用"]', '互動超多、講得有趣，她英文好到能一口氣不停講都不卡的程度。上過她上學期的課考試會很眼熟。喜歡她風格、不介意偏商科內容的會喜歡。', null, 25),
  ('COMP7540', 5, 3, null, null, '["讲解清晰","实用"]', 'Tons of interaction, fun lectures, and her English is unreal, talks nonstop without pausing. If you had her last sem the exam feels familiar. Great if you like her style and don''t mind business-y content.', null, 24),
  ('COMP7640', 4, 4, null, null, '["考试难","讲解清晰"]', 'P 姐是个挺有人格魅力的老师，对学生特别好，鼓励式教育在她身上体现得很明显。上学期不少人期中没考好，她后面还帮大家找补分的机会，再带着把知识点巩固一遍。说回这门课，内容不算难，要是你之前有计算机或者数据库的底子，上起来会比较轻松。但期末考真的不简单，很多人都很疑惑——上学期出的期末明明那么温和，这学期难度明显上去了。', null, 23),
  ('COMP7640', 4, 4, null, null, '["考试难","讲解清晰"]', '內容不難，有點 CS／資料庫底子很好上手，但期末突然變超難，大家都嚇到。P 姐很有魅力、對學生超好，期中考爛還會給補分機會。', null, 22),
  ('COMP7640', 4, 4, null, null, '["考试难","讲解清晰"]', 'Content''s easy if you''ve got some CS/database background, but the final suddenly got brutal and caught everyone off guard. P''s super charismatic and great to students, even gave make-up marks after a rough midterm.', null, 21),
  ('COMP7780', 5, 2, null, null, '["Chill课","讲解清晰"]', 'Hans 是我见过最随和、最自由、最有魅力的老师！！上他的课特别有意思，英文也特别好、很清晰。老师年纪比较大了，听说教完我们这届就要退休，可惜以后的学弟学妹没机会领略 Hans 的幽默了。考试相对也算简单，稍微复习一下就能答出大部分题。', null, 20),
  ('COMP7780', 5, 2, null, null, '["Chill课","讲解清晰"]', 'Hans 超隨和又有魅力，課很有趣、英文清楚。考試不難，稍微複習就 ok。聽說教完我們這屆他就退休了，有點可惜。', null, 19),
  ('COMP7780', 5, 2, null, null, '["Chill课","讲解清晰"]', 'Hans is super chill and charismatic, fun class, clear English. Exam''s easy, just a bit of revision. Heard he retires after our batch though, shame.', null, 18),
  ('COMP7530', 4, 1, 2, 5, '["Chill课","给分高","实用"]', '听 5 场 talk、挑 2 场写 report（每篇不超 2 页）。内容有机器人、AI、AWS、资安这些，能跟一下 AI 趋势。课后强制 comment 算变相点名，分超好拿。ITM sem 2 跑不掉的一门，我去主要是下课正好去健身哈哈。', null, 17),
  ('COMP7530', 4, 1, 2, 5, '["Chill课","给分高","实用"]', 'IT Forum 就是去聽五場客座講者的 talk，然後挑其中兩場寫 report，格式沒規定，但一篇不能超過兩頁。題目什麼機械人、AI、AWS、資安都有，多少能知道一下最近 AI 在紅什麼，所以我還是建議去聽一下。每場大概兩個鐘，聽完還要強制留 comment，算是另一種點名吧，分數超好拿。ITM sem 2 基本上躲不掉這門。其實我最大的動力是——下課剛好可以直接去 gym。', null, 16),
  ('COMP7530', 4, 1, 2, 5, '["Chill课","给分高","实用"]', 'Five talks, pick two to write reports on (two pages max each). Topics like robotics, AI, AWS, cybersecurity, decent for keeping up with AI trends. Mandatory comment after = sneaky attendance, super easy marks. Can''t dodge it in ITM sem 2. Tbh I went cause the gym was right after lol.', null, 15),
  ('COMP7125', 5, 3, 3, 5, '["实用","给分高","讲解清晰"]', 'sem 2 我唯一喜欢的课。非 CS 出身一开始 lab 有点吃力，后面就还好，10 节 lab 认真做基本满分。讲 AI 原理、调参，还教本地 deploy 大模型，group project 挺实用。期中有冷门公式题，期末一道 code 题不难。结果是我分最高、复习最少的一科，挺意外。5 星。', null, 14),
  ('COMP7125', 5, 3, 3, 5, '["实用","给分高","讲解清晰"]', 'sem 2 我唯一真心喜歡的就是 COMP7125 Prompt Engineering for Generative AI 了。我不是 CS 出身，所以一開始那幾節 lab 上得有夠痛苦，後來熟了就還好。總共十節 lab，基本上你有去做、方向沒跑掉就是滿分。老師口音很標準，聽得很輕鬆。內容大概就是講 AI 怎麼發展起來的、原理是什麼，怎麼有效率地調參數，還會教你把大模型 deploy 到自己本機。group project 是做一個跑在本地模型上的學習系統，蠻實用的。考試的話，期中藏了幾題公式題，算偏冷門的考點；期末有一題 coding，但不難，我沒複習 code 都猜得到答案。期末是比期中難一點啦，但最後這科居然是我分數最高、複習時間又最少的一科，我自己都嚇到。5 星。', null, 13),
  ('COMP7125', 5, 3, 3, 5, '["实用","给分高","讲解清晰"]', 'The only course I liked in sem 2. Not from CS so the labs were rough at first then fine, do all ten and it''s basically full marks. Covers AI principles, parameter tuning, even local LLM deployment, and the group project''s useful. Midterm has some niche formula questions, final has one easy coding one. Somehow my best grade with the least revision, go figure. 5 stars.', null, 12),
  ('COMP7780', 5, 2, 2, 4, '["Chill课","要小组","给分高"]', '想轻松必选，Hans 人超好。讲网页、app 开发流程，group project 两个 assignment 不难。期中超轻松，期末没 code、就四道大题，背了不会 fail。A 有名额限制但其他都尽量给 B。5 星。', null, 11),
  ('COMP7780', 5, 2, 2, 4, '["Chill课","要小组","给分高"]', '想找輕鬆的課這門絕對首選，Hans 教授人有夠好。他本來說 2026 是帶我們的最後一屆，後來聊了一下好像 2027 才是。課大概就圍繞網頁、app 那些開發流程在講。group project 拆成兩個 assignment，整體不難，就是模擬一個真實 project 怎麼跑；老實說我一開始也是稀里糊塗就開始做了，但結果意外地滿意，超級感謝隊友帶飛。考試有期中，期中輕鬆到不行；期末沒有 coding，就四道大題，不難，肯背就絕對不會 fail，A 的名額有限制，但其他人 Hans 基本都會盡量給到 B。5 星。', null, 10),
  ('COMP7780', 5, 2, 2, 4, '["Chill课","要小组","给分高"]', 'Pick this if you want easy, Hans is the nicest. Covers web/app dev workflow, group project''s two assignments, not hard. Midterm''s a breeze, final''s four long questions, no code, memorise and you won''t fail. A''s are capped but he gives everyone else a B. 5 stars.', null, 9),
  ('COMP7650', 3, 4, 3, 2, '["考试难","讲解清晰"]', 'Professor 的口音可能一開始需要適應一下，但他備課很認真，講得也不錯，每節課都準備了 tutorial 給我們練習。因為不想背書，所以我選了這一門課。上一屆師兄師姐說學得很難、考也不簡單，但是分數不低，我就選了。課程內容有一部分跟上學期 kelvin 的課重疊，總體感覺不是很怎樣。沒有 group project，這也是我選他課的原因。考試有期中考試，1 個小時，肯定寫不完的，我期中考了 69 分。期末題量也有一點大，我考的時候算了下自己保底 70 分+，心想很大可能拿 A- 以上了，自信滿滿。結果成績出來的時候，是我兩個 sem 所有學科裡面最低分的 B-。不知道是別人太厲害，還是有刻意壓分。推薦程度 3 星。', null, 8),
  ('COMP7650', 3, 4, 3, 2, '["考试难","讲解清晰"]', '选它因为不想背书，也没 group project。Prof 口音要适应一下但备课认真、每节有 tutorial，内容跟上学期 Kelvin 的课有点重叠。期中一小时根本写不完（我 69）。期末我估保底 70+ 觉得稳上 A-，结果出来是两个 sem 最低的 B-，不知道是被压分还是别人太强。3 星。', null, 7),
  ('COMP7650', 3, 4, 3, 2, '["考试难","讲解清晰"]', 'Picked it cause I didn''t wanna memorise and there''s no group project. Prof''s accent takes some getting used to but he preps well, tutorial every class, some overlap with Kelvin''s course. One-hour midterm you can''t finish (got 69). Was sure I''d cleared 70+ on the final and locked an A-, then got a B-, my lowest in two sems. Deflation or everyone''s just cracked, who knows. 3 stars.', null, 6),
  ('COMP7095', 3, 5, 3, null, '["考试难","要小组"]', '分兩個 professor 去教，反正全程聽到腦殼疼。也是聽上一屆師兄師姐說的，雖然學得很難，但考得很簡單，考的內容跟作業原題差不多。可能這些話被 professors 知道了，我們這一屆直接被往死裡整。課程內容就是各種處理 big data 的工具和原理介紹，實際上太難了。group project 有一個，給了範圍自己選題目去做，不需要 in person presentation，是錄 video，total 5 分鐘，很輕鬆愉快的 group project。考試 Fxxking 難，不會就是不會，那種寫不完的；有代碼題，而且我們這一年的並不是原題。推薦程度 3 星。', null, 5),
  ('COMP7095', 3, 5, 3, null, '["考试难","要小组"]', '两个 professor 教，全程听到脑壳疼。师兄说往年学得难考得简单，结果被听去了，我们这届直接被整惨。内容是 big data 各种工具和原理，太难。group project 给范围自选题、录 5 分钟 video，超轻松。考试是真的难，写不完，还有 code 题、还不是原题。3 星。', null, 4),
  ('COMP7095', 3, 5, 3, null, '["考试难","要小组"]', 'Two profs, my head hurt the whole time. Seniors said it used to be hard to learn but easy to test, profs found out and wrecked our batch. Content''s big data tools and theory, way too hard. Group project''s a 5-min video on a topic you pick, super chill. Exam''s brutal, can''t finish it, coding question and not from past papers. 3 stars.', null, 3),
  ('COMP7640', 4, 5, 3, null, '["考试难","要小组","讲解清晰"]', 'Poline 姐的課，一如往常很認真備課，人很熱情，也很在乎互動，課上會經常拋問題，不過不會硬逼你回答。總之人非常 nice，是那種很認真打磨自己教學的 professor。課程內容涵蓋 ER 模型、關係模型、SQL、函數依賴、範式、索引、查詢優化、事務與故障恢復這些核心知識。group project 是有的，對格式要求高一點，但整體還算容易過。考試是我兩個 sem 裡唯一一個地獄難度的——本來內容就廣、又不好學，而且學的跟考的還不太一樣，題量也大到誇張，是唯一一科考完幾乎沒人提前交卷的。給 4 星，主要是因為我自己也拿了不錯的成績，再加上秉著「我不會別人也不會」的心態，考完心情才平復下來。', null, 2),
  ('COMP7640', 4, 5, 3, null, '["考试难","要小组","讲解清晰"]', 'Poline 姐备课认真、热情、爱互动，但不会硬点你。内容是 ER 模型、SQL、范式、索引、查询优化、事务恢复那些。有 group project，格式要求高但好过。考试是我两个 sem 唯一的地狱难度，又广又难、学的跟考的还不一样，几乎没人提前交卷。给 4 星主要因为自己分还不错，靠『我不会别人也不会』撑过来的。', null, 1),
  ('COMP7640', 4, 5, 3, null, '["考试难","要小组","讲解清晰"]', 'Poline preps hard, super enthusiastic, loves interaction but won''t put you on the spot. Covers ER models, SQL, normal forms, indexing, query optimisation, transactions. Group project''s strict on format but easy to pass. The exam''s the one hell-tier paper of my two sems, broad, hard, and not quite what you studied, nobody finished early. 4 stars, mostly cause I did ok and the ''if I don''t get it nobody does'' mindset got me through.', null, 1)
) as v(code, rating, difficulty, workload, grading, tags, content, semester, days_ago)
where not exists (
  select 1 from course_reviews cr
  where cr.course_id = (select id from courses where code = v.code order by created_at asc limit 1)
    and cr.content = v.content
);

-- 3) 重算课程平均分与评价数
update courses c set rating = s.avg_rating, review_count = s.cnt
from (
  select course_id, round(avg(rating)::numeric, 1)::float as avg_rating, count(*) as cnt
  from course_reviews
  where course_id in (select id from courses where code in ('COMP7045', 'COMP7810', 'COMP7930', 'COMP7640', 'COMP7650', 'COMP7025', 'COMP7780', 'COMP7095', 'COMM7020', 'COMM7010', 'COMM7250', 'COMM7300', 'COMM7310', 'COMM7580', 'COMM7910', 'COMM7060', 'AIDM7480', 'COMP7180', 'COMP7015', 'COMP7035', 'COMP7990', 'COMP7950', 'COMP7540', 'COMP7530', 'COMP7125'))
  group by course_id
) s where c.id = s.course_id;
