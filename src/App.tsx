import { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { WALLET_ADAPTERS, SafeEventEmitterProvider } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import RPC from './lib/ethersRPC';
import { chains } from './lib/auth-providers/chains';
import { Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { EthHashInfo } from '@safe-global/safe-react-components';
import AppBar from './components/AppBar';
import FormDialog from './components/FormDialog';

const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '';

function App() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isTransactionExecution, setIsTransactionExecution] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: 'testnet', // mainnet, aqua, celeste, cyan or testnet
          chainConfig: chains['5'],
          uiConfig: {
            theme: 'dark',
            loginMethodsOrder: ['facebook', 'google'],
            appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg', // Your App Logo Here
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: 'optional', // Pass on the mfa level of your choice: default, optional, mandatory, none
          },
          adapterSettings: {
            uxMode: 'popup',
            whiteLabel: {
              name: 'Your app Name',
              logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
              logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
              defaultLanguage: 'en',
              dark: true, // whether to enable dark mode. defaultValue: false
            },
          },
        });

        web3auth.configureAdapter(openloginAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: 'openlogin',
              loginMethods: {
                google: {
                  name: 'google login',
                  logoDark:
                    'url to your custom logo which will shown in dark mode',
                },
                facebook: {
                  name: 'facebook login',
                  // it will hide the facebook option from the Web3Auth modal.
                  showOnModal: false,
                },
              },
              // setting it to false will hide all social login methods from modal.
              showOnModal: true,
            },
          },
        });

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;

    const web3authProvider = await web3auth.connect();

    if (web3authProvider) {
      setProvider(web3authProvider);
    }
  };

  const logout = async () => {
    if (!web3auth) return;

    await web3auth.logout();

    setProvider(null);
    setUserInfo(null);
    setError('');
    setInfo('');
  };

  const sendTransaction = async (target: string) => {
    if (!provider) return;

    setIsTransactionExecution(true);

    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction(target);

    setInfo(JSON.stringify(receipt, null, 2));
    setIsTransactionExecution(false);
  };

  const signMessage = async (message: string) => {
    if (!provider) return;

    setIsSigning(true);

    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage(message);

    setInfo(signedMessage);
    setIsSigning(false);
  };

  useEffect(() => {
    if (!provider || !web3auth) return;

    (async () => {
      const user = await web3auth.getUserInfo();
      console.info(user);
      setUserInfo(user);

      const rpc = new RPC(provider);
      const address = await rpc.getAccounts();
      const balance = await rpc.getBalance();
      const chainId = await rpc.getChainId();

      setAddress(address);
      setBalance(balance);
      setChainId(chainId);
    })();
  }, [provider, web3auth]);

  useEffect(() => {
    setInfo('');
    setError('');
  }, [isMessageDialogOpen, isTransactionDialogOpen]);

  return (
    <>
      <AppBar onLogin={login} onLogout={logout} isLoggedIn={!!provider} />
      <Grid container>
        <Grid item md={3} p={4}>
          {userInfo && (
            <>
              <EthHashInfo
                address={address}
                showCopyButton
                showPrefix
                prefix={chainId === '1' ? 'eth' : 'gor'}
              />
              <Typography variant="h2" sx={{ mt: 3 }}>
                {Math.round(Number(balance) * 10000) / 10000}{' '}
                <Typography variant="h3" component="span" color="primary">
                  ETH
                </Typography>
              </Typography>
              <Typography variant="h4" sx={{ mt: 4 }}>
                {userInfo.name}
              </Typography>
              <Typography variant="body2" color="primary">
                {userInfo.email}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item md={9} p={4}>
          {provider && (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  <LoadingButton
                    color="primary"
                    onClick={() => setIsMessageDialogOpen(true)}
                    loading={isSigning}
                    variant="contained"
                  >
                    <span>Sign Message</span>
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <LoadingButton
                    color="primary"
                    onClick={() => setIsTransactionDialogOpen(true)}
                    loading={isTransactionExecution}
                    variant="contained"
                  >
                    <span>Send Transaction</span>
                  </LoadingButton>
                </Grid>
              </Grid>

              {info && (
                <TextField
                  sx={{ mt: 4, width: '100%' }}
                  multiline
                  maxRows={20}
                  value={info}
                />
              )}

              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 4, width: '100%' }}
                >
                  {error}
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
      <FormDialog
        isOpen={isMessageDialogOpen}
        title="Sign Message"
        text="Enter the message to sign"
        inputLabel="Message"
        onAccept={(message) => {
          signMessage(message);
          setIsMessageDialogOpen(false);
        }}
        onCancel={() => setIsMessageDialogOpen(false)}
      />

      <FormDialog
        isOpen={isTransactionDialogOpen}
        title="Start transaction"
        text="Send small amount to the following target address"
        inputLabel="Enter target address"
        onAccept={(target) => {
          sendTransaction(target);
          setIsTransactionDialogOpen(false);
        }}
        onCancel={() => setIsTransactionDialogOpen(false)}
      />
    </>
  );
}

export default App;
