import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  return (
    <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
      {alerts.length > 0 &&
        alerts.map(alert => (
          <Alert key={alert.id} severity={alert.type}>
            {alert.msg}
          </Alert>
        ))}
    </Stack>
  );
};

export default Alerts; 