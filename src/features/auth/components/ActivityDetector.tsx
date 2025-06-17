import { useEffect } from "react";
import { useAppDispatch } from "../../../store/typeHooks";
import { updateLastActivity } from "../authSlice";

const ActivityDetector = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const updateActivity = () => {
            dispatch(updateLastActivity(Date.now()));
        };

        window.addEventListener("pointerdown", updateActivity);
        window.addEventListener("keydown", updateActivity);
        window.addEventListener("scroll", updateActivity);

        return () => {
            window.removeEventListener("pointerdown", updateActivity);
            window.removeEventListener("keydown", updateActivity);
            window.addEventListener("scroll", updateActivity);
        };
    }, [dispatch]);

    return null;
};

export default ActivityDetector;
