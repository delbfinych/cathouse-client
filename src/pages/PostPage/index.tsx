import React from 'react';
import { useParams } from 'react-router';
import { IComment } from '../../api/comment';
import { postApi } from '../../api/post';
import { CommentItem, CommentList } from '../../components/CommentList';
import { LeftPanel } from '../../components/LeftPanel';
import { Post } from '../../components/Post';

export const PostPage: React.FC = () => {
    const params: { id: string } = useParams();
    const [comments, setComments] = React.useState([] as IComment[]);
    React.useEffect(() => {
        (async () => {
            const data = await postApi.getCommenets(parseInt(params.id), 2);
            setComments(data.data.result);
        })();
    }, []);
    return (
        <div
            style={{
                alignItems: 'flex-start',
            }}
            className="d-flex"
        >
            <LeftPanel></LeftPanel>
            <div
                style={{ maxWidth: '60vw', minWidth: '60vw' }}
                className="d-flex flex-column"
            >
                {/* <Post id={parseInt(params.id)} /> */}
                {comments.length > 0 && (
                    <CommentList>
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.comment_id}
                                {...comment}
                            />
                        ))}
                    </CommentList>
                )}
            </div>
        </div>
    );
};
