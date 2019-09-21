import { shallow } from 'enzyme';
import * as React from 'react';
import ReceiveDialog from '.';

describe('ReceiveDialog', () => {
  it('should renders without crash', () => {
    const wrapper = shallow(<ReceiveDialog address={{ value: '0x123', coinTicker: '' }} />);
    expect(wrapper).toBeDefined();
  });
});
