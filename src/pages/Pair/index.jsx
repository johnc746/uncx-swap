import React, { useState } from 'react';
import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import { SmallIcon } from './style';

const ariaLabel = { 'aria-label': 'description' };

const Pair = () => {
    return (
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ height: '100vh' }}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'primary.main',
                    boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                    borderRadius: '20px',
                    padding: '30px'
                }}
            >
                <Box
                    className='d-flex align-items-center mb-3'
                >
                    <SmallIcon
                        src="https://pbs.twimg.com/profile_images/1600140648392400900/PL8aonbi_400x400.jpg"
                        alt='Mute.Switch'
                        className='me-3'
                        sx={{ borderRadius: '50%' }}
                    />
                    <Box className='d-flex align-items-center'>
                        <Typography
                            color='primary.text'
                            sx={{
                                fontSize: '20px',
                                fontWeight: '500',
                            }}
                        >
                            Uniswap Mute Switch
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    variant='h4'
                    color='primary.text'
                    sx={{
                        fontSize: '14px',
                        lineHeight: 1.5
                    }}
                >
                    Use the locker to prove to investors you have locked liquidity. If you are not a token developer, this section is almost definitely not for you.
                </Typography>
                <Typography
                    variant='h4'
                    color='primary.text'
                    sx={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        marginTop: '30px'
                    }}
                >
                    Enter the Mute Switch pair address you'd like to lock liquidity for
                </Typography>
                <Typography
                    variant='h4'
                    color='primary.text'
                    sx={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        marginTop: '30px'
                    }}
                >
                    Our lockers offer
                    <ul>
                        <li>Lock splitting</li>
                        <li>Liquidity Migration</li>
                        <li>Relocking</li>
                        <li>Lock ownership transfer</li>
                    </ul>
                </Typography>
                <TextField placeholder="0x..." inputProps={ariaLabel} focused
                    sx={{
                        width: '100%',
                        backgroundColor: 'primary.dark',
                        borderRadius: '18px',
                        marginTop: '10px',
                        padding: '0px',

                        input: {
                            color: 'primary.text',
                            paddingBottom: '12px',
                            paddingTop: '12px',
                            fontSize: '14px'
                        },

                        fieldSet: {
                            border: 'none'
                        }
                    }}
                />
                <Typography
                    className='text-center'
                    color='primary.title'
                    sx={{
                        fontSize: '10px',
                        marginTop: '5px'
                    }}
                >
                    e.g. 0x21A104A118e43BeE49206e3e8b115580234dD423
                </Typography>
                <Box className='d-flex align-items-center justify-content-center'>
                    <Button variant="outlined"
                        sx={{
                            borderColor: 'primary.outline',
                            borderRadius: '50px',
                            color: 'primary.green',
                            marginTop: '30px',

                            '&:hover': {
                                backgroundColor: '#68d67c20'
                            }
                        }}
                    >
                        Connect Wallet
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Pair;