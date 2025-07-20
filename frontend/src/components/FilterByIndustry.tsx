

import { Autocomplete, TextField, alpha, styled } from "@mui/material";

import { industryOptions } from "../utils/constants";



interface FilterByIndustryProps {
    onSelect: (value: string) => void;
    industry: string;
}

export const FilterByIndustry: React.FC<FilterByIndustryProps> = ({ industry, onSelect }) => {
    const handleSelectedIndustry = (_event: any, value: string | null) => {
        onSelect(value ?? '');
    };
    const FilterBox = styled('div')(({ theme }) => ({
        position: 'relative',
        maxWidth: '200px',
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.mode === 'light'
            ? theme.palette.grey[900] : 'inherit',
        marginLeft: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.grey[800], 0.15)
                : alpha(theme.palette.common.white, 0.25),
        },

    }));
    return (

        <FilterBox >
            <Autocomplete
                value={industry || null}
                onChange={handleSelectedIndustry}
                options={industryOptions}
                id="industry-search"
                autoHighlight //allows to enter first from the list (or chosen with coursor) on enter click
                renderInput={(params) => (
                    <TextField {...params} label="Filter by industry" variant="standard" />)}
            />
        </FilterBox>
    );
}