import { Address as AccountAddress } from '@emeraldplatform/ui';
import { Close as CloseIcon } from '@emeraldplatform/ui-icons';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, withStyles } from '@material-ui/core/styles';
import * as QRCode from 'qrcode.react';
import * as React from 'react';

export const styles = createStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#191919',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    paddingTop: '12px',
    paddingBottom: '12px',
    textTransform: 'uppercase'
  },
  note: {
    marginTop: '16px',
    color: '#747474',
    fontSize: '14px',
    lineHeight: '22px'
  },
  headerText: {
    color: '#191919',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px'
  },
  depositOptionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  closeButton: {
    float: 'right'
  },
  address: {
    color: '#191919',
    fontSize: '14px',
    lineHeight: '22px'
  },
  dialogContentRoot: {
    padding: '0 15px 15px 15px'
  }
});

interface IReceiveDlgProps {
  address: {
    value: string;
    coinTicker: string;
  };
  onClose?: any;
  classes?: any;
}

const ReceiveDialog = ({ address, onClose, classes }: IReceiveDlgProps) => {
  const qrCodeSize = 150;
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <div className={classes.container}>
          <div className={classes.title}>Add Ether</div>
          <div>
            <IconButton
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon/>
            </IconButton>
          </div>
        </div>
        <div className={classes.container}>
          <div style={{ marginTop: '30px', marginRight: '15px' }}>
            <QRCode value={address.value} size={qrCodeSize}/>
          </div>
          <div style={{ marginTop: '0px' }}>
            <div className={classes.headerText}>Top up your account with {address.coinTicker}</div>
            <div className={classes.address}>
              <AccountAddress id={address.value}/>
            </div>
            <div className={classes.note}>
              Share your account address and use it to top up your account with {address.coinTicker} from any other service.
              It may take some time for your coins be deposited.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(styles)(ReceiveDialog);
