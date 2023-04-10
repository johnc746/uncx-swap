import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import { ArrowBack, Event, KeyboardArrowDown, Error } from '@mui/icons-material';

import { SmallIcon, MiddleIcon } from './style';
import { useMetaMask } from "metamask-react";
// import { tokens } from 'zksync';
import Web3 from "web3";
import { zksync_mainnet_chainid, zksync_testnet_chainid, zksync_mainnet_rpc, zksync_testnet_rpc, mute_factory_abi, mute_factory_address_mainnet, mute_factory_address_testnet } from '../../contract/mute_factory.js';
import { pair_abi } from '../../contract/pair';

import CircularProgress from '@mui/material/CircularProgress';

const ariaLabel = { 'aria-label': 'description' };

// async function findPairedToken(symbol) {
//     const allTokens = await tokens.getTokens();
//     const token = allTokens.find((t) => t.symbol === symbol);
//     if (!token) {
//         throw new Error(`Token ${symbol} not found`);
//     }
//     const pair = allTokens.find((t) => t.id === token.pair_id);
//     if (!pair) {
//         throw new Error(`Pair for token ${symbol} not found`);
//     }
//     return pair;
// }

const token_img = [
    { symbol: "eth", address: "0x0000000000000000000000000000000000000000", url: "https://explorer.zksync.io/images/currencies/eth.svg" },
    { symbol: "mute", address: "0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42", url: "https://explorer.zksync.io/images/currencies/mute.svg" },
    { symbol: "usdc", address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", url: "https://explorer.zksync.io/images/currencies/usdc.svg" },
];

const nettype = 'mainnet';

const tokenImage = (tokenaddress) => {
    switch (tokenaddress) {
        case "0x0000000000000000000000000000000000000000":
            return "https://explorer.zksync.io/images/currencies/eth.svg";
        case "0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42":
            return "https://explorer.zksync.io/images/currencies/mute.svg";
        case "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4":
            return "https://explorer.zksync.io/images/currencies/usdc.svg";
        default:
            return "https://explorer.zksync.io/images/currencies/customToken.svg";
    }
}

const Pair = () => {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [connectStatus, setConnectStatus] = useState("");
    const [inputAddress, setInputAddress] = useState("");

    // const [allPairs, setAllPairs] = useState([]);

    const [showPair, setShowPair] = useState();
    const [showPairInfo, setShowPairInfo] = useState();

    const [loadingFlag, setLoadingFlag] = useState(false);

    const [step, setStep] = useState("select_pair");

    const getWeb3 = () => {
        return new Web3(nettype == 'testnet' ? zksync_testnet_rpc : zksync_mainnet_rpc);
    }

    const getWeb3Contract = (abi, address) => {
        let web3 = getWeb3();
        return new web3.eth.Contract(abi, address);
    }

    /*
    const readPairs = async () => {
        setLoadingFlag(true);

        try {
            const mute_factory_contract = getWeb3Contract(mute_factory_abi, nettype == 'testnet' ? mute_factory_address_testnet : mute_factory_address_mainnet);

            const pairs_length = await mute_factory_contract.methods
                .allPairsLength()
                .call();

            console.log(pairs_length);

            let all_pairs = [];

            for (let i = 0; i < pairs_length; i++) {
                let pair_address = await mute_factory_contract.methods
                    .allPairs(i)
                    .call()

                if (i == 0) console.log(pair_address)

                console.log(all_pairs);
                all_pairs.push(pair_address)
            }
            setAllPairs(all_pairs);
        } catch (e) {
            console.error(e);
            setLoadingFlag(false);
            return;
        }
        setLoadingFlag(false);
    }
    */

    useEffect(() => {

        // readPairs();

        if (status === "notConnected" || status === "initializing") {
            setConnectStatus("Connect Wallet");
        } else if (status === "connected") {
            setConnectStatus(account);
            // setInputAddress(account);
        }
        else {
            setConnectStatus(status);
        }
    }, [status])

    const onChangeAddress = async (e) => {

        let address = e.target.value;

        console.log("onChange", address)

        try {
            const pair_contract = getWeb3Contract(pair_abi, address)

            let pair_name = await pair_contract.methods
                .name()
                .call()

            let token0 = await pair_contract.methods
                .token0()
                .call()

            let token1 = await pair_contract.methods
                .token1()
                .call()

            setShowPairInfo({ name: pair_name, token0, token1 });
        } catch (error) {
            setShowPairInfo();
        }

        setInputAddress(address);
    }

    return (
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ height: '100vh' }}>
            {step == "select_pair" ?
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
                            src={tokenImage("0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42")}
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
                    {showPairInfo ?
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
                                            src={tokenImage(showPairInfo.token0)}
                                            alt=''
                                            sx={{ borderRadius: '50%' }}
                                        />
                                        <SmallIcon
                                            src={tokenImage(showPairInfo.token1)}
                                            alt=''
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
                                            {showPairInfo.name}
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
                                onClick={(e) => { setStep("lock") }}
                            >
                                CONTINUE
                            </Button>
                        </Box>
                        : <></>
                    }
                </Box> :
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
                        className='d-flex justify-left align-items-center mb-3'
                    >
                        <ArrowBack
                            sx={{
                                color: 'white'
                            }}
                        />
                        <Typography
                            color='primary.text'
                            sx={{
                                fontSize: '20px',
                                fontWeight: '500',
                            }}
                        >
                            Back
                        </Typography>
                    </Box>
                    <Typography
                        className='text-center mt-5 mb-5'
                        color='#cccccc'
                        sx={{
                            fontSize: '50px',
                            fontWeight: '700',
                        }}
                    >
                        Lock Liquidity
                    </Typography>
                    <Box
                        className='d-flex align-items-center justify-content-center mb-5 w-100'
                    >
                        <Box className='d-flex align-items-center'>
                            <Box className='me-2'
                            >
                                <MiddleIcon
                                    src={tokenImage(showPairInfo.token0)}
                                    alt=''
                                    sx={{
                                        borderRadius: '50%',
                                    }}
                                />
                            </Box>
                            <Box
                                className='d-flex align-items-center me-2'
                            >
                                <Typography
                                    color='primary.text'
                                    sx={{
                                        fontSize: '24px',
                                    }}
                                >
                                    {showPairInfo.name}
                                </Typography>
                            </Box>
                            <Box>
                                <MiddleIcon
                                    src={tokenImage(showPairInfo.token1)}
                                    alt=''
                                    className='me-3'
                                    sx={{ borderRadius: '50%' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Typography
                        variant='h2'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '20px',
                            fontWeight: '800'
                        }}
                    >
                        Lock how many LP tokens?
                    </Typography>
                    <Box
                        className='mb-5'
                        sx={{
                            width: '100%',
                            backgroundColor: '#081540',
                            boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                            borderRadius: '20px',
                            padding: '20px'
                        }}
                    >
                        <Typography
                            variant='h4'
                            color='primary.text'
                            className='text-end mb-2'
                            sx={{
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            Balance: 0
                        </Typography>
                        <Box className='d-flex justify-content-between align-items-center'>
                            <Typography
                                variant='h4'
                                color='primary.text'
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                0
                            </Typography>
                            <Box className='d-flex align-items-center'>
                                <Typography
                                    variant='h4'
                                    color='primary.text'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    UNIV2
                                </Typography>
                                <Button
                                    className='w-50 ms-2'
                                    sx={{
                                        height: '40px',
                                        backgroundColor: 'primary.green',
                                        borderRadius: '5px',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#68d67c5f'
                                        }
                                    }}
                                >
                                    MAX
                                </Button>
                            </Box>
                        </Box>
                        <Box className='d-flex align-items-center'>
                            <Button
                                className='w-12 ms-2 border border-light border-opacity-50 rounded-5'
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#9999995f'
                                    }
                                }}
                            >
                                25%
                            </Button>
                            <Button
                                className='w-12 ms-2 border border-light border-opacity-50 rounded-5'
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '20px',
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#9999995f'
                                    }
                                }}
                            >
                                50%
                            </Button>
                            <Button
                                className='w-12 ms-2 border border-light border-opacity-50 rounded-5'
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '20px',
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#9999995f'
                                    }
                                }}
                            >
                                75%
                            </Button>
                            <Button
                                className='w-12 ms-2 border border-light border-opacity-50 rounded-5'
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '20px',
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#9999995f'
                                    }
                                }}
                            >
                                100%
                            </Button>
                        </Box>
                    </Box>
                    <Typography
                        variant='h2'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '20px',
                            fontWeight: '800'
                        }}
                    >
                        Unlock Date
                    </Typography>
                    <Box
                        className='mb-5'
                        sx={{
                            width: '100%',
                            backgroundColor: '#081540',
                            boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                            borderRadius: '20px',
                            padding: '20px'
                        }}
                    >
                        <Box className='d-flex justify-content-between align-items-center'>
                            <Box className='d-flex flex-column'>
                                <Typography
                                    className='mb-2'
                                    variant='h4'
                                    color='primary.text'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Tue 10 Oct 2023 18:21
                                </Typography>
                                <Typography
                                    variant='h4'
                                    color='primary.text'
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    in 6 months
                                </Typography>
                            </Box>

                            <Button
                                className='w-15 ms-2 d-flex justiry-content-center align-items-center'
                                sx={{
                                    height: '40px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#9999995f'
                                    }
                                }}
                            >
                                <Event
                                    sx={{
                                        color: 'primary.green'
                                    }}
                                />
                                <KeyboardArrowDown
                                    sx={{
                                        color: 'primary.green'
                                    }}
                                />
                            </Button>
                        </Box>
                    </Box>
                    <Typography
                        variant='h2'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '20px',
                            fontWeight: '800'
                        }}
                    >
                        Who can withdraw the tokens?
                    </Typography>
                    <Box className='d-flex mb-5 justify-content-center align-items-center'>
                        <Button
                            className='w-15 ms-2'
                            sx={{
                                height: '40px',
                                backgroundColor: 'primary.green',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            Me
                        </Button>
                        <Button
                            className='w-40 ms-2'
                            sx={{
                                height: '40px',
                                backgroundColor: 'transparent',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#9999995f'
                                }
                            }}
                        >
                            Someone else
                        </Button>
                    </Box>
                    <Typography
                        variant='h2'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '20px',
                            fontWeight: '800'
                        }}
                    >
                        Do you have a valid referral address?
                    </Typography>
                    <Typography
                        variant='h4'
                        color='#cccccc'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '12px',
                            fontWeight: '400'
                        }}
                    >
                        Enjoy a 10% flatrate discount if so!
                    </Typography>
                    <Box className='d-flex mb-5 justify-content-center align-items-center'>
                        <Button
                            className='w-15 ms-2'
                            sx={{
                                height: '40px',
                                backgroundColor: 'primary.green',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            No
                        </Button>
                        <Button
                            className='w-15 ms-2'
                            sx={{
                                height: '40px',
                                backgroundColor: 'transparent',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#9999995f'
                                }
                            }}
                        >
                            Yes
                        </Button>
                    </Box>
                    <Typography
                        variant='h2'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '20px',
                            fontWeight: '800'
                        }}
                    >
                        Fee options
                    </Typography>
                    <Box className='d-flex justify-content-center'>
                        <Button
                            className='w-50 p-5 d-flex flex-column'
                            sx={{
                                height: '40px',
                                backgroundColor: 'primary.green',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            <Typography
                                variant='h2'
                                color='primary.text'
                                className='text-center mt-3 mb-2'
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: '600'
                                }}
                            >
                                0.08 ETH
                            </Typography>
                            <Typography
                                variant='h2'
                                color='primary.text'
                                className='text-center mb-3'
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '400'
                                }}
                            >
                                (+ 1% UNIV2)
                            </Typography>
                        </Button>
                    </Box>
                    <Typography
                        variant='h4'
                        color='#cccccc'
                        className='text-center mb-5'
                        sx={{
                            fontSize: '12px',
                            fontWeight: '400'
                        }}
                    >
                        Your balance: 0 ETH
                    </Typography>
                    <Typography
                        variant='h4'
                        color='primary.text'
                        className='text-center mb-3'
                        sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                        }}
                    >
                        Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.
                    </Typography>
                    <Box className='d-flex justify-content-center mb-3'>
                        <Button
                            className='w-50 me-2'
                            sx={{
                                height: '50px',
                                backgroundColor: 'primary.green',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            Approve
                        </Button>
                        <Button
                            className='w-50'
                            sx={{
                                height: '50px',
                                backgroundColor: 'primary.green',
                                borderRadius: '5px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#68d67c5f'
                                }
                            }}
                        >
                            Lock
                        </Button>

                    </Box>
                    <Box
                        className='d-flex justify-content-between align-items-center'
                        sx={{
                            width: '100%',
                            backgroundColor: '#ff5555',
                            opacity: [0.5, 0.5, 0.5],
                            boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                            borderRadius: '5px',
                            padding: '20px'
                        }}
                    >
                        <Error
                            sx={{
                                color: 'red'
                            }}
                        />
                        <Typography
                            variant='h4'
                            color='primary.text'
                            className='text-center'
                            sx={{
                                fontSize: '14px',
                                fontWeight: '400'
                            }}
                        >
                            You do not have enough ETH in your wallet to perform this transaction. 0.08 ETH required.
                        </Typography>
                    </Box>
                </Box>

            }
        </Container>
    );
}

export default Pair;