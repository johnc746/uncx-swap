import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import { SmallIcon } from './style';
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
    { symbol: "eth", address: "0x0000000000000000000000000000000000000000", url: "https://explorer.zksync.io/images/currencis/eth.svg" },
    { symbol: "mute", address: "0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42", url: "https://explorer.zksync.io/images/currencis/mute.svg" },
    { symbol: "usdc", address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", url: "https://explorer.zksync.io/images/currencis/usdc.svg" },
];

const nettype = 'mainnet';

const Pair = () => {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [connectStatus, setConnectStatus] = useState("");
    const [inputAddress, setInputAddress] = useState("");

    const [allPairs, setAllPairs] = useState([]);

    const [showPair, setShowPair] = useState();
    const [showPairInfo, setShowPairInfo] = useState();

    const [loadingFlag, setLoadingFlag] = useState(false);

    const getWeb3 = () => {
        return new Web3(nettype == 'testnet' ? zksync_testnet_rpc : zksync_mainnet_rpc);
    }

    const getWeb3Contract = (abi, address) => {
        let web3 = getWeb3();
        return new web3.eth.Contract(abi, address);
    }

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

    useEffect(() => {

        console.log(mute_factory_abi);
        readPairs();

        console.log('account', account);
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

        if (address != "") {

            let temp_pair = allPairs.filter((pair) => {
                if (pair == address) return true;
                return false;
            })

            if (temp_pair.length > 0) {

                const pair_contract = getWeb3Contract(pair_abi, temp_pair[0])

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
            } else {
                setShowPairInfo();
            }
        } else {
            setShowPairInfo();
        }
        setInputAddress(address);
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
                                        src={token_img.filter((token) => {
                                            if (token.address == showPairInfo.token0) return true;
                                            return false;
                                        }).length > 0 ? token_img.filter((token) => {
                                            if (token.address == showPairInfo.token0) return true;
                                            return false;
                                        })[0] : "https://explorer.zksync.io/images/currencies/customToken.svg"}
                                        alt=''
                                        sx={{ borderRadius: '50%' }}
                                    />
                                    <SmallIcon
                                        src={token_img.filter((token) => {
                                            if (token.address == showPairInfo.token1) return true;
                                            return false;
                                        }).length > 0 ? token_img.filter((token) => {
                                            if (token.address == showPairInfo.token1) return true;
                                            return false;
                                        })[0] : "https://explorer.zksync.io/images/currencies/customToken.svg"}
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
                        >
                            CONTINUE
                        </Button>
                    </Box>
                    :<></>}
                    <Box sx={{ display: 'flex' }}>
                        {loadingFlag ? <CircularProgress /> : <></>}
                    </Box>
                
            </Box>
        </Container>
    );
}

export default Pair;