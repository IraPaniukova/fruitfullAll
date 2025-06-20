import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';

import {
    industryOptions,
    countryOptions,
    questionTypeOptions,
    stressLevelOptions,
} from '../../utils/constants';

type PostFormData = {
    title: string;
    questions: string;
    industry: string;
    year: number | '';
    country: string;
    stressLevel: string;
    questionType: string;
    opinion?: string;
};

export const CreatePostPage = () => {
    const currentYear = new Date().getFullYear();

    const [form, setForm] = useState<PostFormData>({
        title: '',
        questions: '',
        industry: '',
        year: '',
        country: '',
        stressLevel: '',
        questionType: '',
        opinion: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === 'year'
                    ? value === ''
                        ? ''
                        : Math.min(Math.max(Number(value), currentYear - 1), currentYear)
                    : value,
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.questions.trim()) newErrors.questions = 'Questions are required';
        if (!form.industry) newErrors.industry = 'Industry is required';
        if (form.year === '' || form.year < currentYear - 1 || form.year > currentYear)
            newErrors.year = `Year must be between last year and ${currentYear}`;
        if (!form.country) newErrors.country = 'Country is required';
        if (!form.stressLevel) newErrors.stressLevel = 'Stress Level is required';
        if (!form.questionType) newErrors.questionType = 'Question Type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        console.log('Submitting post:', form);
        // send to backend here
    };
    const [tagsInput, setTagsInput] = useState('');

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tagsArray = e.target.value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        setForm(prev => ({ ...prev, tags: tagsArray }));
    };

    return (
        <Box p={2}>
            <Typography variant="h6" mb={2}>
                Create a New Post
            </Typography>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        required
                        value={form.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label="Questions"
                        name="questions"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={form.questions}
                        onChange={handleChange}
                        error={!!errors.questions}
                        helperText={errors.questions}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label="Opinion"
                        name="opinion"
                        fullWidth
                        multiline
                        rows={3}
                        value={form.opinion}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label="Tags (comma separated)"
                        name="tagsInput"
                        fullWidth
                        value={tagsInput}
                        onChange={handleTagsChange}
                        helperText="Add tags separated by commas"
                    />
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth required error={!!errors.industry}>
                        <InputLabel id="industry-label">Industry</InputLabel>
                        <Select
                            labelId="industry-label"
                            name="industry"
                            value={form.industry}
                            label="Industry"
                            onChange={handleChange}
                        >
                            {industryOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.industry}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <TextField
                        label="Year"
                        name="year"
                        type="number"
                        fullWidth
                        required
                        value={form.year}
                        onChange={handleChange}
                        error={!!errors.year}
                        helperText={errors.year}
                        inputProps={{ min: currentYear - 1, max: currentYear }}
                    />
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth required error={!!errors.country}>
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                            labelId="country-label"
                            name="country"
                            value={form.country}
                            label="Country"
                            onChange={handleChange}
                        >
                            {countryOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.country}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth required error={!!errors.stressLevel}>
                        <InputLabel id="stress-label">Stress Level</InputLabel>
                        <Select
                            labelId="stress-label"
                            name="stressLevel"
                            value={form.stressLevel}
                            label="Stress Level"
                            onChange={handleChange}
                        >
                            {stressLevelOptions.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.stressLevel}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={12}>
                    <FormControl fullWidth required error={!!errors.questionType}>
                        <InputLabel id="question-type-label">Question Type</InputLabel>
                        <Select
                            labelId="question-type-label"
                            name="questionType"
                            value={form.questionType}
                            label="Question Type"
                            onChange={handleChange}
                        >
                            {questionTypeOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.questionType}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
