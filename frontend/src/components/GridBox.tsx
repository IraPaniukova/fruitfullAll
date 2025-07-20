import { styled, Box } from "@mui/material";

export const GridBox = styled(Box)({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    height: '100vh',
    width: '100vw'
});
