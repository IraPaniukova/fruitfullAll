import { useEffect, useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import type { PostInputDto } from '../../utils/interfaces';
import { getPostById, updatePost } from '../../api/postApi';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateUpdatePost } from '../../components/createUpdatePost/CreateUpdatePost';
import { initialForm } from '../../utils/constants';

export const UpdatePostPage = () => {
    const { id } = useParams<{ id: string }>();
    const postId = Number(id);
    const [form, setForm] = useState<PostInputDto>(initialForm);
    const [fetchedForm, setFetchedForm] = useState<PostInputDto>();
    const [postUserId, setPostUserId] = useState(-1);

    useEffect(() => {
        async function fetchPost() {
            try {
                const data = await getPostById(postId);
                const fetched = {
                    content: data.content ?? '',
                    opinion: data.opinion ?? '',
                    company: data.company ?? '',
                    industry: data.industry ?? '',
                    year: data.year ?? 0,
                    country: data.country ?? '',
                    stressLevel: data.stressLevel ?? 0,
                    questionType: data.questionType ?? '',
                    interviewFormat: data.interviewFormat ?? '',
                    tags: data.tags ?? [],

                };
                const fetchedId = {
                    userId: data.userId ?? ''
                }
                setForm(fetched);
                setFetchedForm(fetched);
                setPostUserId(fetchedId.userId);
            } catch (error) {
                console.error("Failed to fetch post:", error);
            }
        }
        fetchPost();
    }, [postId]);
    const validTags = form.tags?.length > 0 && form.tags?.every(tag => /^(?!.*,,)[a-zA-Z0-9#+,]+(\.[a-zA-Z0-9#+]+)*$/.test(tag));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState(false);

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
            if (JSON.stringify(form) !== JSON.stringify(fetchedForm)) {
                await updatePost(postId, form)
                localStorage.removeItem('formData');
                navigate(`/posts/${postId}`);
            }
            else { setMessage(true); }
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };


    const userId = Number(localStorage.getItem('userId'));

    return (
        <>
            {fetchedForm && userId === postUserId &&
                <Box p={2} width={{ xs: 'auto', sm: '80%', md: '70%' }} mx='auto'>

                    <Typography variant="h6" mb={2}>
                        Update Post
                    </Typography>
                    <CreateUpdatePost form={form} setForm={setForm} errors={errors} />
                    <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                        Submit
                    </Button>

                </Box>}
            <Snackbar open={message} autoHideDuration={4000} onClose={() => setMessage(false)}>
                <Alert onClose={() => setMessage(false)}>
                    No changes were made.
                </Alert>
            </Snackbar>
        </>
    );
};
