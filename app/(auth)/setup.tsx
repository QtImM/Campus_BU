import { useRouter } from 'expo-router';
import { GraduationCap, LogOut, Sparkles, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { auth, createUserProfile, signOut } from '../../services/auth';
import { SOCIAL_TAGS } from '../../types';

export default function SetupScreen() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState('');
    const [major, setMajor] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length >= 3) {
                Alert.alert('Limit Reached', 'You can only select up to 3 tags');
                return;
            }
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetup = async () => {
        if (!displayName || !major) {
            Alert.alert('Error', 'Please fill in your name and major');
            return;
        }
        if (selectedTags.length === 0) {
            Alert.alert('Error', 'Please select at least one social tag');
            return;
        }

        const { data: { user }, error: userError } = await auth.getUser();
        if (userError || !user) {
            Alert.alert('Error', 'No authenticated user found. Please login again.');
            router.replace('/login');
            return;
        }

        setLoading(true);
        try {
            await createUserProfile(user.id, displayName, selectedTags, major);
            Alert.alert(
                'Welcome!',
                'Your profile continues to be set up. Let\'s explore!',
                [{ text: 'Let\'s Go', onPress: () => router.replace('/(tabs)/campus') }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper withScroll className="bg-white">
            <View style={styles.header}>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <LogOut size={20} color="#6B7280" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconContainer}>
                    <Sparkles size={32} color="#1E3A8A" />
                </View>
                <Text style={styles.title}>Who are you?</Text>
                <Text style={styles.subtitle}>Create your unique campus persona to start connecting.</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.labelRow}>
                    <UserIcon size={18} color="#6B7280" />
                    <Text style={styles.sectionLabel}>Nickname</Text>
                </View>
                <Input
                    placeholder="What should we call you?"
                    value={displayName}
                    onChangeText={setDisplayName}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.labelRow}>
                    <GraduationCap size={18} color="#6B7280" />
                    <Text style={styles.sectionLabel}>Major / Program</Text>
                </View>
                <Input
                    placeholder="e.g. MSc AI, BBA, Music"
                    value={major}
                    onChangeText={setMajor}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.labelRow}>
                    <Text style={styles.sectionLabel}>Social Tags (Max 3)</Text>
                    <Text style={styles.countText}>{selectedTags.length}/3</Text>
                </View>
                <View style={styles.tagGrid}>
                    {SOCIAL_TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => toggleTag(tag)}
                                style={[
                                    styles.tagButton,
                                    isSelected && styles.tagButtonSelected
                                ]}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.tagText,
                                        isSelected && styles.tagTextSelected
                                    ]}
                                >
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <Button
                title="Start Exploring"
                onPress={handleSetup}
                loading={loading}
                variant="primary"
                className="mt-6 mb-10 h-16 shadow-lg shadow-primary/30"
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        marginBottom: 32,
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    headerActions: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    logoutText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
        fontWeight: '500',
    },
    iconContainer: {
        marginTop: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(75, 0, 130, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E3A8A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingLeft: 4,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 8,
    },
    countText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 'auto',
    },
    tagGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tagButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        backgroundColor: '#F9FAFB',
    },
    tagButtonSelected: {
        backgroundColor: '#1E3A8A',
        borderColor: '#1E3A8A',
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    tagTextSelected: {
        color: '#FFFFFF',
    },
});

