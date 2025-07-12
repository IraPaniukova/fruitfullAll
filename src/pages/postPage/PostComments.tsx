import { useEffect, useState } from 'react';
import { Box, Stack, Avatar, Typography, TextField, Button } from '@mui/material';
import type { CommentInputDto, CommentOutputDto } from '../../utils/interfaces';
import { createComment, getCommentsByPostId } from '../../api/commentApi';
import { connection, startConnection } from '../../signalR/commentHub';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { addComment, editComment, deleteComment, likeComment } from '../../features/comments/commentsSlice';

type Props = {
    postId: number;
};

export const PostComments = ({ postId }: Props) => {
    const dispatch = useDispatch();
    const comments = useSelector((state: RootState) => state.comments.comments);
    const [dbComments, setDbComments] = useState<CommentOutputDto[] | null>(null);
    const [newComment, setNewComment] = useState('');
    const currentUser = Number(localStorage.getItem("userId"));

    useEffect(() => {
        async function fetchComments() {
            try {
                const data = await getCommentsByPostId(postId);
                console.log('Fetched comments from API:', data);

                setDbComments(data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        }
        fetchComments();
    }, [postId]);

    useEffect(() => {
        startConnection().catch(console.error);

        return () => {
            connection?.off("commentadded");
            connection?.off("commentedited");
            connection?.off("commentdeleted");
            connection?.off("commentliked");
        };
    }, []);

    useEffect(() => {
        if (dbComments) {
            dbComments.forEach((c) => {
                const exists = comments.some((existing) => existing.commentId === c.commentId);
                if (!exists) {
                    dispatch(addComment(c));
                }
            });
        }
    }, [dbComments, dispatch, comments]);



    const handleSend = async () => {
        if (!newComment.trim()) return;
        const commentToSend: CommentInputDto = {
            postId,
            userId: currentUser,
            text: newComment,
        };
        await createComment(commentToSend);
        setNewComment("");
    };

    const sortedComments = comments
        ?.slice()
        .sort((a, b) => {
            const dateA = new Date(a.createdAt ?? '').getTime();
            const dateB = new Date(b.createdAt ?? '').getTime();
            return dateA - dateB;
        });

    return (
        <Stack spacing={2} >
            {sortedComments?.map((c) => (
                <Stack
                    direction="row"
                    spacing={2}
                    p={2}
                    key={c.commentId}
                    sx={{ backgroundColor: 'background.paper', borderRadius: '5px' }}
                >
                    <Avatar
                        src={c.profileImage || undefined}
                        alt={c.nickname || 'Anonymous'}
                        sx={{ width: 24, height: 24, fontSize: 14, fontWeight: 700, backgroundColor: 'orange' }}
                    >
                        {!c.profileImage && 'ツ'}
                    </Avatar>

                    <Stack>
                        <Typography variant='caption' align='left' >
                            {c.userId === currentUser
                                ? 'You'
                                : `Anonymous${c.userId ? c.userId * 1234 : ''}`} •{' '}
                            {c.createdAt ? formatTimeAgo(new Date(c.createdAt)) : ''}
                        </Typography>
                        <Typography align='justify'

                        >{c.text}</Typography>
                    </Stack>
                </Stack>
            ))}

            <TextField
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="Add a comment..."
                margin="normal"
            />
            <Box>
                <Button onClick={handleSend}>Send</Button>
            </Box>
        </Stack>
    );
};
