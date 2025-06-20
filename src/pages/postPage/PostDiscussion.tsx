import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { socket } from '../../sockets/fakeSocket';

type Comment = {
    id: string;
    user: string;
    text: string;
    createdAt?: string | number; // optional, string or number
};

type Props = {
    postId: string;
};

const previousComments: Comment[] = [
    { id: '1', user: 'Alice', text: 'Great question!', createdAt: 1680000000000 },
    { id: '2', user: 'Bob', text: 'I struggled with this one.', createdAt: 1680003600000 },
];

export const PostDiscussion = ({ postId }: Props) => {
    const [comments, setComments] = useState<Comment[]>(previousComments);
    const [newComment, setNewComment] = useState('');
    const currentUser = 'You';

    // Helper to parse date safely
    const parseDate = (date?: string | number) => {
        if (!date) return new Date();
        if (typeof date === 'number') return new Date(date);
        const parsed = Date.parse(date);
        return isNaN(parsed) ? new Date() : new Date(parsed);
    };

    useEffect(() => {
        socket.emit('joinPost', postId);

        socket.on('newComment', (comment: Comment) => {
            setComments((prev) => [...prev, comment]);
        });

        return () => {
            socket.emit('leavePost', postId);
            socket.off('newComment');
        };
    }, [postId]);

    const handleSend = () => {
        if (!newComment.trim()) return;

        const commentToSend: Comment = {
            id: crypto.randomUUID(),
            text: newComment,
            user: currentUser,
            createdAt: Date.now(),
        };

        setComments((prev) => [...prev, commentToSend]);
        socket.emit('addComment', { postId, ...commentToSend });
        setNewComment('');
    };

    return (
        <Box>
            {comments
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
            <Button onClick={handleSend}>Send</Button>
        </Box>
    );
};
