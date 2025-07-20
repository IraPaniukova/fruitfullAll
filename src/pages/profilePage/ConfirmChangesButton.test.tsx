import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmChangesButton } from './ConfirmChangesButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

test('ConfirmChangesButton calls onConfirmClick on click', async () => {
    const onConfirmClick = vi.fn();

    render(
        <ThemeProvider theme={theme}>
            <ConfirmChangesButton onConfirmClick={onConfirmClick} />
        </ThemeProvider>
    );

    const button = screen.getByLabelText(/Confirm changes/i);
    await userEvent.click(button);

    expect(onConfirmClick).toHaveBeenCalledTimes(1);
});
