import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { PostInputDto } from '../../utils/interfaces';
import { createPost } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';
import { CreateUpdatePost } from '../../components/createUpdatePost/CreateUpdatePost';
import { initialForm } from '../../utils/constants';

export const CreatePostPage = () => {
    const [form, setForm] = useState<PostInputDto>(initialForm);
    const validTags = form.tags?.length > 0 && form.tags?.every(tag => /^(?!.*,,)[a-zA-Z0-9#+,]+(\.[a-zA-Z0-9#+]+)*$/.test(tag));
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.content.trim()) newErrors.questions = 'Questions are required';
        if (!form.company) newErrors.company = 'Company name or type (e.g. BNZ or bank) is required';
        if (!form.industry) newErrors.industry = 'Industry is required';
        if (!form.year) newErrors.year = 'Year is required';
        if (!form.country) newErrors.country = 'Country is required';
        if (form.stressLevel === null) newErrors.stressLevel = 'Stress Level is required';
        if (!form.questionType) newErrors.questionType = 'Question Type is required';
        if (!form.interviewFormat) newErrors.interviewFormat = 'Interview Format is required';
        if (!validTags) newErrors.tag = 'error';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!validate() || !validTags) return;
        try {
            const newPost = await createPost(form);
            setForm(initialForm);
            localStorage.removeItem('formData');
            navigate(`/posts/${newPost.postId}`);
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };
    const onClearClick = () => {
        localStorage.removeItem('formData');
        setForm(initialForm);
    }

    return (
        <Box p={2} width={{ xs: 'auto', sm: '80%', md: '60%' }} mx='auto'>

            <Typography variant="h6" mb={2}>
                Share your interview expirience
            </Typography>
            <Stack direction='row' justifyContent='flex-end' width='100%'>
                <Button onClick={onClearClick} variant='text'
                    sx={{
                        height: '24px', width: '150px',
                        color: 'orange', fontSize: '0.8rem', colour: 'orange',
                        borderRadius: 5
                    }}>
                    Clear fields
                </Button>
            </Stack>
            <CreateUpdatePost form={form} setForm={setForm} errors={errors} />
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Submit
            </Button>

        </Box>
    );
};
