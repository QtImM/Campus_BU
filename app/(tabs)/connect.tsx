import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface NearbyUser {
    id: string;
    name: string;
    major: string;
    tags: string[];
    distance: string;
    color: string;
}

const NEARBY_USERS: NearbyUser[] = [
    { id: '1', name: '小明', major: 'MSc AI & ML', tags: ['Library Ghost 📚', 'Coffee Addict ☕'], distance: '50m', color: '#FF6B6B' },
    { id: '2', name: 'Sarah', major: 'BBA Marketing', tags: ['Foodie 🍜', 'Night Owl 🦉'], distance: '120m', color: '#4ECDC4' },
    { id: '3', name: '阿杰', major: 'Computer Science', tags: ['Coder 💻', 'Gamer 🎮'], distance: '200m', color: '#FFE66D' },
    { id: '4', name: 'Emily', major: 'Visual Arts', tags: ['Artist 🎨', 'Tea Lover 🍵'], distance: '350m', color: '#95E1D3' },
    { id: '5', name: '小红', major: 'Psychology', tags: ['Cat Person 🐱', 'Bookworm 📖'], distance: '500m', color: '#DDA0DD' },
];

export default function ConnectScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePoke = (user: NearbyUser) => {
        Alert.alert('👋 Poke Sent!', `You poked ${user.name}!`);
    };

    const handleWave = (user: NearbyUser) => {
        Alert.alert('🙌 Wave Sent!', `You waved at ${user.name}!`);
    };

    const handleChat = (user: NearbyUser) => {
        Alert.alert('💬 Chat', `Starting chat with ${user.name}...`);
    };

    const nextUser = () => {
        if (currentIndex < NEARBY_USERS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevUser = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentUser = NEARBY_USERS[currentIndex];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Connect</Text>
                <Text style={styles.headerSubtitle}>Find your vibe tribe</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsBar}>
                <Text style={styles.statsText}>🎯 {NEARBY_USERS.length} nearby</Text>
            </View>

            {/* User Card */}
            <View style={styles.cardContainer}>
                <View style={[styles.card, { backgroundColor: currentUser.color }]}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{currentUser.name}</Text>
                    <Text style={styles.userMajor}>{currentUser.major}</Text>
                    <Text style={styles.userDistance}>📍 {currentUser.distance}</Text>

                    <View style={styles.tagsContainer}>
                        {currentUser.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Navigation Arrows */}
                <View style={styles.navContainer}>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                        onPress={prevUser}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={24} color={currentIndex === 0 ? '#ccc' : '#4B0082'} />
                    </TouchableOpacity>
                    <Text style={styles.navText}>{currentIndex + 1} / {NEARBY_USERS.length}</Text>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === NEARBY_USERS.length - 1 && styles.navButtonDisabled]}
                        onPress={nextUser}
                        disabled={currentIndex === NEARBY_USERS.length - 1}
                    >
                        <ChevronRight size={24} color={currentIndex === NEARBY_USERS.length - 1 ? '#ccc' : '#4B0082'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handlePoke(currentUser)}>
                    <Text style={styles.actionEmoji}>👆</Text>
                    <Text style={styles.actionLabel}>Poke</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.waveButton]} onPress={() => handleWave(currentUser)}>
                    <Text style={styles.actionEmoji}>👋</Text>
                    <Text style={styles.actionLabel}>Wave</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={() => handleChat(currentUser)}>
                    <MessageCircle size={24} color="#fff" />
                    <Text style={[styles.actionLabel, { color: '#fff' }]}>Chat</Text>
                </TouchableOpacity>
            </View>

            {/* Hint */}
            <Text style={styles.hint}>← Swipe to discover more →</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 56,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#1E3A8A',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    statsBar: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    statsText: {
        fontSize: 14,
        color: '#4B5563',
    },
    cardContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: width - 60,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    userMajor: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    userDistance: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    navButton: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navText: {
        fontSize: 14,
        color: '#6B7280',
        marginHorizontal: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    waveButton: {
        backgroundColor: '#FFE66D',
    },
    chatButton: {
        backgroundColor: '#1E3A8A',
    },
    actionEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    hint: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        paddingBottom: 100,
    },
});
