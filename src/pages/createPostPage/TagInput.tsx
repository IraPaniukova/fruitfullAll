import { FormHelperText, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import type { PostFormData } from "../../utils/types";

interface TagInputProp {
    setForm: React.Dispatch<React.SetStateAction<PostFormData>>;
    error_tag: string;
}

export const TagInput: React.FC<TagInputProp> = ({ setForm, error_tag }) => {
    const theme = useTheme();
    const [tagsInput, setTagsInput] = useState('');
    const [tagError, setTagError] = useState<[string, string]>(['Add tags separated by commas', 'default']);
    const validateTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagsInput(value);
        const isValid = /^[a-zA-Z,]*$/.test(value);
        if (isValid) { setTagError(['Add tags separated by commas', 'default']); }
        else {
            if (theme.palette.mode === "light") {
                setTagError(['Tags can contain only letters and commas', '#B30000']);
            }
            else {
                setTagError(['Tags can contain only letters and commas', '#FFADAD']);
            }

        }
    }

    const createArray = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tagsArray = e.target.value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        setForm(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateTagInput(e);
        createArray(e);
    }

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