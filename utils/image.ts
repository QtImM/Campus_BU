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
