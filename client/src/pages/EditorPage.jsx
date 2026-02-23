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
    }, [id, isEditMode]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
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
            alert(`Error saving post: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="editor-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{isEditMode ? 'Edit Story' : 'New Story'}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Share your thoughts with the community</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '0.6rem 1.2rem', borderRadius: '10px' }}>
                        <X size={18} /> Cancel
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Type size={16} /> Story Title
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: '1.2rem', padding: '1rem', fontWeight: 500 }}
                            placeholder="Give your story a catchy title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Author Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Who's writing this?"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags (comma separated)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="tech, lifestyle, tutorial..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cover Image</label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <label className="form-input" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', justifyContent: 'center', borderStyle: 'dashed', height: '120px', background: 'rgba(255,255,255,0.02)' }}>
                                <ImageIcon size={24} style={{ color: 'var(--primary)' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600 }}>{image ? image.name : 'Upload Header Image'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG or WEBP (Max 5MB)</div>
                                </div>
                                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </label>
                            {imagePreview && (
                                <div style={{ position: 'relative' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--primary)' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Body Content</label>
                        <textarea
                            className="form-input"
                            style={{ height: '400px', fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6', fontSize: '1.1rem' }}
                            placeholder="Tell your story... (Supports Markdown)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading} style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                        padding: '1.2rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.8rem'
                    }}>
                        <Save size={20} />
                        {loading ? 'Publishing...' : (isEditMode ? 'Update Story' : 'Publish Story')}
                    </button>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        💡 Story auto-saves in the cloud. Supports Markdown for formatting.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EditorPage;
