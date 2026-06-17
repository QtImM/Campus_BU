import { Image, ImageContentFit, ImageProps, ImageStyle } from 'expo-image';
import React from 'react';
import { PixelRatio, StyleProp } from 'react-native';
import { buildStorageThumbUrl, normalizeRemoteImageUrl } from '../../utils/remoteImage';

interface CachedRemoteImageProps extends Omit<ImageProps, 'source' | 'style' | 'contentFit'> {
    uri: string;
    style: StyleProp<ImageStyle>;
    contentFit?: ImageContentFit;
    transition?: number;
    recyclingKey?: string;
    /**
     * Logical (DP) display width. When set, request a Supabase-transformed
     * thumbnail at the matching device-pixel width instead of the full image.
     * No-op unless ENABLE_STORAGE_IMAGE_TRANSFORM is on (see utils/remoteImage).
     */
    thumbWidth?: number;
}

export const CachedRemoteImage: React.FC<CachedRemoteImageProps> = ({
    uri,
    style,
    contentFit = 'cover',
    transition = 120,
    recyclingKey,
    thumbWidth,
    onError,
    ...rest
}) => {
    const normalizedUri = normalizeRemoteImageUrl(uri);

    // When a transformed/thumbnail URL fails to load (e.g. the Supabase image
    // transform feature is disabled and returns 403), fall back to the original
    // full-size URL so the image never silently goes blank.
    const [useFallback, setUseFallback] = React.useState(false);
    React.useEffect(() => {
        setUseFallback(false);
    }, [normalizedUri]);

    if (!normalizedUri) {
        return null;
    }

    const transformedUri = thumbWidth
        ? (buildStorageThumbUrl(normalizedUri, thumbWidth * PixelRatio.get()) ?? normalizedUri)
        : normalizedUri;
    const sourceUri = useFallback ? normalizedUri : transformedUri;

    return (
        <Image
            source={{ uri: sourceUri }}
            style={style}
            contentFit={contentFit}
            cachePolicy="memory-disk"
            transition={transition}
            recyclingKey={recyclingKey ?? normalizedUri}
            onError={(e) => {
                if (!useFallback && sourceUri !== normalizedUri) {
                    setUseFallback(true);
                }
                onError?.(e);
            }}
            {...rest}
        />
    );
};
