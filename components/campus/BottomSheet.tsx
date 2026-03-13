import React, { useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT / 3; // Takes 1/3 of screen

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
    console.log('[BottomSheet] Render - visible:', visible);

    // Start position: sheet is completely below the screen (hidden)
    // End position: sheet slides up to take 1/3 of screen
    const slideAnim = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('[BottomSheet] useEffect triggered - visible:', visible);
        if (visible) {
            console.log('[BottomSheet] Starting OPEN animation');
            console.log('[BottomSheet] Initial slideAnim value:', SHEET_HEIGHT);
            console.log('[BottomSheet] Target slideAnim value:', 0);
            // Animate up - move from bottom (SHEET_HEIGHT) to visible position (0)
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                console.log('[BottomSheet] OPEN animation completed');
            });
        } else {
            console.log('[BottomSheet] Starting CLOSE animation');
            // Animate down - move back to hidden position (SHEET_HEIGHT)
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SHEET_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.cubic),
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                console.log('[BottomSheet] CLOSE animation completed');
            });
        }
    }, [visible]);

    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const shouldSet = Math.abs(gestureState.dy) > 10;
                console.log('[BottomSheet] PanResponder onMoveShouldSetPanResponder - dy:', gestureState.dy, 'shouldSet:', shouldSet);
                return shouldSet;
            },
            onPanResponderGrant: (_, gestureState) => {
                console.log('[BottomSheet] PanResponder onPanResponderGrant');
                slideAnim.stopAnimation((value) => {
                    console.log('[BottomSheet] Animation stopped at value:', value);
                });
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    // When dragging down, add to the base position (0 when open)
                    const newValue = gestureState.dy;
                    console.log('[BottomSheet] PanResponder onPanResponderMove - dy:', gestureState.dy, 'new translateY:', newValue);
                    slideAnim.setValue(newValue);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                console.log('[BottomSheet] PanResponder onPanResponderRelease - dy:', gestureState.dy, 'vy:', gestureState.vy);
                if (gestureState.dy > SHEET_HEIGHT / 3 || gestureState.vy > 0.5) {
                    // Swipe down enough to close - animate back to hidden position
                    console.log('[BottomSheet] Closing from swipe');
                    handleClose();
                } else {
                    // Snap back to top - animate back to visible position (0)
                    console.log('[BottomSheet] Snapping back');
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleClose = () => {
        console.log('[BottomSheet] handleClose called');
        onClose();
    };

    return (
        <Modal
            key={`bottom-sheet-${visible ? 'open' : 'closed'}`}
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            </Pressable>
            <Animated.View
                style={[
                    styles.sheetContainer,
                    {
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                {/* Handle bar */}
                <View style={styles.handleWrapper}>
                    <View style={styles.handle} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {children}
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sheetContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: SHEET_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        // Use translateY to move the sheet up/down
        transform: [{ translateY: 0 }], // This will be overridden by animated transform
    },
    handleWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
