import React from 'react';
import {ipcRenderer, shell} from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from '@material-ui/styles';
import theme from '@emeraldplatform/ui/lib/theme';
import {About} from '@emeraldwallet/ui';
import {version} from '../../../package.json';
import gitversion from '../../../gitversion.json';

class AboutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    ipcRenderer.once('get-version-result', (event, result) => {
      this.setState({
        os: result.os,
      });
    });
    ipcRenderer.send('get-version');
  }

  helpClick = () => {
    const url = 'https://emeraldpay.io/support';
    shell.openExternal(url);
  };

  licenseClick = () => {
    const url = 'https://github.com/emeraldpay/emerald-wallet/blob/master/LICENSE';
    shell.openExternal(url);
  };

  onButtonClick = () => {
    const url = 'https://emeraldpay.io';
    shell.openExternal(url);
  };

  render() {
    const {os} = this.state;
    return (
      <ThemeProvider theme={theme}>
        <About
          appVersion={version}
          gitVersion={gitversion}
          osVersion={os}
          onButtonClick={this.onButtonClick}
          onHelpClick={this.onHelpClick}
          onLicenseClick={this.onLicenseClick}
        />
      </ThemeProvider>);
  }
}

export default AboutContainer;
