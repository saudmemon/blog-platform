import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/posts`);
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Loading stories...</h2></div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header className="hero">
                <h1>Share Your Story With The World</h1>
                <p>A place to write, read and connect. Discover insightful perspectives from writers on any topic.</p>
            </header>

            <div className="posts-grid">
                {posts.map((post) => (
                    <article key={post._id} className="post-card">
                        {post.coverImage && (
                            <img
                                src={`${API_URL}${post.coverImage}`}
                                alt={post.title}
                                className="post-image"
                            />
                        )}

                        {!post.coverImage && (
                            <div style={{ height: '200px', background: 'linear-gradient(45deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#475569', fontWeight: 600 }}>NexusBlog</span>
                            </div>
                        )}
                        <div className="post-content">
                            {post.tags?.[0] && <span className="post-tag">{post.tags[0]}</span>}
                            <h2 className="post-title">{post.title}</h2>
                            <div className="post-excerpt" dangerouslySetInnerHTML={{ __html: (post.content || '').substring(0, 150) + (post.content?.length > 150 ? '...' : '') }} />


                            <div className="post-footer">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <User size={14} /> {post.author}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link to={`/post/${post._id}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    Read <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No posts yet. Be the first to write one!</p>
                    <Link to="/create" className="btn-create" style={{ marginTop: '1rem', display: 'inline-block' }}>Create Post</Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
