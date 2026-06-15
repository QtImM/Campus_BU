import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import { parsePostIdFromUrl } from '../utils/shareUtils';

const SHARE_PATTERN = /复制打开HKCampus/;
const URL_PATTERN = /https?:\/\/[^\s]+\/post\/([0-9a-zA-Z-]+)/;

export function useClipboardDeepLink() {
    const router = useRouter();
    const lastChecked = useRef<string | null>(null);

    useEffect(() => {
        const checkClipboard = async () => {
            try {
                const hasString = await Clipboard.hasStringAsync();
                if (!hasString) return;

                const text = await Clipboard.getStringAsync();
                if (!text || text === lastChecked.current) return;
                lastChecked.current = text;

                if (!SHARE_PATTERN.test(text)) return;

                const urlMatch = text.match(URL_PATTERN);
                if (!urlMatch) return;

                const postId = parsePostIdFromUrl(urlMatch[0]);
                if (!postId) return;

                Alert.alert(
                    '检测到分享内容',
                    '是否打开该帖子？',
                    [
                        { text: '忽略', style: 'cancel' },
                        {
                            text: '打开',
                            onPress: () => {
                                router.push({ pathname: '/campus/[id]' as any, params: { id: postId } });
                                void Clipboard.setStringAsync('');
                            },
                        },
                    ],
                );
            } catch { /* ignore clipboard access errors */ }
        };

        // Check on mount (app cold start)
        const timer = setTimeout(checkClipboard, 1500);

        // Check when app comes to foreground
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                void checkClipboard();
            }
        });

        return () => {
            clearTimeout(timer);
            subscription.remove();
        };
    }, [router]);
}
