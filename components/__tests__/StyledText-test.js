import renderer from 'react-test-renderer';

import { MonoText } from '../StyledText';

it(`renders correctly`, () => {
  let testRenderer;
  renderer.act(() => {
    testRenderer = renderer.create(<MonoText>Snapshot test!</MonoText>);
  });

  const tree = testRenderer.toJSON();

  renderer.act(() => {
    testRenderer.unmount();
  });

  expect(tree).toMatchSnapshot();
});
