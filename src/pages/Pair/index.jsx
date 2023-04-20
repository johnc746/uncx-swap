import React, { useEffect, useState } from 'react';

import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import LockPage from '../LockPage';
import WithdrawPage from '../WithdrawPage';

const Pair = () => {

    const [type, setType] = useState("lock");

    return (
        <Container className='d-flex flex-column align-items-center justify-content-center'
            sx={{ minHeight: '100vh' }}>
            <Box className='d-flex mb-2'
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'primary.main',
                    boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                    borderRadius: '20px',
                    padding: '20px'
                }}
            >
                <Typography
                    color={type == 'lock' ? 'primary.green' : 'primary.text'}
                    sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                        marginRight: '40px'
                    }}
                    onClick={(e) => {setType("lock")}}
                >
                    New Lock
                </Typography>
                <Typography
                    color={type == 'withdraw' ? 'primary.green' : 'primary.text'}
                    sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                    }}
                    onClick={(e) => {setType("withdraw")}}
                >
                    Withdraw
                </Typography>
            </Box>
            {type == "lock" ?
                <LockPage /> :
                <WithdrawPage />
            }
        </Container>
    );
}

export default Pair;