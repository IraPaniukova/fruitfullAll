import { IconButton, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';

interface ConfirmChangesButtonProps {
    onConfirmClick: () => void;
}
export const ConfirmChangesButton: React.FC<ConfirmChangesButtonProps> = ({ onConfirmClick }) => {
    return (
        <Tooltip title="Confirm or Exit" placement="right">
            <IconButton onClick={onConfirmClick} aria-label="Confirm changes">
                <DoneIcon />
            </IconButton>
        </Tooltip>
    );
}