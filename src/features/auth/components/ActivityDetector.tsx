import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/typeHooks';
import { updateLastActivity } from '../authSlice';
import { debounce } from 'lodash';

const ActivityDetector: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const events = [
            'pointermove',
            'pointerdown',
            'pointerup',
            'keydown',
            'wheel',
            'scroll',
            'input',
            'focus',
            'visibilitychange',
        ];

        const debouncedHandleActivity = debounce((event: Event) => {
            dispatch(updateLastActivity({ eventType: event.type, timestamp: Date.now() }));
        }, 100);

        const handleActivity = (event: Event) => {
            if (['pointermove', 'wheel', 'scroll'].includes(event.type)) {
                debouncedHandleActivity(event);
            } else {
                dispatch(updateLastActivity({ eventType: event.type, timestamp: Date.now() }));
            }
        };

        events.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            debouncedHandleActivity.cancel();
        };
    }, [dispatch]);

    return null;
};

export default ActivityDetector;
