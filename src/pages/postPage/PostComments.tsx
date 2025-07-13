import { useEffect, useState } from 'react';
import { Box, Stack, Avatar, Typography, TextField, Button, IconButton } from '@mui/material';
import type { CommentInputDto, CommentLikeDto, CommentOutputDto, CommentUpdateDto } from '../../utils/interfaces';
import { createComment, deleteCommentById, getCommentsByPostId, updateCommentById } from '../../api/commentApi';
import { connection, startConnection } from '../../signalR/commentHub';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { addComment, editComment, deleteComment, likeComment, setComments } from '../../features/comments/commentsSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';


type Props = {
    postId: number;
};

export const PostComments = ({ postId }: Props) => {
    const dispatch = useDispatch();
    const comments = useSelector((state: RootState) => state.comments.comments);
    const [newComment, setNewComment] = useState('');
    const currentUser = Number(localStorage.getItem("userId"));

    const [editingtId, setEditingtId] = useState<number | null>(null);
    const [editedText, setEditedText] = useState<string>('');

    useEffect(() => {
        async function fetchComments() {
            try {
                const data = await getCommentsByPostId(postId);
                console.log('Fetched comments from API:', data);
                dispatch(setComments(data));
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        }
        fetchComments();
    }, [dispatch]);

    useEffect(() => {
        startConnection().catch(console.error);
        const onCommentAdded = (comment: CommentOutputDto) => dispatch(addComment(comment));
        const onCommentEdited = (comment: CommentOutputDto) => dispatch(editComment(comment));
        const onCommentDeleted = (id: number) => dispatch(deleteComment(id));
        const onCommentLiked = (like: CommentLikeDto) => dispatch(likeComment(like));

        connection?.on("commentadded", onCommentAdded);
        connection?.on("commentedited", onCommentEdited);
        connection?.on("commentdeleted", onCommentDeleted);
        connection?.on("commentliked", onCommentLiked);

        return () => {
            connection?.off("commentadded");
            connection?.off("commentedited");
            connection?.off("commentdeleted");
            connection?.off("commentliked");
        };
    }, []);

    const handleSend = async () => {
        if (!newComment.trim()) return;
        const commentToSend: CommentInputDto = {
            postId,
            userId: currentUser,
            text: newComment,
        };
        try {
            await createComment(commentToSend);
            setNewComment("");
        } catch (error) {
            console.error("Failed to send comment:", error);
        }
    };
    const handleDelete = async (commentId: number) => {
        try {
            await deleteCommentById(commentId);
        } catch (error) {
            console.error(`Failed to delete comment ${commentId}:`, error);
        }
    };

    const handleEditClick = (comment: CommentOutputDto) => {
        setEditingtId(comment.commentId ?? null);
        setEditedText(comment.text ?? '');
    };

    const handleSaveEdit = async (commentId: number) => {
        if (!editedText.trim()) return;
        const updatedData: CommentUpdateDto = {
            text: editedText,
        };

        try {
            const updatedComment = await updateCommentById(commentId, updatedData);

            dispatch(editComment(updatedComment));
            setEditingtId(null);
            setEditedText('');
        } catch (error) {
            console.error(`Failed to update comment ${commentId}:`, error);
        }
    };

    const handleCancelEdit = () => {
        setEditingtId(null);
        setEditedText('');
    };

    const sortedComments = comments.filter(c => c.postId === postId)
        ?.slice()
        .sort((a, b) => {
            const dateA = new Date(a.createdAt ?? '').getTime();
            const dateB = new Date(b.createdAt ?? '').getTime();
            return dateA - dateB;
        });
    const userId = Number(localStorage.getItem('userId'));


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

                    <Stack sx={{ flexGrow: 1 }}>
                        <Typography variant='caption' align='left' >
                            {c.nickname && c.nickname.trim() !== ''
                                ? c.nickname
                                : c.userId === currentUser
                                    ? 'You'
                                    : `Anonymous${c.userId ? c.userId * 1234 : ''}`
                            } •{' '}
                            {c.createdAt ? formatTimeAgo(new Date(c.createdAt)) : ''}
                        </Typography>
                        {editingtId === c.commentId ? (
                            <TextField
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                sx={{ my: 1 }} // Add some margin for visual separation
                            />
                        ) : (
                            <Typography align='justify'>{c.text}</Typography>
                        )}
                    </Stack>
                    {c.userId === userId &&

                        <Stack direction='row' alignItems='center' spacing={1}
                        // position='absolute' top={0} right={0} p={1}
                        >
                            {(editingtId === c.commentId ?
                                <>
                                    <IconButton size="small" onClick={() => handleSaveEdit(c.commentId!)}>
                                        <DoneIcon sx={{ fontSize: 20, color: 'orange' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleCancelEdit}>
                                        <CloseIcon sx={{ fontSize: 20, color: 'red' }} />
                                    </IconButton>
                                </>
                                :
                                <>
                                    <IconButton size="small" onClick={() => handleEditClick(c)}>
                                        <EditIcon sx={{ fontSize: 15, color: 'orange' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => c.commentId && handleDelete(c.commentId)}>
                                        <DeleteIcon sx={{ fontSize: 15, color: 'orange' }} />
                                    </IconButton>
                                </>
                            )}
                        </Stack>
                    }

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
