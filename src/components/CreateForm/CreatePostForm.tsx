import clsx from 'clsx';
import React from 'react';
import { postApi } from '../../api/post';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Loader } from '../Loader/Loader';
import { MainBlock } from '../MainBlock';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import styles from './styles.module.scss';
import { Smile } from './Smile';
import userPosts, {
    addPost,
    userPostSlice,
} from '../../store/slices/userPosts';
import { CameraIcon } from './CameraIcon';
import { v4 } from 'uuid';
import { getMediaUrl, mediaApi } from '../../api/media';
import { LoadingProgress } from '../Loader/LoadingProgress.tsx';
import axios from 'axios';
import { CancelIcon } from '../Loader/LoadingProgress.tsx/CancelIcon';

interface IProps {
    onSubmit: (text: string) => any;
}
export const CreatePostForm: React.FC<IProps> = ({ onSubmit }) => {
    const { user } = useAppSelector((state) => state.user);
    const inputRef = React.useRef<HTMLDivElement>(null);

    const [isEmojiPicking, setPicking] = React.useState(false);

    const loading = useAppSelector((state) => state.posts.loading);

    const handleSumbit = (e: any) => {
        e.preventDefault();
        const text = inputRef.current?.innerText!;
        dispatch(
            userPostSlice.actions.setAttachments(
                photos.map((photo) => photo.serverPath)
            )
        );
        onSubmit(text);
        uploaderRef.current!.value = '';
        inputRef.current!.innerText = '';
        setPhotos([]);
    };
    // const [attachments, setAttachments] = React.useState<string[]>([]);
    const dispatch = useAppDispatch();
    const handleAttach = (path: string, id: string) => {
        setPhotos(
            photos.map((photo) => {
                if (photo.id === id) {
                    photo.serverPath = path;
                }
                return photo;
            })
        );
    };

    const [photos, setPhotos] = React.useState<
        { id: string; file: any; serverPath: string }[]
    >([]);
    const uploaderRef = React.useRef<HTMLInputElement>(null);
    const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //@ts-ignore
        const newPart = Array.from(e.target.files).map((file) => {
            const data = new FormData();
            data.append('image', file);
            return {
                id: v4(),
                file: data,
                serverPath: '',
            };
        });

        setPhotos((p) => [...p, ...newPart]);
    };
    console.log(photos);
    const refId = v4();
    const handleDeleteAttachment = (path: string, id: string) => {
        if (path) {
            mediaApi.remove([path]);
        }
        setPhotos(photos.filter((photo) => photo.id !== id));
    };

    return (
        <MainBlock style={{ marginBottom: '20px' }}>
            <form className={styles.form}>
                <Avatar
                    src={user?.avatar_url && getMediaUrl(user?.avatar_url)}
                    height="40px"
                    width="40px"
                    first_name={user?.first_name}
                    last_name={user?.last_name}
                ></Avatar>
                <div
                    ref={inputRef}
                    data-placeholder={`What's new, ${user?.first_name || ''}?`}
                    contentEditable="true"
                    role="textbox"
                    className={clsx(styles.postField, styles.body)}
                ></div>

                <Button
                    onClick={handleSumbit}
                    className={styles.btn}
                    variant="blue"
                >
                    {loading ? (
                        <Loader height="10px" width="30px" color="white" />
                    ) : (
                        'Запостить'
                    )}
                </Button>
                <div className={styles.photoUploader}>
                    <label className="cup" htmlFor={refId}>
                        <CameraIcon />
                    </label>
                </div>
                <input
                    ref={uploaderRef}
                    id={refId}
                    type="file"
                    hidden
                    onChange={handleUploadChange}
                    max="10"
                    multiple
                />
            </form>
            <div className={styles.uploadImgBlock}>
                {photos.map((p) => (
                    <ImageWithUploadingStatus
                        id={p.id}
                        key={p.id}
                        file={p.file}
                        onDelete={handleDeleteAttachment}
                        onUpload={handleAttach}
                    />
                ))}
            </div>
        </MainBlock>
    );
};

interface IImageWithUploadingStatusProps {
    file: any;
    onDelete: (path: string, id: string) => any;
    id: string;
    onUpload: (path: string, id: string) => any;
}
const ImageWithUploadingStatus: React.FC<IImageWithUploadingStatusProps> = ({
    file,
    onDelete,
    id,
    onUpload,
}) => {
    const [loading, setLoading] = React.useState(true);
    const [url, setUrl] = React.useState(file);
    const [percent, setPercent] = React.useState(0);
    const xhrRef = React.useRef(new XMLHttpRequest());
    React.useEffect(() => {
        (async () => {
            const xhr = xhrRef.current;
            xhr.open('POST', getMediaUrl(''));
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onreadystatechange = (e: any) => {
                if (xhr.readyState === 4) {
                    const path = e.target?.response?.[0];
                    setUrl(path);
                    setLoading(false);
                    onUpload(path, id);
                }
            };

            xhr.upload.addEventListener('error', function () {
                alert(
                    'Произошла ошибка во время загрузки изображения, попробуйте снова'
                );
            });
            xhr.upload.addEventListener('progress', function (event) {
                if (event.lengthComputable) {
                    const complete = ((event.loaded / event.total) * 100) | 0;
                    setPercent(complete);
                }
            });
            xhr.send(file);
        })();
    }, []);

    const handleCancel = () => {
        xhrRef.current.abort();
        onDelete('', id);
    };
    return loading ? (
        <LoadingProgress
            onCancel={handleCancel}
            percent={Math.floor(percent)}
        ></LoadingProgress>
    ) : (
        <div className={styles.imgPreview}>
            <div onClick={() => onDelete(url, id)} className={styles.close}>
                <div
                    style={{
                        backgroundImage: `url(${getMediaUrl(
                            'b5a4a149-9e5b-4d6a-8c23-b34810c8c6a3.png'
                        )})`,
                    }}
                ></div>
            </div>
            <img src={getMediaUrl(url)} alt="" />
        </div>
    );
};
