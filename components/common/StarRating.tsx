import { Star, StarHalf } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface StarRatingProps {
    /** Rating value on a 0–5 scale. */
    rating: number;
    /** Diameter of each star icon. */
    size?: number;
    /** Gap between stars. */
    gap?: number;
    /** Filled / empty star colors. */
    color?: string;
    emptyColor?: string;
    style?: ViewStyle;
}

const TOTAL_STARS = 5;
const GOLD = '#FFB400';
const EMPTY = '#E2E8F0';

/**
 * Hotel-style rating: five stars lit according to the value, with a half star
 * for the fractional remainder (rounded to the nearest half). Purely visual.
 */
export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 14,
    gap = 2,
    color = GOLD,
    emptyColor = EMPTY,
    style,
}) => {
    // Clamp to range, then snap to the nearest half-star.
    const clamped = Math.max(0, Math.min(TOTAL_STARS, rating || 0));
    const rounded = Math.round(clamped * 2) / 2;
    const fullCount = Math.floor(rounded);
    const hasHalf = rounded - fullCount === 0.5;

    return (
        <View style={[styles.row, { gap }, style]}>
            {Array.from({ length: TOTAL_STARS }).map((_, i) => {
                if (i < fullCount) {
                    return <Star key={i} size={size} color={color} fill={color} />;
                }
                if (i === fullCount && hasHalf) {
                    // StarHalf only fills the left half; the right half stays as
                    // the outline, so we tint the icon with the filled color.
                    return <StarHalf key={i} size={size} color={color} fill={color} />;
                }
                return <Star key={i} size={size} color={emptyColor} fill={emptyColor} />;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
