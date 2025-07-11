import { FormHelperText, TextField, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { PostInputDto } from "../../utils/interfaces";

interface TagInputProp {
    tags: string[];
    setForm: React.Dispatch<React.SetStateAction<PostInputDto>>;
    error_tag: string;
}

export const TagInput: React.FC<TagInputProp> = ({ tags, setForm, error_tag }) => {
    const theme = useTheme();
    const [tagsInput, setTagsInput] = useState('');
    const [tagError, setTagError] = useState<[string, string]>(['Add at least one tag, separate tags by commas', 'default']);
    const isInternalChangeRef = useRef(false); // NEW: Ref to track if change is user-initiated

    const validateTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // setTagsInput(value);
        const isValid = /^(?!.*,,)[a-zA-Z0-9#+,]+(\.[a-zA-Z0-9#+]+)*$/.test(value);
        if (isValid) { setTagError([' Add at least one tag, separate by commas', 'default']); }
        else {
            if (theme.palette.mode === "light") {
                setTagError(['Tags cannot contain spaces or end with a dot. Tags cannot be empty.', '#B30000']);
            }
            else {
                setTagError(['Tags cannot contain spaces or end with a dot. Tags cannot be empty.', '#FFADAD']);
            }
        }
        return isValid;
    }

    // const createArray = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     // setTagsInput(e.target.value);
    //     const tagsArray = e.target.value
    //         .split(',')
    //         .map(t => t.trim())
    //         .filter(t => t.length > 0);
    //     setForm(prev => ({ ...prev, tags: tagsArray }));
    // };

    const createArray = (value: string) => {
        const tagsArray = value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        setForm(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isInternalChangeRef.current = true; //  flag for user-initiated change
        const value = e.target.value;
        setTagsInput(value);

        validateTagInput(e);

        createArray(value); //  Pass 'value' to createArray
    };

    //  useEffect to synchronize tagsInput with 'tags' prop, but prevents overwriting active user input.
    useEffect(() => {
        // This condition prevents the effect from running if the change was from user typingor if the input is already in sync.
        if (!isInternalChangeRef.current && tags.join(",") !== tagsInput) {
            setTagsInput(tags.join(","));
        }
        isInternalChangeRef.current = false;
    }, [tags]);

    //  Separates useEffect for initial load, to ensure input is populated on first render
    useEffect(() => {
        if (tagsInput === '' && tags.length > 0) {
            setTagsInput(tags.join(","));
        }
    }, [tags]);

    return (
        <>
            <TextField
                label="Tags (comma separated)"
                name="tagsInput"
                fullWidth
                value={tagsInput}
                onChange={handleTagsChange}
                error={!!error_tag}
            />
            <FormHelperText sx={{ color: tagError[1] }}>{tagError[0]}</FormHelperText>
        </>
    );
}