import { useEffect } from "react";
import { useAppDispatch } from "../../../store/typeHooks";
import { updateLastActivity } from "../authSlice";

export const ActivityDetector = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const updateActivity = () => {
            dispatch(updateLastActivity(Date.now()));
        };

        window.addEventListener("pointerdown", updateActivity);
        window.addEventListener("keydown", updateActivity);
        window.addEventListener("scroll", updateActivity);
        window.addEventListener("touchstart", updateActivity);

        return () => {
            window.removeEventListener("pointerdown", updateActivity);
            window.removeEventListener("keydown", updateActivity);
            window.removeEventListener("scroll", updateActivity);
            window.removeEventListener("touchstart", updateActivity);
        };
    }, [dispatch]);

    return null;
};
