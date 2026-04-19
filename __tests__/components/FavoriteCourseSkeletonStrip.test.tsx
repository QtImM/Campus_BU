import React from 'react';
import { render } from '@testing-library/react-native';
import { FavoriteCourseSkeletonStrip } from '../../components/course/FavoriteCourseSkeletonStrip';

describe('FavoriteCourseSkeletonStrip', () => {
    it('renders three lightweight favorite skeleton cards', () => {
        const { getAllByTestId } = render(<FavoriteCourseSkeletonStrip />);

        expect(getAllByTestId('favorite-skeleton')).toHaveLength(3);
    });
});
