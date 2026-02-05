import { useRouter } from 'expo-router';
import { ArrowLeftRight, ChevronRight, Search, Star, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// HKBU Buildings and Classrooms Data - Keeping it consistent with previous implementation
export const BUILDINGS = [
    {
        id: 'aab',
        name: 'Academic and Administration Building (AAB)',
        shortName: 'AAB',
        coordinates: { lat: 22.3380, lng: 114.1813 },
        rooms: [
            { id: 'aab-101', name: 'AAB 101', floor: 1, type: 'Lecture Hall', capacity: 200 },
            { id: 'aab-201', name: 'AAB 201', floor: 2, type: 'Classroom', capacity: 60 },
            { id: 'aab-401', name: 'AAB 401', floor: 4, type: 'Computer Lab', capacity: 40 },
        ]
    },
    {
        id: 'dlb',
        name: 'David C. Lam Building (DLB)',
        shortName: 'DLB',
        coordinates: { lat: 22.3375, lng: 114.1818 },
        rooms: [
            { id: 'dlb-101', name: 'DLB 101', floor: 1, type: 'Lecture Hall', capacity: 150 },
            { id: 'dlb-201', name: 'DLB 201', floor: 2, type: 'Classroom', capacity: 55 },
        ]
    },
    {
        id: 'cva',
        name: 'Communication and Visual Arts Building (CVA)',
        shortName: 'CVA',
        coordinates: { lat: 22.3382, lng: 114.1808 },
        rooms: [
            { id: 'cva-101', name: 'CVA 101', floor: 1, type: 'Studio', capacity: 30 },
            { id: 'cva-201', name: 'CVA 201', floor: 2, type: 'Screening Room', capacity: 80 },
        ]
    }
];

export const ALL_ROOMS = BUILDINGS.flatMap(building =>
    building.rooms.map(room => ({
        ...room,
        building: building.shortName,
        buildingFull: building.name,
        coordinates: building.coordinates,
    }))
);

export const getRoomIcon = (type: string) => {
    switch (type) {
        case 'Lecture Hall': return '🎓';
        case 'Classroom': return '📚';
        case 'Computer Lab': return '💻';
        case 'Studio': return '🎨';
        case 'Screening Room': return '🎬';
        default: return '🚪';
    }
};

export default function ClassroomIndex() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    const filteredRooms = searchQuery.trim()
        ? ALL_ROOMS.filter(room => {
            const query = searchQuery.toLowerCase();
            return (
                (room.name || '').toLowerCase().includes(query) ||
                (room.building || '').toLowerCase().includes(query) ||
                (room.type || '').toLowerCase().includes(query)
            );
        })
        : ALL_ROOMS;

    const handleRoomSelect = (roomId: string) => {
        router.push(`/classroom/${roomId}` as any);
        Keyboard.dismiss();
    };

    const toggleFavorite = (roomId: string) => {
        if (favorites.includes(roomId)) {
            setFavorites(favorites.filter(id => id !== roomId));
        } else {
            setFavorites([...favorites, roomId]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>找课程</Text>
                        <Text style={styles.headerSubtitle}>Courses & Classrooms</Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="搜索教室 (如 AAB 301, DLB...)"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Favorites Section */}
            {favorites.length > 0 && !searchQuery && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⭐ 收藏的教室</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={ALL_ROOMS.filter(r => favorites.includes(r.id))}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.favoriteCard}
                                onPress={() => handleRoomSelect(item.id)}
                            >
                                <Text style={styles.favoriteIcon}>{getRoomIcon(item.type)}</Text>
                                <Text style={styles.favoriteName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {/* Room List */}
            <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>
                    {searchQuery ? `搜索结果 (${filteredRooms.length})` : '全部教室'}
                </Text>
                <FlatList
                    data={filteredRooms}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.roomCard}
                            onPress={() => handleRoomSelect(item.id)}
                        >
                            <View style={styles.roomIcon}>
                                <Text style={styles.roomIconText}>{getRoomIcon(item.type)}</Text>
                            </View>
                            <View style={styles.roomInfo}>
                                <Text style={styles.roomName}>{item.name}</Text>
                                <Text style={styles.roomDetails}>
                                    {item.floor}F · {item.type}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => toggleFavorite(item.id)}
                            >
                                <Star
                                    size={18}
                                    color={favorites.includes(item.id) ? '#FFD700' : '#D1D5DB'}
                                    fill={favorites.includes(item.id) ? '#FFD700' : 'transparent'}
                                />
                            </TouchableOpacity>
                            <ChevronRight size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Course Exchange FAB (Redundancy) */}
            <TouchableOpacity
                style={styles.exchangeFab}
                onPress={() => router.push('/courses/exchange' as any)}
            >
                <ArrowLeftRight size={24} color="#fff" />
                <View style={styles.fabBadge}>
                    <Text style={styles.fabBadgeText}>换课</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#1E3A8A' },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 12, padding: 4 },
    headerTitleContainer: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
    searchInput: { flex: 1, fontSize: 15, color: '#111827', marginLeft: 10 },
    section: { paddingTop: 16, paddingBottom: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', paddingHorizontal: 16, marginBottom: 12 },
    favoriteCard: { alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginLeft: 16, minWidth: 80 },
    favoriteIcon: { fontSize: 20, marginBottom: 4 },
    favoriteName: { fontSize: 12, fontWeight: '600', color: '#92400E' },
    listSection: { flex: 1, paddingTop: 8 },
    listContent: { paddingHorizontal: 16, paddingBottom: 40 },
    roomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    roomIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    roomIconText: { fontSize: 20 },
    roomInfo: { flex: 1 },
    roomName: { fontSize: 15, fontWeight: '600', color: '#111827' },
    roomDetails: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    favoriteButton: { padding: 8 },
    exchangeFab: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 15,
        zIndex: 9999,
    },
    fabBadge: {
        position: 'absolute',
        top: -8,
        right: -4,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    fabBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
