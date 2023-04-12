import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Link, Modal, Typography, Button } from '@mui/material';
import { ArrowBack, Event, KeyboardArrowDown, Error } from '@mui/icons-material';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { SmallIcon, MiddleIcon } from './style';
import { useMetaMask } from "metamask-react";
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

const Pair = () => {
    const { account, library, activate, deactivate } = useWeb3React();

    const [connectStatus, setConnectStatus] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [balance, setBalance] = useState(0);
    const [showPairInfo, setShowPairInfo] = useState();

    const [step, setStep] = useState("select_pair");

    const [lockAmount, setLockAmount] = useState(0);
    const [unlockOwner, setUnlockOwner] = useState("Me");
    const [unlockerAddress, setUnlockerAddress] = useState("");
    const [haveReferral, setHaveReferral] = useState("No");
    const [referralAddress, setReferralAddress] = useState("");
    const [openCalender, setOpenCalender] = useState(false);
    const [lockTime, setLockTime] = useState(dayjs());
    const [isReferralValid, setIsReferralValid] = useState(false);
    const [referralBalance, setReferralBalance] = useState(0);
    const [fee, setFee] = useState(0);

    const [ethBalance, setEthBalance] = useState(0);

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
        setStep("lock");

        let web3 = getWeb3();

        const pair_contract = getWeb3Contract(pair_abi, inputAddress)
        let lp_balance = await pair_contract.methods
            .balanceOf(account)
            .call()
        setBalance(web3.utils.fromWei(lp_balance, 'ether'));

        const lock_contract = getWeb3Contract(lock_abi, lock_address_mainnet)
        let lock_fee = await lock_contract.methods
            .getFeesInETH(inputAddress)
            .call()
        setFee(web3.utils.fromWei(lock_fee, 'ether'));
        if (unlockOwner == "Me") setUnlockerAddress(account);
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

    const onApprove = async () => {
        let web3 = getWeb3();
        try {

            const pair_contract = getContract(pair_abi, inputAddress, library);

            console.log(balance);

            console.log("approve:", lock_address_mainnet, web3.utils.toWei(balance, 'ether'), account)

            let tx = await pair_contract.approve(lock_address_mainnet, web3.utils.toWei(balance, 'ether'), { from: account });

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

    const onLock = async () => {
        // let web3 = getWeb3();

        // const lock_contract = getWeb3Contract(lock_abi, lock_address_mainnet)

        // console.log("lock...", inputAddress, unlockerAddress, web3.utils.toWei(lockAmount, 'ether'), lockTime.unix(), false)

        // await lock_contract.methods
        //     .lockToken(inputAddress, unlockerAddress, web3.utils.toWei(lockAmount, 'ether'), lockTime.unix(), false)
        //     .call()

        let web3 = getWeb3();
        try {

            const lock_contract = getContract(lock_abi, lock_address_mainnet, library);

            console.log("lock...", inputAddress, unlockerAddress, (Math.floor(web3.utils.toWei(lockAmount, 'kether') / 1000)).toString(), lockTime.unix(), web3.utils.toWei(fee, 'ether'), false)

            let tx = await lock_contract.lockToken(inputAddress, unlockerAddress, (Math.floor(web3.utils.toWei(lockAmount, 'kether') / 1000)).toString(), lockTime.unix(), false, { value: web3.utils.toWei(fee, 'ether')});


            console.log("tx:", tx.hash)
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
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ height: `${step == "select_pair" ? '100vh' : '140vh'}` }}>
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
                        Our lockers offer
                        <ul>
                            <li>Lock splitting</li>
                            <li>Liquidity Migration</li>
                            <li>Relocking</li>
                            <li>Lock ownership transfer</li>
                        </ul>
                    </Typography>
                    {connectStatus == "" ?
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
                                    Enter the Mute Switch pair address you'd like to lock liquidity for
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
                        )}
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
                    <Box className='mb-5'>
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
                                Balance: {balance}
                            </Typography>
                            <Box className='d-flex justify-content-between align-items-center'>
                                {/* <Typography
                                    variant='h4'
                                    color='primary.text'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {lockAmount}
                                </Typography> */}
                                <TextField placeholder="0" inputProps={ariaLabel} focused
                                    onChange={(e) => { setLockAmount(e.target.value) }}
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
                                    value={lockAmount}
                                />
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
                                        onClick={(e) => {
                                            setLockAmount(balance);
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
                                    onClick={(e) => {
                                        let web3 = getWeb3();
                                        setLockAmount(web3.utils.fromWei((web3.utils.toWei(balance, 'ether') * 250).toString(), 'kether'));
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
                                    onClick={(e) => {
                                        let web3 = getWeb3();
                                        setLockAmount(web3.utils.fromWei((web3.utils.toWei(balance, 'ether') * 500).toString(), 'kether'));
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
                                    onClick={(e) => {
                                        let web3 = getWeb3();
                                        setLockAmount(web3.utils.fromWei((web3.utils.toWei(balance, 'ether') * 750).toString(), 'kether'));
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
                                    onClick={(e) => {
                                        setLockAmount(balance);
                                    }}
                                >
                                    100%
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box className='mb-5'>
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
                            sx={{
                                width: '100%',
                                backgroundColor: '#081540',
                                boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                                borderRadius: '20px',
                                padding: '20px'
                            }}
                        >
                            <Box className='d-flex justify-content-between align-items-center position-relative'>
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
                                        {lockTime.format('ddd D MMM YYYY HH:mm')}
                                    </Typography>
                                    <Typography
                                        variant='h4'
                                        color='primary.text'
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {lockTime.diff(dayjs(), 'month') != 0 ? dayjs.duration(lockTime.diff(dayjs(), 'month'), "months").humanize(true) :
                                            lockTime.diff(dayjs(), 'day') != 0 ? dayjs.duration(lockTime.diff(dayjs(), 'day'), "days").humanize(true) :
                                                lockTime.diff(dayjs(), 'hour') != 0 ? dayjs.duration(lockTime.diff(dayjs(), 'hour'), "hours").humanize(true) :
                                                    lockTime.diff(dayjs(), 'minute') != 0 ? dayjs.duration(lockTime.diff(dayjs(), 'minute'), "minutes").humanize(true) :
                                                        dayjs.duration(lockTime.diff(dayjs(), 'second'), "seconds").humanize(true)}
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
                                    onClick={(e) => { setOpenCalender(!openCalender) }}
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
                                {openCalender ?
                                    <StaticDateTimePicker
                                        defaultValue={dayjs(Date.now())}
                                        sx={{
                                            position: 'absolute',
                                            right: '-350px',
                                        }}
                                        value={lockTime}
                                        onAccept={(value) => { setLockTime(value); setOpenCalender(false); }}
                                        onClose={() => { setOpenCalender(false); }}
                                    /> :
                                    <></>
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Box className='mb-5'>
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
                        <Box className='d-flex justify-content-center align-items-center'>
                            <Button
                                className='w-15 ms-2'
                                sx={{
                                    height: '40px',
                                    backgroundColor: `${unlockOwner == "Me" ? "primary.green" : "transparent"}`,
                                    borderRadius: '5px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: `${unlockOwner == "Me" ? '#68d67c5f' : "#9999995f"}`
                                    }
                                }}
                                onClick={(e) => { setUnlockOwner("Me") }}
                            >
                                Me
                            </Button>
                            <Button
                                className='w-40 ms-2'
                                sx={{
                                    height: '40px',
                                    backgroundColor: `${unlockOwner != "Me" ? "primary.green" : "transparent"}`,
                                    borderRadius: '5px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: `${unlockOwner != "Me" ? '#68d67c5f' : "#9999995f"}`
                                    }
                                }}
                                onClick={(e) => { setUnlockOwner("Someone else") }}
                            >
                                Someone else
                            </Button>
                        </Box>
                        {unlockOwner != "Me" ?
                            <TextField placeholder="Unlocker address" inputProps={ariaLabel} focused
                                onChange={(e) => { setUnlockerAddress(e.target.value) }}
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
                                value={unlockerAddress}
                            /> :
                            <></>
                        }
                    </Box>
                    <Box className='mb-5'>
                        <Typography
                            variant='h2'
                            color='primary.text'
                            className='text-center mb-1'
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
                        <Box className='d-flex justify-content-center align-items-center'>
                            <Button
                                className='w-15 ms-2'
                                sx={{
                                    height: '40px',
                                    backgroundColor: `${haveReferral == "No" ? "primary.green" : "transparent"}`,
                                    borderRadius: '5px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: `${haveReferral == "No" ? '#68d67c5f' : "#9999995f"}`
                                    }
                                }}
                                onClick={(e) => { setHaveReferral("No") }}
                            >
                                No
                            </Button>
                            <Button
                                className='w-15 ms-2'
                                sx={{
                                    height: '40px',
                                    backgroundColor: `${haveReferral != "No" ? "primary.green" : "transparent"}`,
                                    borderRadius: '5px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: `${haveReferral != "No" ? '#68d67c5f' : "#9999995f"}`
                                    }
                                }}
                                onClick={(e) => { setHaveReferral("Yes") }}
                            >
                                Yes
                            </Button>
                        </Box>
                        {haveReferral != "No" ?
                            <>
                                <TextField placeholder="Referral address" inputProps={ariaLabel} focused
                                    onChange={async (e) => {
                                        setReferralAddress(e.target.value);
                                        let web3 = getWeb3();
                                        let isValid = web3.utils.isAddress(e.target.value);
                                        if (isValid) {
                                            const pair_contract = getWeb3Contract(pair_abi, inputAddress)

                                            let referral_lp_balance = await pair_contract.methods
                                                .balanceOf(e.target.value)
                                                .call()
                                            setReferralBalance(referral_lp_balance);
                                        }
                                        else {
                                            setReferralBalance(0);
                                        }
                                        setIsReferralValid(isValid);

                                    }}
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
                                    value={referralAddress}
                                />
                                {!isReferralValid ?
                                    <Typography
                                        variant='h4'
                                        color='#e91e63'
                                        className='text-center mb-3'
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Referral address not valid
                                    </Typography> :
                                    <></>
                                }
                                {isReferralValid && referralBalance < 1 ?
                                    <Typography
                                        variant='h4'
                                        color='#e91e63'
                                        className='text-center mb-3'
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Invalid account. Referrer needs to be holding at least 1 LP token
                                    </Typography> :
                                    <></>
                                }
                            </>
                            :
                            <></>
                        }
                    </Box>
                    <Box className='mb-5'>
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
                                    {fee} ETH
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
                            className='text-center'
                            sx={{
                                fontSize: '12px',
                                fontWeight: '400'
                            }}
                        >
                            Your balance: {ethBalance} ETH
                        </Typography>
                    </Box>
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
                            disabled={ethBalance >= fee ? false : true}
                            onClick={onApprove}
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
                            disabled={ethBalance >= fee ? false : true}
                            onClick={onLock}
                        >
                            Lock
                        </Button>

                    </Box>
                    {ethBalance < fee ?
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
                                You do not have enough ETH in your wallet to perform this transaction. {fee} ETH required.
                            </Typography>
                        </Box> :
                        <></>
                    }
                </Box>

            }
        </Container>
    );
}

export default Pair;