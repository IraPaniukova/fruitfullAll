import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Box, TextField, Button, Typography, Grid, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { industryOptions, countryOptions, questionTypeOptions, stressLevelOptions, interviewFormatOptions } from '../../utils/constants';
import { TagInput } from './TagInput';
import type { PostFormData } from '../../utils/types';

export const CreatePostPage = () => {
    const currentYear = new Date().getFullYear();
    const [form, setForm] = useState<PostFormData>({
        questions: '',
        company: '',
        industry: '',
        year: '',
        country: '',
        stressLevel: '',
        questionType: '',
        interviewFormat: '',
        opinion: '',
        tags: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleSelectChange = (
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const validTags = form.tags?.every(tag => /^[a-zA-Z]+$/.test(tag));
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.questions.trim()) newErrors.questions = 'Questions are required';
        if (!form.company) newErrors.company = 'Company name or type (e.g. BNZ or bank) is required';
        if (!form.industry) newErrors.industry = 'Industry is required';
        if (form.year === '' || form.year < currentYear - 1 || form.year > currentYear)
            newErrors.year = `Year must be between last year and ${currentYear}`;
        if (!form.country) newErrors.country = 'Country is required';
        if (!form.stressLevel) newErrors.stressLevel = 'Stress Level is required';
        if (!form.questionType) newErrors.questionType = 'Question Type is required';
        if (!validTags) newErrors.tag = 'error';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate() || !validTags) return;
        console.log('Submitting post:', form);
        // send to backend here
    };

    return (
        <Box p={2} width={{ xs: 'auto', sm: '90%', md: '80%' }} mx='auto'>
            <Typography variant="h6" mb={2}>
                Create a New Post
            </Typography>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Questions"
                        name="questions"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={form.questions}
                        onChange={handleSelectChange}
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
                        onChange={handleSelectChange}
                    />
                </Grid>
                <Grid size={12}>
                    <TagInput setForm={setForm} error_tag={errors.tag} />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                    <FormControl fullWidth required error={!!errors.industry}>
                        <TextField
                            sx={{ '& .MuiInputBase-input': { textAlign: 'center', }, }}
                            name="company"
                            value={form.company}
                            label="Company name or type*"
                            onChange={handleInputChange}
                        />
                        <FormHelperText>{errors.company}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                    <FormControl fullWidth required error={!!errors.industry}>
                        <InputLabel id="industry-label">Industry</InputLabel>
                        <Select
                            labelId="industry-label"
                            name="industry"
                            value={form.industry}
                            label="Industry"
                            onChange={handleSelectChange}
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
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth required error={!!errors.country}>
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                            labelId="country-label"
                            name="country"
                            value={form.country}
                            label="Country"
                            onChange={handleSelectChange}
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
                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        sx={{ '& .MuiInputBase-input': { textAlign: 'center', }, }}
                        label="Year"
                        name="year"
                        type="number"
                        fullWidth
                        required
                        value={form.year}
                        onChange={handleSelectChange}
                        error={!!errors.year}
                        helperText={errors.year}
                        slotProps={{
                            input: {
                                inputProps: { min: currentYear - 1, max: currentYear }
                            }
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth required error={!!errors.stressLevel}>
                        <InputLabel id="stress-label">Stress Level</InputLabel>
                        <Select
                            labelId="stress-label"
                            name="stressLevel"
                            value={form.stressLevel}
                            label="Stress Level"
                            onChange={handleSelectChange}
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
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth required error={!!errors.questionType}>
                        <InputLabel id="question-type-label">Question Type</InputLabel>
                        <Select
                            labelId="question-type-label"
                            name="questionType"
                            value={form.questionType}
                            label="Question Type"
                            onChange={handleSelectChange}
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
                <Grid size={{ xs: 6, sm: 4 }}>
                    <FormControl fullWidth required error={!!errors.interviewFormat
                    }>
                        <InputLabel id="interview-format-label">Interview Format</InputLabel>
                        <Select
                            labelId="interview-format-label"
                            name="interviewFormat"
                            value={form.interviewFormat}
                            label="Interview Format"
                            onChange={handleSelectChange}
                        >
                            {interviewFormatOptions.map((opt) => (
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
