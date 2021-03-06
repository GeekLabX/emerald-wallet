import {Page} from '@emeraldplatform/ui';
import {Back} from '@emeraldplatform/ui-icons';
import {BlockchainCode, IBlockchain} from '@emeraldwallet/core';
import {accounts, IState, ledger, screen, settings} from '@emeraldwallet/store';
import {CoinAvatar, FormRow, PasswordInput} from '@emeraldwallet/ui';
import * as React from 'react';
import {connect} from 'react-redux';
import {
  FormControlLabel,
  Card,
  CardMedia,
  CardContent,
  createStyles, Box, Typography, Button, Stepper, Step, StepLabel, CardHeader, CardActions
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import SelectCoins from "../SelectCoins";

type EnableStateType = { [key: string]: boolean };

interface IProps {
  blockchains: IBlockchain[];
  enabledBlockchains: BlockchainCode[],
  isHardware: boolean,
  isHardwareConnected: boolean
}

interface IOwnProps {
  walletId: string;
}

interface IDispatchProps {
  onCancel?: any;
  createAccount?: any;
}

const useStyles = makeStyles(
  createStyles({
    media: {
      width: "200px",
      float: "left"
    },
    iconBox: {
      paddingLeft: "65px",
      paddingTop: "30px"
    },
    content: {
      width: "800px",
      float: "left"
    },
    contentCoinsBox: {
      width: "80%",
      float: "left"
    },
    contentControlBox: {
      width: "20%",
      float: "left"
    },
    buttonsRow: {
      // otherwise it's in the center
      display: 'block'
    }
  })
);

function CreateHdAccount(props: IProps & IOwnProps & IDispatchProps) {
  const {onCancel, enabledBlockchains, isHardware} = props;
  const [password, setPassword] = React.useState();
  const [enabled, setEnabled] = React.useState({} as EnableStateType);
  const [activeStep, setActiveStep] = React.useState(0);

  const changed = props.blockchains.some((blockchain) =>
    //wasn't enabled before & now enabled
    enabledBlockchains.indexOf(blockchain.params.code) < 0 && enabled[blockchain.params.code]
  )

  const styles = useStyles();

  function handlePasswordChange(pwd: string) {
    setPassword(pwd);
  }

  function create() {
    if (props.createAccount) {
      props.blockchains.filter((blockchain) =>
        enabledBlockchains.indexOf(blockchain.params.code) < 0 && enabled[blockchain.params.code]
      ).forEach((blockchain) => {
        props.createAccount(blockchain.params.code, password);
      });
    }
  }


  const selectCoinsStep = <SelectCoins blockchains={props.blockchains}
                                       enabled={props.enabledBlockchains}
                                       onChange={(value) => {
                                         const state = {} as EnableStateType
                                         value.forEach((it) => state[it] = true)
                                         setEnabled(state)
                                       }}/>;


  let confirmStep;

  if (isHardware) {
    confirmStep = <Box>
      Please connect your Ledger device
    </Box>
  } else {
    confirmStep = <Box>
      <Typography variant={"h6"}>Please enter password for the seed</Typography>
      <FormRow
        leftColumn={(<span>Seed password</span>)}
        rightColumn={(
          <PasswordInput
            onChange={handlePasswordChange}
            password={password}
          />
        )}
      />
    </Box>
  }

  const canSave = (isHardware && props.isHardwareConnected)
    || (!isHardware && typeof password == "string" && password.length > 0);

  const nextButtonEnabled = (activeStep == 0 && changed)
    || (activeStep == 1 && canSave);

  const stepper = <Stepper activeStep={activeStep}>
    <Step key={"select-blockchain"}>
      <StepLabel>Select Blockchain</StepLabel>
    </Step>
    <Step key={"save-changes"}>
      <StepLabel>Save Changes</StepLabel>
    </Step>
  </Stepper>;

  const controls = <Box>
    <Button
      disabled={activeStep == 0}
      variant="text"
      color={"secondary"}
      onClick={() => setActiveStep(activeStep - 1)}
    >Back</Button>

    <Button
      disabled={!nextButtonEnabled || activeStep == 1}
      variant="contained"
      color={"primary"}
      onClick={() => setActiveStep(activeStep + 1)}
    >Next</Button>

    <Button
      disabled={!nextButtonEnabled || activeStep < 1}
      variant="contained"
      color={"primary"}
      onClick={() => create()}
    >Save changes</Button>
  </Box>;

  return <Card>
    <CardHeader action={stepper}/>
    <CardContent>
      {activeStep == 0 ? selectCoinsStep : confirmStep}
    </CardContent>
    <CardActions>{controls}</CardActions>
  </Card>

}

function mapStateToProps(state: IState, ownProps: IOwnProps): IProps {
  const wallet = accounts.selectors.findWallet(state, ownProps.walletId)!;
  const enabledBlockchains: BlockchainCode[] = [];
  wallet.accounts
    .map((acc) => acc.blockchain)
    .forEach((blockchain) => {
      if (enabledBlockchains.indexOf(blockchain) < 0) {
        enabledBlockchains.push(blockchain)
      }
    })

  //technically we should show this wizard only to HD accounts, but still it's not a good assumption that we always
  //have a valid seedId and it's always the only one seed
  const accountWithSeed = wallet.accounts.find((acc) => typeof acc.seedId !== 'undefined')!
  const seed = accountWithSeed.seedId;
  const isHardware = accountWithSeed.isHardware;
  const isHardwareConnected = ledger.selectors.isConnected(state);

  return {
    blockchains: settings.selectors.currentChains(state),
    enabledBlockchains,
    isHardware,
    isHardwareConnected
  };
}

function mapDispatchToProps (dispatch: any, ownProps: IOwnProps) {
  return {
    onCancel: () => {
      dispatch(screen.actions.gotoScreen(screen.Pages.WALLET, ownProps.walletId));
    },
    createAccount: (chain: BlockchainCode, password: string) => {
      dispatch(accounts.actions.createHdAccountAction(ownProps.walletId, chain, password));
    }
  };
}

export default connect<IProps, {}, IOwnProps, IState>(
  mapStateToProps,
  mapDispatchToProps
)(CreateHdAccount);
