import { useEffect, useState } from 'react';
import { SafeEventEmitterProvider } from '@web3auth/base';
import RPC from './lib/ethersRPC';
import { Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { EthHashInfo } from '@safe-global/safe-react-components';
import AppBar from './components/AppBar';
import FormDialog from './components/FormDialog';
import SafeAuth from './lib/SafeAuth';

function App() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [safeAuth, setSafeAuth] = useState<SafeAuth>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isTransactionExecution, setIsTransactionExecution] = useState(false);

  useEffect(() => {
    setSafeAuth(new SafeAuth('web3Auth', '5'));
  }, []);

  const login = async () => {
    if (!safeAuth) return;

    const response = await safeAuth.signIn();
    setProvider(safeAuth.getProvider());
    setAddress(response.eoa.address);
    setBalance(response.eoa.balance);
    setChainId(response.chainId);
    setUserInfo(response.userInfo);
  };

  const logout = async () => {
    if (!safeAuth) return;

    await safeAuth.signOut();

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
