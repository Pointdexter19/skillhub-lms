import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { Play, CheckCircle, Star, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';

const CourseCard = ({ course, onOpenDetails, isEnrolled }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column' }}
            onClick={() => onOpenDetails(course._id || course.id)}
        >
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)'
                }} />
                {course.bestseller && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'var(--bg)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        padding: '3px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <Sparkles size={11} /> Top rated
                    </div>
                )}
                {isEnrolled && (
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'var(--success)',
                        color: '#0b0d10',
                        padding: '3px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <CheckCircle size={11} /> Enrolled
                    </div>
                )}
            </div>
            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, gap: '11px' }}>
                <span className="ledger-tag" style={{ alignSelf: 'flex-start' }}>
                    SH-{String(course.title?.length || 0).padStart(3, '0')}
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.35' }}>
                    {course.title}
                </h3>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {course.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                            {course.instructor.charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{course.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={13} fill="var(--accent)" color="var(--accent)" />
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>{course.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="rule" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {isEnrolled ? (
                            <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>Enrolled</span>
                        ) : (
                            formatPrice(course.price)
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={isEnrolled ? "btn btn-outline" : "btn btn-primary"}
                        style={{ padding: '8px 16px', fontSize: '0.875rem', border: isEnrolled ? '1px solid var(--success)' : 'none', color: isEnrolled ? 'var(--success)' : '#fff' }}
                    >
                        {isEnrolled ? 'Open' : 'Details'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { courses, isEnrolled, loading: initialLoading, searchCourses } = useCourses();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    const [searchResults, setSearchResults] = React.useState([]);
    const [searching, setSearching] = React.useState(false);

    React.useEffect(() => {
        const performSearch = async () => {
            if (searchQuery) {
                setSearching(true);
                const results = await searchCourses(searchQuery);
                setSearchResults(results);
                setSearching(false);
            } else {
                setSearchResults([]);
            }
        };
        performSearch();
    }, [searchQuery, searchCourses]);

    const displayCourses = searchQuery ? searchResults : courses;
    const isLoading = searchQuery ? searching : initialLoading;

    const handleCourseClick = (id) => {
        if (isEnrolled(id)) navigate(`/learn/${id}`);
        else navigate(`/course/${id}`);
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {!searchQuery && (
                <div className="container" style={{ paddingTop: '40px' }}>
                    <div className="modern-hero" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', minHeight: '360px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ padding: '56px 56px 56px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <p className="eyebrow" style={{ marginBottom: '18px' }}>Catalog &mdash; Fall session</p>
                            <h1 style={{ fontSize: '2.75rem', lineHeight: 1.12, marginBottom: '18px', fontWeight: 600 }}>
                                Skills, tracked <span className="text-gradient">like a transcript.</span>
                            </h1>
                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '440px' }}>
                                Every course on SkillHub is logged against your record &mdash; progress, completion, and proof of work, not just a "started" badge.
                            </p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="btn btn-primary"
                                    style={{ padding: '14px 28px' }}
                                >
                                    Browse the catalog
                                </button>
                            </div>
                        </motion.div>

                        <div style={{
                            borderLeft: '1px solid var(--border)',
                            background: 'var(--surface-2)',
                            padding: '56px 44px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '28px',
                        }}>
                            {[
                                { label: 'Active learners', value: '512,400' },
                                { label: 'Courses on record', value: '1,280' },
                                { label: 'Avg. completion rate', value: '78%' },
                            ].map((stat, i) => (
                                <div key={stat.label}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <TrendingUp size={14} color="var(--accent)" />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</p>
                                    {i < 2 && <div className="rule" style={{ marginTop: '20px' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ marginTop: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended for you'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>Quality courses hand-picked by our curators</p>
                    </div>
                    {!searchQuery && (
                        <button onClick={() => navigate('/courses')} className="btn btn-outline" style={{ border: 'none', color: 'var(--primary)', fontWeight: 700 }}>
                            View all <TrendingUp size={16} />
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div style={{ padding: '100px 0', textAlign: 'center' }}>
                        <div style={{ width: '50px', height: '50px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 20px' }} className="animate-spin"></div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Gathering the best content for you...</p>
                    </div>
                ) : displayCourses.length > 0 ? (
                    <motion.div
                        layout
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '32px'
                        }}
                    >
                        {displayCourses.map(course => (
                            <CourseCard
                                key={course.id || course._id}
                                course={course}
                                isEnrolled={isEnrolled(course.id || course._id)}
                                onOpenDetails={handleCourseClick}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ padding: '100px 0', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No courses found.</h3>
                        <button onClick={() => navigate('/')} className="btn btn-primary">Discover More</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
