import { AddCircle as Add } from '@emeraldplatform/ui-icons';
import { screen } from '@emeraldwallet/store';
import { IconButton } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { EmeraldDialogs } from '../../screen/Dialog/Dialog';
import Menu from './DashboardMenu';

const { gotoScreen, showDialog } = screen.actions;
const styles = createStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '8px',
    marginLeft: '10px',
    height: '50px'
  },
  title: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase'
  }
});

export interface IHeaderProps {
  generate: any;
  importLedger: any;
  showAboutDialog: any;
  addToken?: any;
  showAddressBook: any;
  classes: any;
  t: any;
  onCreateWallet?: any;
}

export function DashboardHeader (props: IHeaderProps & WithTranslation) {
  const {
    generate, importLedger,
    showAddressBook, onCreateWallet, showAboutDialog
  } = props;
  const { t, classes } = props;

  function handlePlusWalletClick () {
    if (onCreateWallet) {
      onCreateWallet();
    }
  }
  return (
      <div className={classes.header}>
        <div>
          <span className={classes.title}>{t('accounts.list.title')}</span>
          <IconButton onClick={handlePlusWalletClick}><Add /></IconButton>
        </div>
        <Menu
          generate={generate}
          importLedger={importLedger}
          addressBook={showAddressBook}
          onAbout={showAboutDialog}
          t={t}
        />
      </div>
  );
}

const StyledHeader = withStyles(styles)(DashboardHeader);

export default withTranslation()(
  connect(
    (state, ownProps) => ({}),
    (dispatch, ownProps) => ({
      onCreateWallet: () => {
        dispatch(gotoScreen(screen.Pages.CREATE_WALLET));
      },
      generate: () => {
        dispatch(gotoScreen('generate'));
      },
      importLedger: () => {
        dispatch(gotoScreen('add-from-ledger'));
      },
      showAddressBook: () => {
        dispatch(gotoScreen(screen.Pages.ADDRESS_BOOK));
      },
      showAboutDialog: () => {
        dispatch(screen.actions.showDialog(EmeraldDialogs.ABOUT));
      }
    })
  )(StyledHeader)
);
