import {
  AddCircle as AddIcon,
  Book as BookIcon,
  Download as DownloadIcon,
  Key as KeyIcon,
  Keypair as KeypairIcon,
  Ledger as LedgerIcon,
  Menu as MenuIcon,
  EmoteHappy as AboutIcon,
} from '@emeraldplatform/ui-icons';
import { Button } from '@emeraldwallet/ui';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme?: any) => ({
  buttonText: {
    paddingRight: 0
  }
});

interface IMenuProps {
  generate?: any;
  importLedger?: any;
  addressBook?: any;
  onAbout?: any;
  t?: any;
  style?: any;
  classes?: any;
}

interface IMenuState {
  open: boolean;
  anchorEl?: any;
}

class DashboardMenu extends React.Component<IMenuProps, IMenuState> {
  constructor (props: IMenuProps) {
    super(props);
    this.state = {
      open: false
    };
  }

  public openMenu = (event: any) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  public handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  public render () {
    const {
      importLedger, onAbout, addressBook
    } = this.props;
    const {
      style, classes
    } = this.props;
    const t = this.props.t || ((str: string) => (str));
    return (
      <div style={style}>
        <Button
          variant='text'
          primary={true}
          onClick={this.openMenu}
          classes={{ label: classes.buttonText }}
          style={{ hoverColor: 'transparent' }}
          icon={<MenuIcon />}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={this.handleRequestClose}
        >
          <List>
            <ListItem button={true} onClick={addressBook}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary='Address Book' secondary='View and edit contacts' />
            </ListItem>
            <ListItem button={true} onClick={onAbout}>
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary='About' secondary='View info about application' />
            </ListItem>
          </List>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(DashboardMenu);
