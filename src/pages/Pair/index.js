import React, { useState } from 'react';
import { Box, Container, Link, Modal, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Image, MidIcon, SmallIcon } from './style';

const Pair = () => {
    return (
        <Container className='d-flex align-items-center justify-content-center'
            sx={{ height: '100vh' }}>
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
        </Container>
    );
}

export default Pair;