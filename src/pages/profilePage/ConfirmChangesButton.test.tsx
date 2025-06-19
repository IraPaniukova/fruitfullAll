import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmChangesButton } from './ConfirmChangesButton';

describe('ConfirmChangesButton', () => {
    it('calls onConfirmClick when clicked', async () => {
        const onConfirmClick = vi.fn();
        render(<ConfirmChangesButton onConfirmClick={onConfirmClick} />);
        const button = screen.getByLabelText(/Confirm changes/i);
        await userEvent.click(button);
        expect(onConfirmClick).toHaveBeenCalledTimes(1);
    });
});
