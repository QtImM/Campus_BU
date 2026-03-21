/**
 * Global App Configuration
 * This file manages the environment-specific behaviors.
 */

// Expo detects __DEV__ automatically when running via 'npx expo start'
const IS_DEV_ENV = __DEV__;

export const APP_CONFIG = {
    /**
     * Set this to 'prod' to simulate the production experience for students.
     * Set this to 'dev' for debugging and iterative development.
     */
    mode: 'prod' as 'dev' | 'prod',

    // --- Feature Toggles ---

    /**
     * Dynamically determines if we should show debug UI.
     */
    shouldShowDebug() {
        return this.mode === 'dev';
    },

    /**
     * Whether to show LLM internal thoughts, Pilot buttons, and debug WebView controls.
     */
    get showAgentDebug() {
        return this.mode === 'dev';
    },

    /**
     * Whether to show technical performance metrics (Latency, Token count).
     */
    get showPerformanceMetrics() {
        return this.mode === 'dev';
    },

    // --- Visual Branding ---
    appName: 'HKCampus',
    version: '1.2.1',

    // --- Coze Integration (Option B) ---
    cozeConfig: {
        apiBase: 'https://api.coze.cn/v1/workflow/run',
        workflowId: '7613633505641709603',
    }
};

/**
 * Helper to check if we should show debug elements
 */
export const isDebugMode = () => APP_CONFIG.showAgentDebug;
