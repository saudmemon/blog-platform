import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${API_URL}/api/posts/${id}`);
            setShowDeleteConfirm(false);
            navigate('/');
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post. Please try again.');
            setDeleting(false);
        }
    };

    if (loading) return <div className="container loading"><h2>Loading story...</h2></div>;
    if (!post) return <div className="container empty-state"><h2>Post not found</h2></div>;

    // Helper to determine if content is HTML or Markdown
    const isHtml = (str) => str && /<[a-z][\s\S]*>/i.test(str);

    return (
        <div className="container">
            <div className="post-detail">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                    <ArrowLeft size={18} /> Back to stories
                </Link>

                <header className="post-detail-header">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {post.tags?.map(tag => (
                            <span key={tag} className="post-tag">{tag}</span>
                        ))}
                    </div>
                    <h1 className="post-detail-title">{post.title}</h1>
                    <div className="post-detail-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={16} /> {post.author || 'Anonymous'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </header>

                {post.coverImage && (
                    <img
                        src={`${API_URL}${post.coverImage}`}
                        alt={post.title}
                        className="post-detail-image"
                    />
                )}


                <div className="post-detail-body">
                    {isHtml(post.content) ? (
                        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
                    ) : (
                        <div className="markdown-content">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="post-actions">
                    <Link to={`/edit/${post._id}`} className="btn-icon btn-edit">
                        <Edit size={18} /> Edit Post
                    </Link>
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn-icon btn-delete">
                        <Trash2 size={18} /> Delete Post
                    </button>
                </div>

                {showDeleteConfirm && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Delete Post?</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                This action cannot be undone. The post and its associated image will be permanently deleted.
                            </p>
                            <div className="modal-buttons">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deleting}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="btn-confirm"
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostPage;
