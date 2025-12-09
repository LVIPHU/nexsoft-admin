import { render } from '@testing-library/react';

import NexsoftAdminSso from './sso';

describe('NexsoftAdminSso', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NexsoftAdminSso />);
    expect(baseElement).toBeTruthy();
  });
});
