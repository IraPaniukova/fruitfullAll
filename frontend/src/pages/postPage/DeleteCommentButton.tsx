import type { CommentOutputDto } from '../../utils/interfaces';
import { DeleteDialog } from '../../components/DeleteDialog';
import { deleteCommentById } from '../../api/commentApi';


interface DeleteCommentButtonProps {
    commentId: number;
    comment: CommentOutputDto;
}

export const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, comment }) => {
    const userId = Number(localStorage.getItem('userId'));

    const handleDelete = async (commentId: number) => {
        try {
            await deleteCommentById(commentId);
        } catch (error) {
            console.error(`Failed to delete comment ${commentId}:`, error);
        }
    };
    const onDeleteComment = () => {
        handleDelete(commentId)
    }

    return (
        <>{comment.userId === userId &&
            <DeleteDialog onDelete={onDeleteComment} type='comment' />
        }
        </>
    );
}


