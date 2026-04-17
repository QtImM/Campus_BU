import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronLeft, Clock3, ExternalLink, MapPin, UtensilsCrossed } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { FOOD_OUTLETS } from '../../data/foodOutlets';

export default function OutletDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const outlet = FOOD_OUTLETS.find((item) => item.id === id) || FOOD_OUTLETS[0];

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={22} color="#0F172A" />
                    </TouchableOpacity>
                    <View style={styles.headerCopy}>
                        <Text style={styles.title}>{outlet.title}</Text>
                        <Text style={styles.subtitle}>{outlet.category}</Text>
                    </View>
                </View>

                <Image source={outlet.image} style={styles.heroImage} />

                <View style={styles.statusCard}>
                    <View style={[styles.statusBadge, outlet.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
                        <Text style={[styles.statusText, outlet.status === 'Open' ? styles.statusTextOpen : styles.statusTextClosed]}>
                            {outlet.status}
                        </Text>
                    </View>
                    <Text style={styles.statusHint}>This page now shows official outlet details only.</Text>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <MapPin size={18} color="#1D4ED8" />
                        <View style={styles.infoCopy}>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>{outlet.location}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Clock3 size={18} color="#0F766E" />
                        <View style={styles.infoCopy}>
                            <Text style={styles.infoLabel}>Opening Hours</Text>
                            <Text style={styles.infoValue}>{outlet.hours}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <UtensilsCrossed size={18} color="#B45309" />
                        <View style={styles.infoCopy}>
                            <Text style={styles.infoLabel}>Category</Text>
                            <Text style={styles.infoValue}>{outlet.category}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsCard}>
                    <Text style={styles.sectionTitle}>Official Links</Text>
                    <Text style={styles.sectionBody}>
                        Ordering and menu links below open the official external pages provided for this dining outlet.
                    </Text>
                    {!!outlet.orderUrl && (
                        <TouchableOpacity style={styles.primaryButton} onPress={() => void WebBrowser.openBrowserAsync(outlet.orderUrl!)}>
                            <ExternalLink size={16} color="#FFFFFF" />
                            <Text style={styles.primaryButtonText}>Open Ordering Page</Text>
                        </TouchableOpacity>
                    )}
                    {!!outlet.menuUrl && (
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => void WebBrowser.openBrowserAsync(outlet.menuUrl!)}>
                            <ExternalLink size={16} color="#0F172A" />
                            <Text style={styles.secondaryButtonText}>Open Menu</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#475569',
    },
    heroImage: {
        width: '100%',
        height: 240,
        borderRadius: 24,
    },
    statusCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        gap: 10,
    },
    statusBadge: {
        alignSelf: 'flex-start',
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
    statusHint: {
        fontSize: 14,
        lineHeight: 21,
        color: '#475569',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoCopy: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },
    infoValue: {
        marginTop: 4,
        fontSize: 14,
        lineHeight: 21,
        color: '#0F172A',
    },
    actionsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    sectionBody: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: '#475569',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        backgroundColor: '#1D4ED8',
        borderRadius: 16,
        paddingVertical: 14,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        paddingVertical: 14,
    },
    secondaryButtonText: {
        color: '#0F172A',
        fontSize: 15,
        fontWeight: '700',
    },
});
