import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type FormDialogProps = {
  isOpen: boolean;
  title: string;
  text: string;
  inputLabel: string;
  onCancel: () => void;
  onAccept: (inputText: string) => void;
};

export default function FormDialog({
  isOpen,
  title,
  text,
  onAccept,
  onCancel,
  inputLabel,
}: FormDialogProps) {
  const [inputText, setInputText] = React.useState('');

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{text}</DialogContentText>

        <TextField
          id="form-dialog-input"
          autoFocus
          margin="dense"
          label={inputLabel}
          type="text"
          fullWidth
          variant="standard"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onAccept(inputText)}>Accept</Button>
      </DialogActions>
    </Dialog>
  );
}
