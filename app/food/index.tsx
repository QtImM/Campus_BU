import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronLeft, ExternalLink, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { FOOD_OUTLETS } from '../../data/foodOutlets';

export default function FoodScreen() {
    const router = useRouter();

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerCopy}>
                    <Text style={styles.title}>Campus Dining</Text>
                    <Text style={styles.subtitle}>Official dining outlets and campus ordering links</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Pressable style={styles.mapCard} onPress={() => router.push('/(tabs)/map' as any)}>
                    <Image source={require('../../assets/images/food/Map.png')} style={styles.mapImage} />
                    <View style={styles.mapOverlay}>
                        <Text style={styles.mapTitle}>Campus Food Map</Text>
                        <Text style={styles.mapText}>Open the map to browse food locations on campus.</Text>
                    </View>
                </Pressable>

                {FOOD_OUTLETS.map((outlet) => (
                    <Pressable
                        key={outlet.id}
                        style={styles.card}
                        onPress={() => router.push(`/food/${outlet.id}` as any)}
                    >
                        <Image source={outlet.image} style={styles.cardImage} />
                        <View style={styles.cardBody}>
                            <View style={styles.cardTopRow}>
                                <Text style={styles.cardTitle}>{outlet.title}</Text>
                                <View style={[styles.statusBadge, outlet.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
                                    <Text style={[styles.statusText, outlet.status === 'Open' ? styles.statusTextOpen : styles.statusTextClosed]}>
                                        {outlet.status}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.category}>{outlet.category}</Text>
                            <View style={styles.locationRow}>
                                <MapPin size={14} color="#475569" />
                                <Text style={styles.location}>{outlet.location}</Text>
                            </View>
                            <Text style={styles.hours}>{outlet.hours}</Text>
                            <View style={styles.actions}>
                                {!!outlet.menuUrl && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={(event) => {
                                            event.stopPropagation();
                                            void WebBrowser.openBrowserAsync(outlet.menuUrl!);
                                        }}
                                    >
                                        <ExternalLink size={14} color="#0F766E" />
                                        <Text style={styles.actionText}>Menu</Text>
                                    </TouchableOpacity>
                                )}
                                {!!outlet.orderUrl && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={(event) => {
                                            event.stopPropagation();
                                            void WebBrowser.openBrowserAsync(outlet.orderUrl!);
                                        }}
                                    >
                                        <ExternalLink size={14} color="#1D4ED8" />
                                        <Text style={styles.actionText}>Order</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 14,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerCopy: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 28,
        gap: 16,
    },
    mapCard: {
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
    },
    mapImage: {
        width: '100%',
        height: 180,
    },
    mapOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 18,
        backgroundColor: 'rgba(15, 23, 42, 0.62)',
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    mapText: {
        marginTop: 4,
        fontSize: 13,
        lineHeight: 19,
        color: '#E2E8F0',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardBody: {
        padding: 16,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    statusOpen: {
        backgroundColor: '#DCFCE7',
    },
    statusClosed: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    statusTextOpen: {
        color: '#166534',
    },
    statusTextClosed: {
        color: '#B91C1C',
    },
    category: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '700',
        color: '#0F766E',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    location: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
    hours: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: '#334155',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
});
