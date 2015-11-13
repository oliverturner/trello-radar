import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Application from '../index.jsx';
import styles from '../style.scss';

describe('Application', function () {
  it('displays the component', function () {
    const application = TestUtils.renderIntoDocument(
      <Application />
    );

    const divs = TestUtils.scryRenderedDOMComponentsWithClass(application, styles.main);

    expect(divs.length).to.equal(1);
  });
});
