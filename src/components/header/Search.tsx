

import { Autocomplete, Stack, TextField, alpha, InputBase, styled } from "@mui/material";

import { useState } from 'react';
import type { SyntheticEvent } from "react";
import { industryOptions } from "../../utils/constants";
import SearchIcon from '@mui/icons-material/Search';



export const Search = () => {
    const [industry, setIndustry] = useState('');
    const handleSelectedIndustry = (event: SyntheticEvent<Element, Event>, value: string | null) => {
        setIndustry?.(value ?? '');
    };
    // const handleChange = (value: string) => {
    //     setSelectedCountry(value !== null ? value : ''); //I need to set the value as an empty string instead of null, otherwise TypeScript would give me problems (I tried different options)
    //   };

    const SearchBox = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.mode === 'light'
            ? theme.palette.grey[900] : 'inherit',
        backgroundColor: theme.palette.mode === 'light'
            ? alpha(theme.palette.grey[800], 0.08)
            : alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.grey[800], 0.15)
                : alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    // const SearchIconWrapper = styled('div')(({ theme }) => ({
    //     padding: theme.spacing(0, 2),
    //     height: '100%',
    //     position: 'absolute',
    //     pointerEvents: 'none',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // }));

    // const StyledInputBase = styled(InputBase)(({ theme }) => ({
    //     color: 'inherit',
    //     width: '100%',
    //     '& .MuiInputBase-input': {
    //         padding: theme.spacing(1, 1, 1, 0),
    //         // vertical padding + font size from searchIcon
    //         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    //         transition: theme.transitions.create('width'),
    //         [theme.breakpoints.up('sm')]: {
    //             width: '12ch',
    //             '&:focus': {
    //                 width: '20ch',
    //             },
    //         },
    //     },
    // }));
    return (
        //   <Search>
        //                     <SearchIconWrapper>
        //                         <SearchIcon />
        //                     </SearchIconWrapper>
        //                     <StyledInputBase
        //                         placeholder="Search…"
        //                         inputProps={{ 'aria-label': 'Search' }}
        //                     />
        //                 </Search>
        <Stack minWidth='150px' ml={2}>
            <Autocomplete
                onChange={handleSelectedIndustry}
                options={industryOptions}
                id="industry-search"
                autoHighlight //allows to enter first from the list (or chosen with coursor) on enter click
                renderInput={(params) => (
                    <TextField {...params} label="Search industry" variant="standard" />)}
            />
        </Stack>
    );
}