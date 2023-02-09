import { useEffect, useState } from 'react';
import { SafeEventEmitterProvider } from '@web3auth/base';
import { Box, Divider, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { EthHashInfo } from '@safe-global/safe-react-components';
import {
  SafeAuth,
  SafeAuthProviderType,
  SafeAuthSignInData,
} from '@safe-global/account-abstraction-auth';

import { RPC } from './utils';
import AppBar from './components/AppBar';
import FormDialog from './components/FormDialog';

function App() {
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<SafeAuthSignInData | null>(null);
  const [safeAuth, setSafeAuth] = useState<SafeAuth>();
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isTransactionExecution, setIsTransactionExecution] = useState(false);

  useEffect(() => {
    setSafeAuth(
      new SafeAuth(SafeAuthProviderType.Web3Auth, {
        chainId: '0x5',
        txServiceUrl: 'https://safe-transaction-goerli.safe.global',
        authProviderConfig: {
          rpcTarget: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
          web3AuthClientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
          web3AuthNetwork: 'testnet',
          theme: 'dark',
        },
      })
    );
  }, []);

  const login = async () => {
    if (!safeAuth) return;

    const response = await safeAuth.signIn();
    setSafeAuthSignInResponse(response);
    setProvider(safeAuth.getProvider());
  };

  const logout = async () => {
    if (!safeAuth) return;

    await safeAuth.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
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
          {safeAuthSignInResponse?.userInfo && (
            <>
              <EthHashInfo
                address={safeAuthSignInResponse?.eoa.address}
                showCopyButton
                showPrefix
                prefix={safeAuthSignInResponse?.chainId === '1' ? 'eth' : 'gor'}
              />
              <Typography variant="h2" sx={{ mt: 3 }}>
                {Math.round(
                  Number(safeAuthSignInResponse?.eoa.balance) * 10000
                ) / 10000}{' '}
                <Typography variant="h3" component="span" color="primary">
                  ETH
                </Typography>
              </Typography>
              <Typography variant="h4" sx={{ mt: 4 }}>
                {safeAuthSignInResponse?.userInfo.name}
              </Typography>
              <Typography variant="body2" color="primary">
                {safeAuthSignInResponse?.userInfo.email}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item md={9} p={4}>
          {provider && (
            <>
              {safeAuthSignInResponse?.safes?.length ? (
                <>
                  <Typography variant="h3" color="secondary" fontWeight={700}>
                    Available Safes
                  </Typography>
                  {safeAuthSignInResponse?.safes?.map((safe, index) => (
                    <Box sx={{ my: 3 }} key={index}>
                      <EthHashInfo address={safe} showCopyButton />
                    </Box>
                  ))}
                </>
              ) : (
                <Typography variant="h4" color="secondary" sx={{ my: 3 }}>
                  You don't have any Safe available
                  <LoadingButton
                    size="small"
                    color="secondary"
                    onClick={() => console.log('TODO deployment')}
                    loading={isSigning}
                    variant="outlined"
                    sx={{ ml: 2 }}
                  >
                    <span>Deploy</span>
                  </LoadingButton>
                </Typography>
              )}
              <Divider sx={{ my: 4 }} />
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
