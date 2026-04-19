import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../common/Skeleton';

export const FavoriteCourseSkeletonStrip = () => (
    <View style={styles.row}>
        <FavoriteCourseSkeletonCard />
        <FavoriteCourseSkeletonCard />
        <FavoriteCourseSkeletonCard />
    </View>
);

const FavoriteCourseSkeletonCard = () => (
    <View style={styles.card} testID="favorite-skeleton">
        <Skeleton width={72} height={14} borderRadius={8} style={{ marginBottom: 10 }} />
        <Skeleton width={44} height={8} borderRadius={999} />
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    card: {
        width: 108,
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
});
