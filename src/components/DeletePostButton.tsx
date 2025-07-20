import { useLocation, useNavigate } from 'react-router-dom';
import type { PostOutputDto } from '../utils/interfaces';
import { deletePost } from '../api/postApi';
import { DeleteDialog } from './DeleteDialog';


interface DeletePostButtonProps {
    postId: number;
    post: PostOutputDto;
}

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, post }) => {
    const userId = Number(localStorage.getItem('userId'));
    const location = useLocation().pathname;
    const navigate = useNavigate();

    const onDeletePost = async () => {
        try {
            await deletePost(postId);
            navigate('/');
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    }

    return (
        <>{post.userId === userId && location !== '/' &&
            <DeleteDialog onDelete={onDeletePost} type='post' />
        }
        </>
    );
}


