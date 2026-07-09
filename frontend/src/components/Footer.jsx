import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
    {
        heading: 'Learn',
        links: ['Browse catalog', 'Paths & tracks', 'Instructors', 'Certificates'],
    },
    {
        heading: 'Teach',
        links: ['Become an instructor', 'Course guidelines', 'Instructor resources'],
    },
    {
        heading: 'Company',
        links: ['About', 'Careers', 'Contact'],
    },
    {
        heading: 'Legal',
        links: ['Terms', 'Privacy', 'Accessibility'],
    },
];

const Footer = () => {
    return (
        <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            <div className="container" style={{ padding: '56px 24px 32px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '32px',
                    paddingBottom: '40px',
                }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600,
                                color: 'var(--bg)', background: 'var(--accent)', width: '28px', height: '28px',
                                borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>SH</span>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                Skill<span style={{ color: 'var(--accent)' }}>Hub</span>
                            </span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '260px' }}>
                            A course catalog built for people who finish what they start. Track record, not just enrollment.
                        </p>
                    </div>

                    {FOOTER_COLUMNS.map(col => (
                        <div key={col.heading}>
                            <p className="eyebrow" style={{ marginBottom: '16px' }}>{col.heading}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {col.links.map(label => (
                                    <Link
                                        key={label}
                                        to="#"
                                        style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rule" />

                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '20px', flexWrap: 'wrap', gap: '8px',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        &copy; {new Date().getFullYear()} SkillHub
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Built for people who finish courses.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
