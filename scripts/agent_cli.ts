import * as dotenv from 'dotenv';
import * as path from 'path';
import Module from 'module';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { getAgentCacheStats } from '../services/agent/cache';
import { AGENT_CONFIG } from '../services/agent/config';
import { classifyIntent } from '../services/agent/router';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const stubRoot = path.resolve(process.cwd(), 'scripts/stubs');
const stubMap: Record<string, string> = {
    'react-native': path.join(stubRoot, 'react-native.ts'),
    '../auth': path.join(stubRoot, 'auth.ts'),
    '../schedule': path.join(stubRoot, 'schedule.ts'),
    '../teaming': path.join(stubRoot, 'teaming.ts'),
};

const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function patchedResolveFilename(request: string, parent: unknown, isMain: boolean, options: unknown) {
    if (stubMap[request]) {
        return stubMap[request];
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
};

const printDivider = () => {
    console.log('\n' + '-'.repeat(72));
};

const formatStep = (step: any, index: number) => {
    const parts = [`[${index + 1}]`];
    if (step.path) parts.push(`path=${step.path}`);
    if (step.modelTier) parts.push(`tier=${step.modelTier}`);
    if (step.modelName) parts.push(`model=${step.modelName}`);
    if (step.routeReason) parts.push(`route=${step.routeReason}`);
    if (step.thought) parts.push(`thought=${step.thought}`);
    if (step.action?.tool) parts.push(`tool=${step.action.tool}`);
    if (step.observation) parts.push(`observation=${String(step.observation).slice(0, 160)}`);
    if (step.reply) parts.push(`reply=${String(step.reply).slice(0, 160)}`);
    return parts.join(' | ');
};

const summarizeDebugFlags = (steps: any[]) => {
    const hasPath = (path: string) => steps.some(step => step.path === path);
    return {
        localRuleHit: hasPath('local_rule'),
        stableTaskHit: hasPath('stable_task'),
        cacheHit: hasPath('cache'),
        pendingFlowHit: hasPath('pending'),
        intentRouteHit: hasPath('intent_route'),
        llmHit: hasPath('llm'),
    };
};

async function main() {
    const args = process.argv.slice(2);
    const userIdArg = args.find(arg => arg.startsWith('--user='));
    const promptArg = args.find(arg => arg.startsWith('--prompt='));
    const rl = readline.createInterface({ input, output });
    const userId = userIdArg ? userIdArg.replace('--user=', '') : 'cli-test-user';
    const oneShotPrompt = promptArg ? promptArg.replace('--prompt=', '') : '';
    const { AgentExecutor } = await import('../services/agent/executor');
    const executor = new AgentExecutor(userId);

    console.log('Agent CLI 调试模式');
    console.log('输入问题后回车。输入 /exit 退出，/stats 查看缓存统计。');
    console.log(`当前 userId: ${userId}`);
    console.log('当前模型配置:', {
        fast: AGENT_CONFIG.FAST_MODEL,
        reasoning: AGENT_CONFIG.REASONING_MODEL,
        deepseekEnabled: AGENT_CONFIG.DEEPSEEK_ENABLED,
    });

    const runPrompt = async (prompt: string) => {
        const routeDecision = classifyIntent(prompt);
        printDivider();
        console.log('意图预判:', routeDecision);

        let streamed = false;
        const response = await executor.process(prompt, (text) => {
            if (!streamed) {
                console.log('\n流式输出:');
                streamed = true;
            }
            output.write(`\r${text}`);
        });

        if (streamed) {
            output.write('\n');
        }

        printDivider();
        console.log('最终回答:');
        console.log(response.finalAnswer || '(empty)');

        printDivider();
        console.log('步骤:');
        if (response.steps.length === 0) {
            console.log('(none)');
        } else {
            response.steps.forEach((step, index) => {
                console.log(formatStep(step, index));
            });
        }

        printDivider();
        console.log('调试标记:', summarizeDebugFlags(response.steps));

        printDivider();
        console.log('缓存统计:', getAgentCacheStats());
    };

    if (oneShotPrompt) {
        await runPrompt(oneShotPrompt);
        rl.close();
        return;
    }

    while (true) {
        let prompt = '';
        try {
            prompt = (await rl.question('\n你> ')).trim();
        } catch (error: any) {
            if (error?.code === 'ERR_USE_AFTER_CLOSE') {
                break;
            }
            throw error;
        }
        if (!prompt) continue;

        if (prompt === '/exit') break;
        if (prompt === '/stats') {
            printDivider();
            console.log('缓存统计:', getAgentCacheStats());
            continue;
        }
        await runPrompt(prompt);
    }

    rl.close();
}

main().catch((error) => {
    console.error('Agent CLI 运行失败:', error);
    process.exit(1);
});
