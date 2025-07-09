import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { socket } from '../../sockets/fakeSocket';
import type { CommentOutputDto } from '../../utils/interfaces';
import { getCommentsByPostId } from '../../api/commentApi';

type Props = {
    postId: number;
};

export const PostComments = ({ postId }: Props) => {
    const [dbComments, setDbComments] = useState<CommentOutputDto[] | null>(null);
    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await getCommentsByPostId(postId);
                setDbComments(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        fetchPosts();
    }, [postId]);
    const [comments, setComments] = useState<CommentOutputDto[] | null>(dbComments);
    // const [newComment, setNewComment] = useState('');
    // const currentUser = 'You';

    // // Helper to parse date safely
    // const parseDate = (date?: string | number) => {
    //     if (!date) return new Date();
    //     if (typeof date === 'number') return new Date(date);
    //     const parsed = Date.parse(date);
    //     return isNaN(parsed) ? new Date() : new Date(parsed);
    // };

    // useEffect(() => {
    //     socket.emit('joinPost', postId);

    //     socket.on('newComment', (comment: Comment) => {
    //         setComments((prev) => [...prev, comment]);
    //     });

    //     return () => {
    //         socket.emit('leavePost', postId);
    //         socket.off('newComment');
    //     };
    // }, [postId]);

    // const handleSend = () => {
    //     if (!newComment.trim()) return;

    //     const commentToSend: Comment = {
    //         id: crypto.randomUUID(),
    //         text: newComment,
    //         user: currentUser,
    //         createdAt: Date.now(),
    //     };

    //     setComments((prev) => [...prev, commentToSend]);
    //     socket.emit('addComment', { postId, ...commentToSend });
    //     setNewComment('');
    // };

    return (
        <Box>  {dbComments && dbComments[0] && <Typography>{dbComments[0].text}</Typography>}

            {/* {comments
                .slice()
                .sort((a, b) => parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime())
                .map((c) => (
                    <Box key={c.id} mb={1} sx={{ textAlign: 'left' }}>
                        <Typography fontWeight="bold" fontSize="0.875rem">
                            {c.user} • {parseDate(c.createdAt).toLocaleString()}
                        </Typography>
                        <Typography>{c.text}</Typography>
                    </Box>
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
            <Button onClick={handleSend}>Send</Button> */}
        </Box>
    );
};
