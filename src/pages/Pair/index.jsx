import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import { SmallIcon } from './style';
import { useMetaMask } from "metamask-react";

const ariaLabel = { 'aria-label': 'description' };

const Pair = () => {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [connectStatus, setConnectStatus] = useState("");
    const [inputAddress, setInputAddress] = useState("");

    useEffect(() => {
        console.log('account', account);
        if (status === "notConnected" || status === "initializing") {
            setConnectStatus("Connect Wallet");
        } else if (status === "connected") {
            setConnectStatus(account);
            setInputAddress(account);
        }
        else {
            setConnectStatus(status);
        }
    }, [status])

    const onChangeAddress = (e) => {
        setInputAddress(e.target.value);
    }

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
                        src="https://testnet.switch.mute.io/icon.png"
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
                    onChange={onChangeAddress}
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
                    value={inputAddress}
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
                {!account ?
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
                            onClick={connect}
                        >
                            {connectStatus}
                        </Button>
                    </Box>
                    :
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '600px',
                            backgroundColor: 'primary.main',
                            boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                            borderRadius: '20px',
                            marginTop: '30px',
                            padding: '20px'
                        }}
                    >
                        <Typography
                            color='primary.text'
                            sx={{
                                fontSize: '24px',
                                marginBottom: '30px'
                            }}
                        >
                            Pair found
                        </Typography>
                        <Box
                            className='d-flex align-items-center justify-content-between mb-3 w-100'
                        >
                            <Box className='d-flex align-items-center'>
                                <Box>
                                    <SmallIcon
                                        src="https://testnet.switch.mute.io/icon.png"
                                        alt='Mute.Switch'
                                        sx={{ borderRadius: '50%' }}
                                    />
                                    <SmallIcon
                                        src="https://testnet.switch.mute.io/icon.png"
                                        alt='Mute.Switch'
                                        className='me-3'
                                        sx={{ borderRadius: '50%' }}
                                    />
                                </Box>
                                <Box className='d-flex align-items-center'>
                                    <Typography
                                        color='primary.text'
                                        sx={{
                                            fontSize: '16px',
                                        }}
                                    >
                                        WETH / DEXT
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                color='primary.text'
                                sx={{
                                    fontSize: '16px',
                                }}
                            >
                                0
                            </Typography>
                        </Box>
                        <Button
                            className='w-100'
                            sx={{
                                height: '50px',
                                backgroundColor: 'primary.green',
                                borderRadius: '100px',
                                color: 'white',
                                marginTop: '20px',

                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            CONTINUE
                        </Button>
                    </Box>
                }
            </Box>
        </Container>
    );
}

export default Pair;