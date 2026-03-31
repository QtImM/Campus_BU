import { Image, ImageContentFit, ImageProps, ImageStyle } from 'expo-image';
import React from 'react';
import { StyleProp } from 'react-native';
import { normalizeRemoteImageUrl } from '../../utils/remoteImage';

interface CachedRemoteImageProps extends Omit<ImageProps, 'source' | 'style' | 'contentFit'> {
    uri: string;
    style: StyleProp<ImageStyle>;
    contentFit?: ImageContentFit;
    transition?: number;
    recyclingKey?: string;
}

export const CachedRemoteImage: React.FC<CachedRemoteImageProps> = ({
    uri,
    style,
    contentFit = 'cover',
    transition = 120,
    recyclingKey,
    ...rest
}) => {
    const normalizedUri = normalizeRemoteImageUrl(uri);

    if (!normalizedUri) {
        return null;
    }

    return (
        <Image
            source={{ uri: normalizedUri }}
            style={style}
            contentFit={contentFit}
            cachePolicy="memory-disk"
            transition={transition}
            recyclingKey={recyclingKey ?? normalizedUri}
            {...rest}
        />
    );
};
