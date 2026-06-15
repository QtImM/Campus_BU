import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Shield, ShieldOff, UserPlus, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '../../services/auth';
import {
    AdminRecord,
    fetchActiveAdmins,
    grantAdmin,
    revokeAdmin,
    searchUserProfiles,
    UserSearchResult,
} from '../../services/adminManagement';
import { isAdmin } from '../../utils/userUtils';

export default function AdminManagementScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    const loadAdmins = useCallback(async () => {
        try {
            const user = await getCurrentUser();
            const canManage = await isAdmin(user?.uid);
            setAuthorized(canManage);
            setCurrentUserId(user?.uid ?? null);
            if (canManage) {
                setAdmins(await fetchActiveAdmins());
            }
        } catch (e) {
            Alert.alert('加载失败', '请稍后重试');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void loadAdmins(); }, [loadAdmins]);

    const handleSearch = useCallback(async (q: string) => {
        setSearchQuery(q);
        if (q.trim().length < 2) { setSearchResults([]); return; }
        setSearching(true);
        try {
            setSearchResults(await searchUserProfiles(q.trim(), 10));
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, []);

    const handleGrant = async (user: UserSearchResult) => {
        if (!currentUserId) return;
        const adminIds = new Set(admins.map(a => a.userId));
        if (adminIds.has(user.uid)) {
            Alert.alert('提示', '该用户已经是管理员');
            return;
        }
        Alert.alert('授权管理员', `确认将 ${user.displayName} 设为管理员？`, [
            { text: '取消', style: 'cancel' },
            {
                text: '确认', onPress: async () => {
                    try {
                        await grantAdmin(user.uid, user.email, currentUserId!);
                        setSearchQuery('');
                        setSearchResults([]);
                        setAdmins(await fetchActiveAdmins());
                    } catch (e: any) {
                        Alert.alert('操作失败', e.message ?? '请稍后重试');
                    }
                },
            },
        ]);
    };

    const handleRevoke = async (admin: AdminRecord) => {
        if (!currentUserId) return;
        if (admin.userId === currentUserId) {
            Alert.alert('提示', '不能撤销自己的管理员权限');
            return;
        }
        Alert.alert('撤销管理员', `确认撤销 ${admin.displayName} 的管理员权限？`, [
            { text: '取消', style: 'cancel' },
            {
                text: '撤销', style: 'destructive', onPress: async () => {
                    try {
                        await revokeAdmin(admin.userId, currentUserId);
                        setAdmins(await fetchActiveAdmins());
                    } catch (e: any) {
                        Alert.alert('操作失败', e.message ?? '请稍后重试');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}><ActivityIndicator color="#1E3A8A" /></View>
            </SafeAreaView>
        );
    }

    if (!authorized) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <ArrowLeft size={20} color="#1E3A8A" />
                    </TouchableOpacity>
                    <Text style={styles.title}>管理员管理</Text>
                    <View style={styles.iconButton} />
                </View>
                <View style={styles.center}>
                    <Text style={styles.emptyText}>你没有权限</Text>
                </View>
            </SafeAreaView>
        );
    }

    const adminIds = new Set(admins.map(a => a.userId));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <ArrowLeft size={20} color="#1E3A8A" />
                </TouchableOpacity>
                <Text style={styles.title}>管理员管理</Text>
                <View style={styles.iconButton} />
            </View>

            <FlatList
                data={admins}
                keyExtractor={item => item.userId}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        {/* Search to add admin */}
                        <Text style={styles.sectionTitle}>添加管理员</Text>
                        <View style={styles.searchBox}>
                            <Search size={16} color="#64748B" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="搜索用户名 / 邮箱"
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={handleSearch}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                                    <X size={16} color="#64748B" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {searching && <ActivityIndicator size="small" color="#1E3A8A" style={{ marginVertical: 8 }} />}

                        {searchResults.map(user => (
                            <View style={styles.userRow} key={user.uid}>
                                {user.avatarUrl && !user.avatarUrl.startsWith('blob:')
                                    ? <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                                    : <View style={[styles.avatar, styles.avatarFallback]}>
                                        <Text style={styles.avatarText}>{user.displayName[0]?.toUpperCase()}</Text>
                                    </View>
                                }
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.displayName}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                                {adminIds.has(user.uid)
                                    ? <View style={styles.alreadyBadge}><Text style={styles.alreadyText}>已是管理员</Text></View>
                                    : <TouchableOpacity style={styles.addButton} onPress={() => void handleGrant(user)}>
                                        <UserPlus size={14} color="#fff" />
                                        <Text style={styles.addButtonText}>添加</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        ))}

                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                            当前管理员 ({admins.length})
                        </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.adminRow}>
                        {item.avatarUrl
                            ? <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                            : <View style={[styles.avatar, styles.avatarFallback]}>
                                <Text style={styles.avatarText}>{item.displayName[0]?.toUpperCase()}</Text>
                            </View>
                        }
                        <View style={styles.userInfo}>
                            <View style={styles.nameRow}>
                                <Shield size={12} color="#1E3A8A" />
                                <Text style={styles.userName}>{item.displayName}</Text>
                                {item.userId === currentUserId && (
                                    <Text style={styles.youBadge}>你</Text>
                                )}
                            </View>
                            <Text style={styles.userEmail}>{item.email}</Text>
                        </View>
                        {item.userId !== currentUserId && (
                            <TouchableOpacity style={styles.revokeButton} onPress={() => void handleRevoke(item)}>
                                <ShieldOff size={14} color="#DC2626" />
                                <Text style={styles.revokeText}>撤销</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>暂无管理员</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    iconButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { padding: 16, paddingBottom: 32 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 10,
        marginBottom: 6,
    },
    adminRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        padding: 10,
        marginBottom: 6,
    },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    avatarFallback: { backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
    userInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
    userName: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
    userEmail: { fontSize: 12, color: '#64748B' },
    youBadge: { fontSize: 10, fontWeight: '700', color: '#1E3A8A', backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 99 },
    alreadyBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    alreadyText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
    addButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E3A8A', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    addButtonText: { fontSize: 12, color: '#fff', fontWeight: '700' },
    revokeButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    revokeText: { fontSize: 12, color: '#DC2626', fontWeight: '700' },
    emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 16 },
});
