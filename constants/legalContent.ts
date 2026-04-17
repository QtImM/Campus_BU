export type LegalTab = 'privacy' | 'terms';

export type LegalContent = {
    title: string;
    intro: string;
    sections: Array<{ heading: string; body: string }>;
};

export const LEGAL_CONTENT: Record<'en' | 'zh-Hans' | 'zh-Hant', Record<LegalTab, LegalContent>> = {
    en: {
        privacy: {
            title: 'Privacy Policy',
            intro: 'HKCampus collects only the data needed to provide campus features, community functions, and account security.',
            sections: [
                {
                    heading: 'Data We Collect',
                    body: 'We may collect your email address, profile nickname, avatar, major, social tags, posts, comments, uploaded images, direct messages, push token, and the location you choose to attach to a map or post.',
                },
                {
                    heading: 'How We Use Data',
                    body: 'We use this data to create your account, show your profile, deliver posts and messages, support moderation, send notifications if you enable them, and provide campus map features when you request them.',
                },
                {
                    heading: 'Location, Photos, and Biometrics',
                    body: 'Location is requested only when you actively use location-based features. Photo library and camera access are used only when you choose images. Face ID is used only for local sign-in convenience on your device.',
                },
                {
                    heading: 'Storage and Sharing',
                    body: 'User content is stored in Supabase services used by HKCampus. We do not use your data for third-party advertising or cross-app tracking.',
                },
                {
                    heading: 'Contact',
                    body: 'Privacy requests and questions: huoweijia2000@163.com or huoweijia2000@gmail.com.',
                },
            ],
        },
        terms: {
            title: 'Terms of Use & Community Safety',
            intro: 'HKCampus is an 18+ campus community. By using the app, you agree to these terms and to our zero-tolerance policy for objectionable content and abusive users.',
            sections: [
                {
                    heading: 'Zero-Tolerance Policy',
                    body: 'You must not post, upload, transmit, or promote objectionable content. This includes harassment, hate speech, threats, sexual exploitation, graphic violence, scams, spam, illegal activity, or any abusive behavior directed at other users.',
                },
                {
                    heading: 'User Safety Tools',
                    body: 'Users can report objectionable content, block abusive users, and hide posts from their feed immediately. Blocked users\' content is removed from your visible feed and conversations.',
                },
                {
                    heading: 'Moderation and Enforcement',
                    body: 'We review reports within 24 hours. When content violates these terms, we remove the offending content and may suspend or permanently ban the responsible account without prior notice.',
                },
                {
                    heading: 'Support and Contact',
                    body: 'Users can report inappropriate activity through in-app report actions or via Profile > Help & Support. You may also contact us at huoweijia2000@163.com or huoweijia2000@gmail.com.',
                },
            ],
        },
    },
    'zh-Hans': {
        privacy: {
            title: '隐私政策',
            intro: 'HKCampus 仅收集提供校园功能、社区互动和账户安全所必需的数据。',
            sections: [
                {
                    heading: '我们收集的数据',
                    body: '我们可能收集你的邮箱地址、昵称、头像、专业、社交标签、帖子、评论、上传图片、私信内容、推送令牌，以及你主动附加到地图或帖子中的位置信息。',
                },
                {
                    heading: '数据用途',
                    body: '这些数据用于创建账户、展示资料、发布内容与消息、支持审核处理、在你开启通知后发送提醒，以及在你主动使用时提供地图相关功能。',
                },
                {
                    heading: '定位、相册与生物识别',
                    body: '定位权限仅在你主动使用定位功能时请求；相册和相机权限仅在你主动选择图片时使用；Face ID 仅用于设备本地登录便利，不会上传你的生物特征数据。',
                },
                {
                    heading: '存储与共享',
                    body: '用户内容通过 HKCampus 使用的 Supabase 服务存储。我们不会将你的数据用于第三方广告投放或跨 App 跟踪。',
                },
                {
                    heading: '联系方式',
                    body: '隐私相关问题可联系：huoweijia2000@163.com 或 huoweijia2000@gmail.com。',
                },
            ],
        },
        terms: {
            title: '使用条款与社区安全',
            intro: 'HKCampus 是一个 18+ 校园社区。使用本 App 即表示你同意这些条款，并接受我们对不良内容和滥用用户的零容忍政策。',
            sections: [
                {
                    heading: '零容忍政策',
                    body: '你不得发布、上传、传播或鼓励任何不良内容，包括骚扰辱骂、仇恨歧视、威胁恐吓、性剥削、暴力内容、诈骗引流、垃圾广告、违法活动，以及任何针对其他用户的滥用行为。',
                },
                {
                    heading: '用户保护工具',
                    body: '用户可以举报不当内容、屏蔽滥用用户，并立即将帖子从自己的 feed 中隐藏。屏蔽后，该用户的内容会从你可见的动态和对话中移除。',
                },
                {
                    heading: '审核与处置',
                    body: '我们会在 24 小时内处理举报。若内容违反本条款，我们会移除相关内容，并可能对违规账号进行暂停或永久封禁，且无需事先通知。',
                },
                {
                    heading: '支持与联系',
                    body: '你可以通过 App 内的举报入口或“个人中心 > 帮助与支持”举报不当行为，也可以直接联系 huoweijia2000@163.com 或 huoweijia2000@gmail.com。',
                },
            ],
        },
    },
    'zh-Hant': {
        privacy: {
            title: '隱私政策',
            intro: 'HKCampus 僅收集提供校園功能、社群互動和帳戶安全所必需的資料。',
            sections: [
                {
                    heading: '我們收集的資料',
                    body: '我們可能收集你的電子郵件、暱稱、頭像、專業、社交標籤、貼文、評論、上傳圖片、私訊內容、推送權杖，以及你主動附加到地圖或貼文中的位置資訊。',
                },
                {
                    heading: '資料用途',
                    body: '這些資料用於建立帳戶、展示個人資料、發佈內容與訊息、支援審核處理、在你開啟通知後發送提醒，以及在你主動使用時提供地圖相關功能。',
                },
                {
                    heading: '定位、相簿與生物識別',
                    body: '定位權限僅在你主動使用定位功能時要求；相簿和相機權限僅在你主動選擇圖片時使用；Face ID 僅用於裝置本地登入便利，不會上傳你的生物特徵資料。',
                },
                {
                    heading: '儲存與分享',
                    body: '使用者內容透過 HKCampus 使用的 Supabase 服務儲存。我們不會將你的資料用於第三方廣告投放或跨 App 追蹤。',
                },
                {
                    heading: '聯絡方式',
                    body: '隱私相關問題可聯絡：huoweijia2000@163.com 或 huoweijia2000@gmail.com。',
                },
            ],
        },
        terms: {
            title: '使用條款與社群安全',
            intro: 'HKCampus 是一個 18+ 校園社群。使用本 App 即表示你同意這些條款，並接受我們對不良內容和濫用使用者的零容忍政策。',
            sections: [
                {
                    heading: '零容忍政策',
                    body: '你不得發佈、上傳、傳播或鼓勵任何不良內容，包括騷擾辱罵、仇恨歧視、威脅恐嚇、性剝削、暴力內容、詐騙引流、垃圾廣告、違法活動，以及任何針對其他使用者的濫用行為。',
                },
                {
                    heading: '使用者保護工具',
                    body: '使用者可以舉報不當內容、封鎖濫用使用者，並立即將貼文從自己的 feed 中隱藏。封鎖後，該使用者的內容會從你可見的動態和對話中移除。',
                },
                {
                    heading: '審核與處置',
                    body: '我們會在 24 小時內處理舉報。若內容違反本條款，我們會移除相關內容，並可能對違規帳號進行暫停或永久封鎖，且無需事先通知。',
                },
                {
                    heading: '支援與聯絡',
                    body: '你可以透過 App 內的舉報入口或「個人中心 > 幫助與支援」舉報不當行為，也可以直接聯絡 huoweijia2000@163.com 或 huoweijia2000@gmail.com。',
                },
            ],
        },
    },
};

export const TAB_LABELS: Record<'en' | 'zh-Hans' | 'zh-Hant', Record<LegalTab, string>> = {
    en: { privacy: 'Privacy', terms: 'Terms' },
    'zh-Hans': { privacy: '隐私', terms: '使用条款' },
    'zh-Hant': { privacy: '隱私', terms: '使用條款' },
};

export const normalizeLanguage = (language?: string | null): 'en' | 'zh-Hans' | 'zh-Hant' => {
    const normalized = language || 'en';
    if (normalized.startsWith('zh-Hant')) return 'zh-Hant';
    if (normalized.startsWith('zh-Hans') || normalized.startsWith('zh')) return 'zh-Hans';
    return 'en';
};
