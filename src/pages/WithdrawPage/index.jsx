import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { SmallIcon, MiddleIcon } from './style';
import dayjs from 'dayjs';
import Web3 from "web3";
import { zksync_mainnet_chainid, zksync_testnet_chainid, zksync_mainnet_rpc, zksync_testnet_rpc, mute_factory_abi, mute_factory_address_mainnet, mute_factory_address_testnet } from '../../contract/mute_factory.js';
import { pair_abi } from '../../contract/pair';
import { lock_abi, lock_address_mainnet } from '../../contract/lock';

import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";

import { toast } from 'react-toastify';

dayjs.extend(duration)
dayjs.extend(relativeTime)

const Injected = new InjectedConnector({
    supportedChainIds: [zksync_mainnet_chainid, zksync_testnet_chainid]
});

const ariaLabel = { 'aria-label': 'description' };

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

const WithdrawPage = () => {
    const { account, library, activate, deactivate } = useWeb3React();

    const [connectStatus, setConnectStatus] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [balance, setBalance] = useState(0);
    const [showPairInfo, setShowPairInfo] = useState();

    const [step, setStep] = useState("select_pair");

    const [depositDetails, setDepositDetails] = useState([]);
    const [ethBalance, setEthBalance] = useState(0);
    const [fee, setFee] = useState(0);

    const [loading, setLoading] = useState(false);

    const getWeb3 = () => {
        return new Web3(nettype == 'testnet' ? zksync_testnet_rpc : zksync_mainnet_rpc);
    }

    const getWeb3Contract = (abi, address) => {
        let web3 = getWeb3();
        return new web3.eth.Contract(abi, address);
    }

    const getContract = (abi, address, library) => {
        try {
            return new ethers.Contract(address, abi, library.getSigner());
        } catch {
            return false;
        }
    };

    useEffect(() => {
        console.log("account:", account);
        if (account == undefined || account == "") {
            setConnectStatus("");
        } else {
            setConnectStatus(account);
            getEthBalance(account);
        }
    }, [account])

    const getEthBalance = async (account) => {
        let web3 = getWeb3();
        let eth_balance = await web3.eth.getBalance(account);
        setEthBalance(web3.utils.fromWei(eth_balance, 'ether'));
    }

    const onContinue = async () => {
        setStep("withdraw");
        setLoading(true);

        let web3 = getWeb3();

        const lock_contract = getWeb3Contract(lock_abi, lock_address_mainnet)
        let depositIds = await lock_contract.methods
            .getAllDepositIds()
            .call()
        console.log("depositIds:", depositIds);

        let deposit_detail_tmp = [];
        for (let i = 0; i < depositIds.length; i++) {
            let deposit_detail = await lock_contract.methods
                .getDepositDetails(depositIds[i])
                .call()

            deposit_detail_tmp.push(deposit_detail);
        }

        console.log(deposit_detail_tmp);

        setDepositDetails(deposit_detail_tmp);

        let withdraw_fee = await lock_contract.methods
            .getFeesInETH(inputAddress)
            .call()

        setFee(web3.utils.fromWei(withdraw_fee, 'ether'));
        setLoading(false);
    }

    const onChangeAddress = async (e) => {

        let address = e.target.value;

        console.log("onChange", address)

        try {

            let web3 = getWeb3();
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

            let lp_balance = await pair_contract.methods
                .balanceOf(account)
                .call()

            setShowPairInfo({ name: pair_name, token0, token1 });
            setBalance(web3.utils.fromWei(lp_balance, 'ether'));

        } catch (error) {
            setShowPairInfo();
        }

        setInputAddress(address);
    }

    const onWithdraw = async (detail, id) => {

        let web3 = getWeb3();

        try {
            const lock_contract = getContract(lock_abi, lock_address_mainnet, library);

            console.log("withdraw...", id, detail._tokenAmount)

            let tx = await lock_contract.withdrawTokens(id, detail._tokenAmount);

            console.log('tx:', tx.hash)

            const resolveAfter3Sec = new Promise((resolve) =>
                setTimeout(resolve, 20000)
            );

            toast.promise(resolveAfter3Sec, {
                pending: "Waiting for confirmation 👌",
            });

            var interval = setInterval(async function () {
                let web3 = getWeb3();
                var response = await web3.eth.getTransactionReceipt(tx.hash);
                if (response !== null) {
                    if (response.status === true) {
                        clearInterval(interval);
                        toast.success("Success ! your last transaction is success 👍");
                    } else if (response.status === false) {
                        clearInterval(interval);
                        toast.error("Error ! Your last transaction is failed.");
                    } else {
                    }
                }
            }, 5000);
        } catch (error) {
            toast.error("Error ! Something went wrong.");
            console.log(error);
        }
    }

    return (
        <Box className='w-100 d-flex justify-content-center'>
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
                    <Typography
                        className='mt-1 mb-1'
                        color='#cccccc'
                        sx={{
                            fontSize: '30px',
                            fontWeight: '700',
                        }}
                    >
                        Withdraw
                    </Typography>
                    {connectStatus == "" ?
                        <Box className='d-flex align-items-center justify-content-center'>
                            <Button variant="outlined"
                                sx={{
                                    borderColor: 'primary.outline',
                                    borderRadius: '50px',
                                    color: 'primary.green',

                                    '&:hover': {
                                        backgroundColor: '#68d67c20'
                                    }
                                }}
                                onClick={(e) => { activate(Injected) }}
                            >
                                Connect Wallet
                            </Button>
                        </Box>
                        :
                        (
                            <>
                                <Typography
                                    className='text-center'
                                    variant='h4'
                                    color='primary.text'
                                    sx={{
                                        fontSize: '16px',
                                        lineHeight: 1.5,
                                        marginTop: '30px'
                                    }}
                                >
                                    Enter the Uniswap V2 pair address youd like to access
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
                                                    width: '100px',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {balance}
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
                                            onClick={onContinue}
                                        >
                                            CONTINUE
                                        </Button>
                                    </Box>
                                    : <></>
                                }
                            </>
                        )
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
                    <Button
                        className='d-flex justify-left align-items-center w-20 mb-3'
                        sx={{
                            height: '40px',
                            backgroundColor: 'transparent',
                            borderRadius: '5px',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#9999995f'
                            }
                        }}
                        onClick={(e) => { setStep("select_pair") }}
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
                    </Button>
                    <Typography
                        className='text-center mt-5 mb-5'
                        color='#cccccc'
                        sx={{
                            fontSize: '40px',
                            fontWeight: '700',
                        }}
                    >
                        Withdraw Liquidity
                    </Typography>
                    <Box
                        className='d-flex align-items-center justify-content-center w-100'
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
                            <Box>
                                <MiddleIcon
                                    src={tokenImage(showPairInfo.token1)}
                                    alt=''
                                    className='me-3'
                                    sx={{ borderRadius: '50%' }}
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
                        </Box>
                    </Box>
                    <Typography
                        className='text-center'
                        color='primary.title'
                        sx={{
                            fontSize: '10px',
                            marginTop: '5px'
                        }}
                    >
                        {inputAddress}
                    </Typography>
                    {!loading ?
                        <Box
                            className='d-flex flex-column'
                        >
                            {depositDetails.map((depositDetail, index) => {
                                if (depositDetail._tokenAddress == inputAddress && depositDetail._withdrawalAddress == account)
                                    return (
                                        <Box className='d-flex flex-column'
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                                                borderRadius: '20px',
                                                padding: '20px',
                                                margin: '5px'
                                            }}
                                        >
                                            <Box className='d-flex align-items-center'>
                                                <Box className='me-2'>
                                                    <MiddleIcon
                                                        src={tokenImage(showPairInfo.token0)}
                                                        alt=''
                                                        sx={{
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                </Box>
                                                <Box className='me-2'>
                                                    <MiddleIcon
                                                        src={tokenImage(showPairInfo.token1)}
                                                        alt=''
                                                        sx={{
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    color='white'
                                                    sx={{ fontSize: '20px' }}
                                                >
                                                    {getWeb3().utils.fromWei(depositDetail._tokenAmount, 'ether')}
                                                </Typography>
                                            </Box>
                                            <Box className='d-flex justify-content-end align-items-center'>
                                                <Typography
                                                    variant='h4'
                                                    color='primary.text'
                                                    sx={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        marginRight: '20px'
                                                    }}
                                                >
                                                    {dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'month') != 0 ? dayjs.duration(dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'month'), "months").humanize(true) :
                                                        dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'day') != 0 ? dayjs.duration(dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'day'), "days").humanize(true) :
                                                            dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'hour') != 0 ? dayjs.duration(dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'hour'), "hours").humanize(true) :
                                                                dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'minute') != 0 ? dayjs.duration(dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'minute'), "minutes").humanize(true) :
                                                                    dayjs.duration(dayjs(Number(depositDetail._unlockTime + '000')).diff(dayjs(Date.now()), 'second'), "seconds").humanize(true)}
                                                </Typography>
                                                <Button
                                                    sx={{
                                                        backgroundColor: 'primary.green',
                                                        borderRadius: '50px',
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        height: '40px',
                                                        disabled: `${Number(depositDetail._unlockTime + '000') > Date.now()/* || ethBalance < fee */ ? "true" : "false"}`,
                                                        '&:hover': {
                                                            backgroundColor: '#68d67c20'
                                                        }
                                                    }}
                                                    onClick={(e) => { onWithdraw(depositDetail, index + 1) }}
                                                >
                                                    Withdraw
                                                </Button>
                                                {/* {ethBalance < fee ?
                                                <Typography
                                                    variant='h4'
                                                    color='#ff0000'
                                                    className='text-center'
                                                    sx={{
                                                        fontSize: '14px',
                                                        fontWeight: '400'
                                                    }}
                                                >
                                                    You do not have enough ETH in your wallet to perform this transaction. {fee} ETH required.
                                                </Typography> :
                                                <></>
                                            } */}
                                            </Box>
                                        </Box>
                                    )
                            })}
                        </Box> :
                        <Box className="d-flex justify-content-center">
                            <CircularProgress color="success" />
                        </Box>
                    }
                </Box>
            }
        </Box>
    );
}

export default WithdrawPage;