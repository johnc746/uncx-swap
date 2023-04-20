import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Image, MidIcon, SmallIcon } from './style';

const ariaLabel = { 'aria-label': 'description' };

const ListLocks = () => {

    const naviagte = useNavigate();

    const [totalPrice, setTotalPrice] = useState("0.00");
    const [pairs, setPairs] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    return (
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ minHeight: '100vh' }}
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
                <Typography
                    className='text-center mt-5 mb-1'
                    color='white'
                    sx={{
                        fontSize: '30px',
                        fontWeight: '400',
                    }}
                >
                    ${totalPrice}
                </Typography>
                <Typography
                    variant='h4'
                    color='#cccccc'
                    className='text-center mb-2'
                    sx={{
                        fontSize: '12px',
                        fontWeight: '400'
                    }}
                >
                    total value locked in {pairs.length} pairs
                </Typography>
                <Box className="d-flex justify-content-center mb-3">
                    <Button
                        className='w-20 ms-2'
                        sx={{
                            height: '30px',
                            backgroundColor: "primary.green",
                            borderRadius: '5px',
                            color: 'white',
                            fontSize: '10px',
                            '&:hover': {
                                backgroundColor: '#68d67c5f'
                            }
                        }}
                        onClick={(e) => { naviagte("/select_dex") }}
                    >
                        Lock / Withdraw Liquidity
                    </Button>
                </Box>
                <TextField placeholder="Pair name or address..." inputProps={ariaLabel} focused
                    onChange={(e) => { setSearchWord(e.target.value) }}
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
                    value={searchWord}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment>
                                <SmallIcon
                                    src='https://explorer.zksync.io/images/currencies/mute.svg'
                                    alt="Mute Switch"
                                    className='me-3'
                                    sx={{
                                        borderRadius: '5px'
                                    }}
                                />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment>
                                <Search
                                    sx={{
                                        color: '#cccccc'
                                    }}
                                />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
        </Container >
    );
};

export default ListLocks;