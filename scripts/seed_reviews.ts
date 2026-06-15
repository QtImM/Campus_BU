/**
 * seed_reviews.ts — 批量导入真实课程/老师评价，用于冷启动铺内容。
 *
 * 用法:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/seed_reviews.ts [--dry-run]
 *
 * 数据来源: data/seed_reviews/course_reviews.csv + teacher_reviews.csv
 * 详见 data/seed_reviews/README.md（含填写规则与"只填真实评价"铁律）。
 *
 * 脚本职责:
 *  - 解析两个 CSV（支持带引号、含逗号/换行的字段）
 *  - 校验每行（评分 1-5、必填项、标签）
 *  - 解析 course_code → courses.id（缺失则用 course_name 创建最小行）
 *  - 解析 teacher_name → teachers.id（匹配不上则跳过并提示）
 *  - 以匿名种子作者写入，created_at 分散到过去 8 周
 *  - 写完重算每门课/每位老师的平均分与评价数
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL =
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || 'https://fcbsekidlijtidqzkddx.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

const DRY_RUN = process.argv.includes('--dry-run');
const SEED_DIR = path.resolve(__dirname, '../data/seed_reviews');

// 评价匿名显示，author_id 设为 null：course_reviews.author_id 外键指向 users，
// 而 users.id 又指向 auth.users，无法塞自造 UUID；null 不触发外键，读取是 left join。

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// ── CSV 解析（RFC4180 风格：支持双引号包裹、字段内逗号/换行、"" 转义）──────────
function parseCsv(text: string): Record<string, string>[] {
    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    // 去掉可能的 UTF-8 BOM
    const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (inQuotes) {
            if (c === '"') {
                if (src[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ',') {
            row.push(field); field = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && src[i + 1] === '\n') i++;
            row.push(field); field = '';
            rows.push(row); row = [];
        } else {
            field += c;
        }
    }
    // 末尾未换行的最后一行
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

    const nonEmpty = rows.filter(r => r.some(cell => cell.trim() !== ''));
    if (nonEmpty.length === 0) return [];

    const header = nonEmpty[0].map(h => h.trim());
    return nonEmpty.slice(1).map(cells => {
        const obj: Record<string, string> = {};
        header.forEach((h, idx) => { obj[h] = (cells[idx] ?? '').trim(); });
        return obj;
    });
}

function readCsv(file: string): Record<string, string>[] {
    const p = path.join(SEED_DIR, file);
    if (!fs.existsSync(p)) {
        console.warn(`⚠️  未找到 ${file}，跳过。`);
        return [];
    }
    return parseCsv(fs.readFileSync(p, 'utf-8'));
}

// ── 校验辅助 ──────────────────────────────────────────────────────────────────
function parseScore(raw: string, field: string, required: boolean, errors: string[]): number | null {
    const s = (raw || '').trim();
    if (!s) {
        if (required) errors.push(`${field} 必填`);
        return null;
    }
    const n = Number(s);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
        errors.push(`${field} 必须是 1-5 的整数（当前: "${s}"）`);
        return null;
    }
    return n;
}

function parseTags(raw: string): string[] {
    return (raw || '')
        .split(';')
        .map(t => t.trim())
        .filter(Boolean);
}

const normalizeCode = (code: string) => (code || '').toUpperCase().replace(/\s+/g, '');

// created_at 分散到过去 8 周，按序号决定性偏移（不引入随机，便于复现）
function spreadCreatedAt(index: number, total: number): string {
    const windowDays = 56;
    const offsetDays = total <= 1 ? 0 : (index / (total - 1)) * windowDays;
    return new Date(Date.now() - (windowDays - offsetDays) * ONE_DAY_MS).toISOString();
}

// 注：不创建 users 行。public.users.id 外键指向 auth.users，无法塞自造 UUID；
// course_reviews.author_id 无外键 + 读取是 left join，匿名评价用任意 UUID 即可。

// ── 课程评价导入 ──────────────────────────────────────────────────────────────
async function seedCourseReviews(supabase: SupabaseClient): Promise<void> {
    const rows = readCsv('course_reviews.csv');
    if (rows.length === 0) { console.log('📘 course_reviews.csv 无数据。'); return; }

    console.log(`\n📘 课程评价: 读到 ${rows.length} 行`);
    let ok = 0, skipped = 0;
    const touchedCourseIds = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const errors: string[] = [];
        const code = normalizeCode(r.course_code);
        if (!code) errors.push('course_code 必填');
        const rating = parseScore(r.rating, 'rating', true, errors);
        const difficulty = parseScore(r.difficulty, 'difficulty', true, errors);
        const workload = parseScore(r.workload, 'workload', false, errors);
        const grading = parseScore(r.grading, 'grading', false, errors);
        const content = (r.content || '').trim();
        if (!content) errors.push('content 必填');

        if (errors.length) {
            console.warn(`  ⏭️  第 ${i + 1} 行跳过 [${r.course_code}]: ${errors.join('; ')}`);
            skipped++; continue;
        }

        // 解析课程: 先按 code 查 courses；缺失则用 course_name 创建最小行
        let courseId: string | null = null;
        const { data: existing } = await supabase
            .from('courses').select('id').eq('code', code).maybeSingle();
        if (existing?.id) {
            courseId = existing.id;
        } else if (!DRY_RUN) {
            const { data: created, error: createErr } = await supabase
                .from('courses')
                .insert({ id: code, code, name: r.course_name?.trim() || code, credits: 3 })
                .select('id').single();
            if (createErr || !created) {
                console.warn(`  ⏭️  第 ${i + 1} 行跳过: 课程 ${code} 创建失败 (${createErr?.message})`);
                skipped++; continue;
            }
            courseId = created.id;
        } else {
            courseId = code; // dry-run 占位
        }

        const payload = {
            course_id: courseId,
            author_id: null,
            author_name: '匿名同学',
            author_avatar: null,
            rating,
            difficulty,
            workload,
            grading,
            tags: parseTags(r.tags),
            content,
            semester: r.semester?.trim() || null,
            is_anonymous: true,
            created_at: spreadCreatedAt(i, rows.length),
        };

        if (DRY_RUN) {
            console.log(`  ✓ [dry] ${code} ★${rating} 难${difficulty} "${content.slice(0, 20)}…"`);
            ok++; continue;
        }

        const { error: insErr } = await supabase.from('course_reviews').insert(payload);
        if (insErr) {
            console.warn(`  ⏭️  第 ${i + 1} 行写入失败 [${code}]: ${insErr.message}`);
            skipped++; continue;
        }
        if (courseId) touchedCourseIds.add(courseId);
        ok++;
    }

    // 重算被写入课程的统计（平均分 + 评价数）
    if (!DRY_RUN) {
        for (const cid of touchedCourseIds) {
            const { data: ratings } = await supabase
                .from('course_reviews').select('rating').eq('course_id', cid).not('rating', 'is', null);
            if (ratings && ratings.length) {
                const avg = ratings.reduce((a, c) => a + (c.rating || 0), 0) / ratings.length;
                await supabase.from('courses')
                    .update({ rating: parseFloat(avg.toFixed(1)), review_count: ratings.length })
                    .eq('id', cid);
            }
        }
    }

    console.log(`📘 课程评价完成: 导入 ${ok}, 跳过 ${skipped}, 涉及课程 ${touchedCourseIds.size} 门`);
}

// ── 老师评价导入 ──────────────────────────────────────────────────────────────
async function seedTeacherReviews(supabase: SupabaseClient): Promise<void> {
    const rows = readCsv('teacher_reviews.csv');
    if (rows.length === 0) { console.log('📗 teacher_reviews.csv 无数据。'); return; }

    console.log(`\n📗 老师评价: 读到 ${rows.length} 行`);
    let ok = 0, skipped = 0;
    const touchedTeacherIds = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const errors: string[] = [];
        const name = (r.teacher_name || '').trim();
        if (!name) errors.push('teacher_name 必填');
        const rating = parseScore(r.rating, 'rating', true, errors);
        const difficulty = parseScore(r.difficulty, 'difficulty', true, errors);
        const clarity = parseScore(r.clarity, 'clarity', false, errors);
        const workload = parseScore(r.workload, 'workload', false, errors);
        const content = (r.content || '').trim();
        if (!content) errors.push('content 必填');

        if (errors.length) {
            console.warn(`  ⏭️  第 ${i + 1} 行跳过 [${name}]: ${errors.join('; ')}`);
            skipped++; continue;
        }

        // 解析老师: 按姓名不区分大小写匹配；匹配不上 / 多个则跳过
        const { data: matches } = await supabase
            .from('teachers').select('id, name').ilike('name', name);
        if (!matches || matches.length === 0) {
            console.warn(`  ⏭️  第 ${i + 1} 行跳过: 教师名册里找不到 "${name}"`);
            skipped++; continue;
        }
        if (matches.length > 1) {
            console.warn(`  ⏭️  第 ${i + 1} 行跳过: "${name}" 匹配到 ${matches.length} 位老师，请用更精确的姓名`);
            skipped++; continue;
        }
        const teacherId = matches[0].id;

        const payload = {
            teacher_id: teacherId,
            author_id: null,
            author_name: '匿名的同学',
            author_avatar: null,
            rating,
            difficulty,
            clarity,
            workload,
            tags: parseTags(r.tags),
            content,
            created_at: spreadCreatedAt(i, rows.length),
        };

        if (DRY_RUN) {
            console.log(`  ✓ [dry] ${name} ★${rating} "${content.slice(0, 20)}…"`);
            ok++; continue;
        }

        const { error: insErr } = await supabase.from('teacher_reviews').insert(payload);
        if (insErr) {
            console.warn(`  ⏭️  第 ${i + 1} 行写入失败 [${name}]: ${insErr.message}`);
            skipped++; continue;
        }
        touchedTeacherIds.add(teacherId);
        ok++;
    }

    // 重算老师统计（平均分 + 评价数 + 聚合标签）
    if (!DRY_RUN) {
        for (const tid of touchedTeacherIds) {
            const { data: revs } = await supabase
                .from('teacher_reviews').select('rating, tags').eq('teacher_id', tid);
            if (revs && revs.length) {
                const rated = revs.filter(v => typeof v.rating === 'number');
                const avg = rated.length
                    ? rated.reduce((a, c) => a + (c.rating || 0), 0) / rated.length
                    : 0;
                const tagCount: Record<string, number> = {};
                for (const v of revs) for (const t of (Array.isArray(v.tags) ? v.tags : [])) {
                    tagCount[t] = (tagCount[t] || 0) + 1;
                }
                const topTags = Object.entries(tagCount)
                    .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
                await supabase.from('teachers')
                    .update({ rating_avg: parseFloat(avg.toFixed(1)), review_count: revs.length, tags: topTags })
                    .eq('id', tid);
            }
        }
    }

    console.log(`📗 老师评价完成: 导入 ${ok}, 跳过 ${skipped}, 涉及老师 ${touchedTeacherIds.size} 位`);
}

async function main() {
    if (!SERVICE_ROLE_KEY) {
        console.error('❌ 缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量。');
        console.error('   用法: SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/seed_reviews.ts [--dry-run]');
        process.exit(1);
    }

    console.log(`🌱 评价种子导入 ${DRY_RUN ? '(DRY RUN — 不写库)' : ''}`);
    console.log(`   目标: ${SUPABASE_URL}`);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    await seedCourseReviews(supabase);
    await seedTeacherReviews(supabase);

    console.log('\n✅ 完成。');
}

main().catch(err => { console.error('💥 导入失败:', err); process.exit(1); });
