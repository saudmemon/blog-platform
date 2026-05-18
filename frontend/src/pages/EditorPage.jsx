import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Image as ImageIcon, Type, FileText } from 'lucide-react';

// Helper to determine if content is HTML or Markdown
const isHtml = (str) => str && /<[a-z][\s\S]*>/i.test(str);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileError, setFileError] = useState('');

    const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    useEffect(() => {
        if (isEditMode && id) {
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/posts/${id}`);

                    const post = res.data;
                    if (post) {
                        setTitle(post.title || '');
                        setContent(post.content || '');
                        setAuthor(post.author || '');
                        setTags(post.tags ? post.tags.join(', ') : '');

                        if (post.coverImage) {
                            setImagePreview(`${API_URL}${post.coverImage}`);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching post for edit:', err)
                }
            };
            fetchPost();
        }

        // Cleanup: revoke blob URL to prevent memory leak
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [id, isEditMode]);

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 200) {
            newErrors.title = 'Title must not exceed 200 characters';
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
        } else if (content.length > 10000) {
            newErrors.content = 'Content must not exceed 10000 characters';
        }

        if (author && author.length > 100) {
            newErrors.author = 'Author name must not exceed 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFileError('');

        if (file) {
            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                setFileError(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
                setImage(null);
                setImagePreview(null);
                return;
            }

            // Validate file size
            if (file.size > FILE_SIZE_LIMIT) {
                setFileError(`File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                setImage(null);
                setImagePreview(null);
                return;
            }

            setImage(file);
            const newPreview = URL.createObjectURL(file);
            
            // Revoke old preview URL if it exists and is a blob
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            
            setImagePreview(newPreview);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        // Check for file errors
        if (fileError) {
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        formData.append('author', author.trim());
        formData.append('tags', tags);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/api/posts/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(`${API_URL}/api/posts`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/');

        } catch (err) {
            console.error('Error saving post:', err);
            const errorMsg = err.response?.data?.message || err.message;
            setErrors({ submit: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div className="editor-container">
                <div className="editor-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem', borderRadius: '8px' }}>
                            <FileText size={20} />
                        </div>
                        <h1>{isEditMode ? 'Edit Story' : 'New Story'}</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Share your thoughts with the community</p>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 227, 153, 0.1)' }}>
                    {errors.submit && (
                        <div className="file-error" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'var(--error)' }}>
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Story Title</label>
                        <input
                            type="text"
                            placeholder="Give your story a catchy title..."
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors({ ...errors, title: '' });
                            }}
                            style={{ borderColor: errors.title ? 'var(--error)' : '' }}
                        />
                        {errors.title && <div className="form-error">{errors.title}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Author Name</label>
                            <input
                                type="text"
                                placeholder="Who's writing this?"
                                value={author}
                                onChange={(e) => {
                                    setAuthor(e.target.value);
                                    if (errors.author) setErrors({ ...errors, author: '' });
                                }}
                                style={{ borderColor: errors.author ? 'var(--error)' : '' }}
                            />
                            {errors.author && <div className="form-error">{errors.author}</div>}
                        </div>
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                placeholder="tech, lifestyle, tutorial..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cover Image</label>
                        {fileError && (
                            <div className="file-error">
                                {fileError}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <label className="image-upload" style={{ flex: 1, width: '100%' }}>
                                <ImageIcon size={24} style={{ color: 'var(--primary)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>{image ? image.name : 'Upload Header Image'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>JPG, PNG or WEBP (Max 5MB)</div>
                                </div>
                                <input type="file" hidden onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" />
                            </label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Body Content</label>
                        <textarea
                            placeholder="Tell your story... (Supports Markdown)"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (errors.content) setErrors({ ...errors, content: '' });
                            }}
                            style={{ borderColor: errors.content ? 'var(--error)' : '', minHeight: '250px' }}
                        />
                        {errors.content && <div className="form-error">{errors.content}</div>}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            {content.length}/10000 characters
                        </span>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                            <X size={18} /> Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            <Save size={18} />
                            {loading ? 'Publishing...' : (isEditMode ? 'Update Story' : 'Publish Story')}
                        </button>
                    </div>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        💡 Supports Markdown for formatting. Images (JPG, PNG, WEBP) up to 5MB.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EditorPage;
