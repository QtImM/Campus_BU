/**
 * seed_reviews_sql.ts — 从 data/seed_reviews/course_reviews.csv 生成可直接粘进
 * Supabase SQL Editor 的 INSERT 语句(不需要 service role key)。
 *
 * 用法: npx tsx scripts/seed_reviews_sql.ts
 * 输出: data/seed_reviews/course_reviews.sql(同时打印到终端)
 *
 * 生成的 SQL 会:
 *  1) 插入若干匿名种子作者(users，无外键，仅为数据干净)
 *  2) 对每个不存在的课程代码建最小 courses 行(id=code，避免重复)
 *  3) 插入评价(course_id 解析到课程 id，is_anonymous=true，时间分散到过去 8 周)
 *  4) 重算涉及课程的平均分与评价数
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_DIR = path.resolve(__dirname, '../data/seed_reviews');

// ── CSV 解析(支持引号包裹、字段内逗号/换行、"" 转义)──
function parseCsv(text: string): Record<string, string>[] {
    const rows: string[][] = [];
    let field = '', inQuotes = false;
    let row: string[] = [];
    const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (inQuotes) {
            if (c === '"') { if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
            else field += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && src[i + 1] === '\n') i++;
            row.push(field); field = ''; rows.push(row); row = [];
        } else field += c;
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    const ne = rows.filter(r => r.some(c => c.trim() !== ''));
    if (!ne.length) return [];
    const header = ne[0].map(h => h.trim());
    return ne.slice(1).map(cells => {
        const o: Record<string, string> = {};
        header.forEach((h, i) => { o[h] = (cells[i] ?? '').trim(); });
        return o;
    });
}

const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;
const sqlNum = (s: string) => (s.trim() === '' ? 'null' : String(parseInt(s, 10)));
const normalizeCode = (c: string) => c.toUpperCase().replace(/\s+/g, '');
const parseTags = (s: string) => (s || '').split(';').map(t => t.trim()).filter(Boolean);

function spreadDays(i: number, n: number): number {
    if (n <= 1) return 1;
    return Math.max(1, Math.round(56 - (i / (n - 1)) * 56));
}

function main() {
    const csvPath = path.join(SEED_DIR, 'course_reviews.csv');
    const rows = parseCsv(fs.readFileSync(csvPath, 'utf-8')).filter(r => normalizeCode(r.course_code));
    if (!rows.length) { console.error('没有可用的课程评价行'); process.exit(1); }

    const codes = Array.from(new Set(rows.map(r => normalizeCode(r.course_code))));

    // code → 课程名(取该 code 第一条非空 course_name；没有就用 code 本身)
    const nameByCode = new Map<string, string>();
    for (const r of rows) {
        const code = normalizeCode(r.course_code);
        const nm = (r.course_name || '').trim();
        if (nm && !nameByCode.has(code)) nameByCode.set(code, nm);
    }

    const out: string[] = [];
    out.push('-- 自动生成: 评价种子导入 (粘贴到 Supabase SQL Editor 执行)');
    out.push('-- 由 scripts/seed_reviews_sql.ts 从 course_reviews.csv 生成\n');

    // 注:不创建 users 行。public.users.id 外键指向 auth.users，无法塞自造 UUID；
    // 而 course_reviews.author_id 无外键 + 读取是 left join，匿名评价用任意 UUID 即可。

    // 0) 先清掉之前导入的种子评价，再重新插入当前 CSV 版本（可反复重导，不会与旧内容重复）
    out.push('-- 0) 清掉之前导入的种子评价后重插当前版本。');
    out.push('--    只删匿名种子行(author_id 为空 且 作者名="匿名同学")——真实用户评价 author_id 不为空，不受影响。');
    out.push('delete from course_reviews');
    out.push("where author_id is null and author_name = '匿名同学'");
    out.push(`  and course_id in (select id from courses where code in (${codes.map(sqlStr).join(', ')}));\n`);

    // 1) 确保课程存在
    out.push('-- 1) 缺失的课程建最小行(id=code，name 用 CSV 课程名，仅当该 code 不存在)');
    out.push('insert into courses (id, code, name, credits)');
    out.push('select code, code, name, 3 from (values');
    out.push(codes.map(c => `  (${sqlStr(c)}, ${sqlStr(nameByCode.get(c) ?? c)})`).join(',\n'));
    out.push(') as t(code, name)');
    out.push('where not exists (select 1 from courses c where c.code = t.code);\n');

    // 2) 插入评价
    out.push('-- 2) 插入评价(course_id 解析到课程 id)');
    out.push('insert into course_reviews');
    out.push('  (course_id, author_id, author_name, author_avatar, rating, difficulty, workload, grading, tags, content, semester, is_anonymous, created_at)');
    out.push('select');
    out.push('  (select id from courses where code = v.code order by created_at asc limit 1),');
    out.push("  null, '匿名同学', null,");
    out.push('  v.rating::int, v.difficulty::int, v.workload::int, v.grading::int,');
    out.push("  v.tags::jsonb, v.content, v.semester, true,");
    out.push("  now() - (v.days_ago || ' days')::interval");
    out.push('from (values');
    const valueRows = rows.map((r, i) => {
        const code = normalizeCode(r.course_code);
        const tags = JSON.stringify(parseTags(r.tags));
        const semester = r.semester?.trim() ? sqlStr(r.semester.trim()) : 'null';
        return `  (${sqlStr(code)}, ${sqlNum(r.rating)}, ${sqlNum(r.difficulty)}, ${sqlNum(r.workload)}, ${sqlNum(r.grading)}, ${sqlStr(tags)}, ${sqlStr(r.content)}, ${semester}, ${spreadDays(i, rows.length)})`;
    });
    out.push(valueRows.join(',\n'));
    out.push(') as v(code, rating, difficulty, workload, grading, tags, content, semester, days_ago)');
    // 幂等保护:同一课程下已存在完全相同正文的评价则跳过,整段 SQL 可反复运行不重复
    out.push('where not exists (');
    out.push('  select 1 from course_reviews cr');
    out.push('  where cr.course_id = (select id from courses where code = v.code order by created_at asc limit 1)');
    out.push('    and cr.content = v.content');
    out.push(');\n');

    // 3) 重算统计
    out.push('-- 3) 重算课程平均分与评价数');
    out.push('update courses c set rating = s.avg_rating, review_count = s.cnt');
    out.push('from (');
    out.push('  select course_id, round(avg(rating)::numeric, 1)::float as avg_rating, count(*) as cnt');
    out.push('  from course_reviews');
    out.push(`  where course_id in (select id from courses where code in (${codes.map(sqlStr).join(', ')}))`);
    out.push('  group by course_id');
    out.push(') s where c.id = s.course_id;');

    const sql = out.join('\n') + '\n';
    const outPath = path.join(SEED_DIR, 'course_reviews.sql');
    fs.writeFileSync(outPath, sql, 'utf-8');
    console.log(sql);
    console.error(`\n✅ 已写入 ${outPath}（共 ${rows.length} 条评价，${codes.length} 门课）`);
}

main();
