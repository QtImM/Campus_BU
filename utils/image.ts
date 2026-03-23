import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compresses an image to a reasonable size for mobile uploads.
 * Standardizes max dimension to 1200px and quality to 0.7.
 * 
 * @param uri The URI of the image to compress
 * @returns The compressed image result containing URI, width, and height
 */
export const compressImage = async (uri: string) => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                { resize: { width: 1200 } } // Limit width to 1200px, height scales proportionally
            ],
            {
                compress: 0.7, // 70% quality is usually indistinguishable but much smaller
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    } catch (error) {
        console.error('Image compression failed:', error);
        return uri; // Fallback to original URI if compression fails
    }
};

type ImageCompressionPreset = 'avatar' | 'feed' | 'detail';

const PRESET_CONFIG: Record<ImageCompressionPreset, { width: number; compress: number }> = {
    avatar: { width: 256, compress: 0.6 },
    feed: { width: 1280, compress: 0.68 },
    detail: { width: 1600, compress: 0.75 },
};

export const compressImageForUpload = async (
    uri: string,
    preset: ImageCompressionPreset = 'feed'
): Promise<string> => {
    try {
        const config = PRESET_CONFIG[preset];
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: config.width } }],
            {
                compress: config.compress,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        return result.uri;
    } catch (error) {
        console.error(`Image compression failed for preset "${preset}":`, error);
        return uri;
    }
};
