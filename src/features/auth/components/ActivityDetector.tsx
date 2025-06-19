import { useEffect } from "react";
import { useAppDispatch } from "../../../store/typeHooks";
import { updateLastActivity } from "../authSlice";

export const ActivityDetector = () => {
    const dispatch = useAppDispatch();
    const events = ['pointermove', 'pointerdown', 'pointerup', 'keydown', 'wheel', 'scroll', 'input', 'focus', 'visibilitychange', 'click', 'touchstart', 'touchmove'];

    useEffect(() => {
        const updateActivity = () => {
            dispatch(updateLastActivity(Date.now()));
        };

        events.forEach((event) => {
            window.addEventListener(event, updateActivity, { passive: ['scroll', 'wheel', 'touchstart', 'touchmove'].includes(event) });
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, updateActivity);
            });
        };
    }, [dispatch]);

    return null;
};
