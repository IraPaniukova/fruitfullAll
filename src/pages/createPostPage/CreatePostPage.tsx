import { useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Box, TextField, Button, Typography, Grid, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { industryOptions, countryOptions, questionTypeOptions, stressLevelOptions, interviewFormatOptions, yearOptions } from '../../utils/constants';
import { TagInput } from './TagInput';
import type { PostInputDto } from '../../utils/interfaces';
import { createPost } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';

export const CreatePostPage = () => {
    const initialForm: PostInputDto = {
        content: '',
        opinion: '',
        company: '',
        industry: '',
        year: null,
        country: '',
        stressLevel: null,
        questionType: '',
        interviewFormat: '',
        tags: [],
    };
    const [form, setForm] = useState<PostInputDto>(initialForm);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleSelectChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'year' || name === 'stressLevel' ? Number(value) : value,
        }));
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: value };
            localStorage.setItem('formData', JSON.stringify(updated)); //otherwise it rerenders empty fields 
            return updated;
        });
    };
    //on each mount, it will load saved in local storage:
    useEffect(() => {
        const saved = localStorage.getItem('formData');
        if (saved) {
            setForm(JSON.parse(saved));
        }
    }, []);
    const validTags = form.tags?.every(tag => /^[a-zA-Z]+$/.test(tag));
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.content.trim()) newErrors.questions = 'Questions are required';
        if (!form.company) newErrors.company = 'Company name or type (e.g. BNZ or bank) is required';
        if (!form.industry) newErrors.industry = 'Industry is required';
        if (!form.year) newErrors.year = 'Year is required';
        if (!form.country) newErrors.country = 'Country is required';
        if (!form.stressLevel) newErrors.stressLevel = 'Stress Level is required';
        if (!form.questionType) newErrors.questionType = 'Question Type is required';
        if (!validTags) newErrors.tag = 'error';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!validate() || !validTags) return;
        console.log('Submitting post:', form);
        try {
            const newPost = await createPost(form);
            setForm(initialForm);
            localStorage.removeItem('formData');
            navigate(`/posts/${newPost.postId}`);
        } catch (err) {
            console.error("Failed to create post:", err);
        }
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
                        name="content"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={form.content}
                        onChange={handleInputChange}
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
                    <TagInput tags={form.tags} setForm={setForm} error_tag={errors.tag} />
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
                    <FormControl fullWidth required error={!!errors.year}>
                        <InputLabel id="year-label">Year</InputLabel>
                        <Select
                            labelId="year-label"
                            name="year"
                            value={form.year?.toString() ?? ''}
                            label="Year"
                            onChange={handleSelectChange}
                            sx={{ '& .MuiInputBase-input': { textAlign: 'center' } }}
                        >
                            {yearOptions.map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.year}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth required error={!!errors.stressLevel}>
                        <InputLabel id="stress-label">Stress Level</InputLabel>
                        <Select
                            labelId="stress-label"
                            name="stressLevel"
                            value={form.stressLevel?.toString() ?? ''}
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
