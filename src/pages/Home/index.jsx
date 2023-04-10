import React, { useState } from 'react';
import { Box, Container, Link, Modal, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Image, MidIcon, SmallIcon } from './style';

const chainList = [
    {
        name: 'ZKsync',
        icon: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F451300809%2F1144705849263%2F1%2Foriginal.20230221-185620?w=400&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C400%2C400&s=6be70815fc7d7b0da0ed6d53c81cdd68'
    }
]

const Home = () => {
    // const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    return (
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ height: '100vh' }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'primary.main',
                    boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                    borderRadius: '20px',
                    padding: '16px'
                }}
            >
                <Link
                    href='https://app.mute.io/'
                    target='_blank'
                    underline="none"
                >
                    <Box className='d-flex align-items-center'
                        sx={{
                            backgroundColor: 'primary.hotColor',
                            borderRadius: '20px',
                            margin: '8px',
                            marginTop: '0px',
                            padding: '16px',
                        }}
                    >
                        <Image
                            src='https://raw.githubusercontent.com/Unicrypt/media/bb5e32ddc118d3d81db45e8ae6e72b42f2d46493/logo/partners/defillama-green.svg'
                            alt="My SVG image"
                        />
                        <Box className='ps-3'>
                            <Typography
                                variant='h4'
                                color='primary.text'
                                sx={{
                                    fontSize: '16px',
                                }}
                            >
                                <Typography
                                    variant='span'
                                    sx={{
                                        fontSize: '20px',
                                        paddingRight: '4px',
                                    }}
                                >
                                    $0
                                </Typography>
                                liquidity locked
                            </Typography>
                            <Typography
                                variant='h4'
                                sx={{
                                    color: 'primary.green',
                                    fontSize: '12px'
                                }}
                            >
                                View our Liquidity Locker TVL on Mute Switch
                            </Typography>
                        </Box>
                    </Box>
                </Link>
                <Typography className='py-4' variant='h4' color='primary.title'
                    sx={{ fontSize: '34px' }}
                >
                    Lock Liquidity
                </Typography>
                <Box
                    className='mb-5'
                >
                    <Typography
                        className='ps-2 mb-2'
                        variant='h5'
                        color='primary.title'
                        sx={{
                            fontSize: '16px',
                            marginTop: '8px',
                            paddingLeft: '8px'
                        }}
                    >
                        Selected network
                    </Typography>
                    <Box
                        // onClick={handleOpen}
                        className='d-flex align-items-center'
                        sx={{
                            boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                            borderRadius: '20px',
                            padding: '16px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'primary.hoverColor',
                            }
                        }}
                    >
                        <MidIcon
                            src='https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F451300809%2F1144705849263%2F1%2Foriginal.20230221-185620?w=400&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C400%2C400&s=6be70815fc7d7b0da0ed6d53c81cdd68'
                            alt="ZKsync"
                            className='me-3'
                        />
                        <Box className='d-flex align-items-center'>
                            <Typography
                                color='primary.text'
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: '500',
                                }}
                            >
                                ZKsync
                            </Typography>
                            <ExpandMoreIcon
                                fontSize="small"
                                sx={{
                                    color: 'primary.text',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography
                        className='ps-2 mb-2'
                        variant='h5'
                        color='primary.title'
                        sx={{
                            fontSize: '16px',
                            marginTop: '8px',
                            paddingLeft: '8px'
                        }}
                    >
                        Lock Liquidity on which exchange?
                    </Typography>
                    <Link href='/pair' underline="none">
                        <Box
                            className='d-flex align-items-center mb-1'
                            sx={{
                                backgroundColor: 'primary.main',
                                boxShadow: '0 5.40728px 10.8146px rgba(0,0,0,.3)',
                                borderRadius: '20px',
                                padding: '16px',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'primary.hoverColor',
                                }
                            }}
                        >
                            <SmallIcon
                                src='https://explorer.zksync.io/images/currencies/mute.svg'
                                alt="Mute Switch"
                                className='me-3'
                                sx={{
                                    borderRadius: '5px'
                                }}
                            />
                            <Box className='d-flex align-items-center'>
                                <Typography
                                    color='primary.text'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Mute Switch
                                </Typography>
                            </Box>
                        </Box>
                    </Link>
                </Box>
            </Box>
            {/* <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    '.MuiBackdrop-root': {
                        backgroundColor: '#21212170'
                    }
                }}
            >
                <Box sx={{
                    width: 450,
                    maxWidth: '80%',
                    bgcolor: 'primary.main',
                    borderRadius: '20px',
                    boxShadow: 24,
                    left: '50%',
                    outline: 'none',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <Box
                        className='d-flex justify-content-between align-items-center px-3 py-2'
                        sx={{
                            backgroundColor: "primary.dark",
                            borderBottom: '1px solid',
                            borderColor: 'primary.outline'
                        }}
                    >
                        <IconButton className='invisible'>
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            color={'primary.text'}
                            sx={{
                                fontSize: '20px',
                                fontWeight: '500',
                                textAlign: 'center',
                            }}
                        >
                            Switch Network
                        </Typography>
                        <IconButton
                            sx={{
                                color: "primary.text",
                                '&:hover': {
                                    backgroundColor: 'primary.hoverColor'
                                }
                            }}
                            onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {
                        chainList.map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    className='d-flex align-items-center px-3'
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        borderBottom: '1px solid',
                                        borderColor: 'primary.outline',
                                        padding: '16px',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'primary.hoverColor',
                                        }
                                    }}
                                >
                                    <SmallIcon
                                        src={item.icon}
                                        alt={item.name}
                                        className='me-3'
                                    />
                                    <Box className='d-flex align-items-center'>
                                        <Typography
                                            color='primary.text'
                                            sx={{
                                                fontSize: '20px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })
                    }
                    <Typography
                        color={'primary.title'}
                        className='py-2'
                        sx={{
                            backgroundColor: 'primary.dark',
                            fontSize: '16px',
                            fontWeight: '500',
                            textAlign: 'center',
                        }}
                    >
                        Testnets
                    </Typography>
                    <Box
                        className='d-flex align-items-center px-3'
                        sx={{
                            backgroundColor: 'primary.main',
                            borderBottom: '1px solid',
                            borderColor: 'primary.outline',
                            padding: '16px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'primary.hoverColor',
                            }
                        }}
                    >
                        <SmallIcon
                            src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                            alt='Goerli'
                            className='me-3'
                        />
                        <Box className='d-flex align-items-center'>
                            <Typography
                                color='primary.text'
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: '500',
                                }}
                            >
                                Goerli
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal> */}
        </Container >
    );
};

export default Home;