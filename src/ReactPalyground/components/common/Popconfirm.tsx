import { FC, useState } from 'react';
import { Popover, Typography, Box, Button } from '@mui/material';

interface PopconfirmProps {
  trigger: React.ReactElement;
  onConfirm: (event: React.MouseEvent<HTMLElement>) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  message?: string;
}

const Popconfirm: FC<PopconfirmProps> = ({
  trigger,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消',
  message = '确定要执行此操作吗？',
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (onCancel) onCancel();
  };

  const handleConfirm = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onConfirm(event);
    handleClose();
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div onClick={handleClick}>{trigger}</div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box p={2}>
          <Typography>{message}</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginRight: 8 }}>
              {confirmText}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              {cancelText}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default Popconfirm;
