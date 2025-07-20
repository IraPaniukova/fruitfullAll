import { Stack, Box, Chip } from "@mui/material";
import { Link } from "react-router-dom";

interface TagsProps {
    tags: string[];
}

export const PostTags: React.FC<TagsProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>

            <Box display="flex" gap={1} flexWrap="wrap">
                {tags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        component={Link}
                        to={`/posts/by-tag?tagName=${encodeURIComponent(tag)}`}
                        clickable
                        size="small"
                    />
                ))}
            </Box>
        </Stack>
    );
};
