import React from 'react';

import Chart from '../chart';

import styles from './style.scss';

class Application extends React.Component {
  render () {
    return (
      <div className={styles.main}>
        <div className={styles.wrap}>
          <Chart />
        </div>
      </div>
    );
  }
}

export default Application;
