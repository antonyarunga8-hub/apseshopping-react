import React from 'react';

/**
 * Reusable star rating component.
 * Props:
 *   n    — number of filled stars (1–5)
 *   size — font size in px (default 14)
 */
export default function Stars({ n, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={i <= n ? 'fas fa-star' : 'far fa-star'}
          style={{ fontSize: size, color: i <= n ? '#f59e0b' : '#ddd' }}
        />
      ))}
      <span style={{ fontSize: size - 2, color: '#888', marginLeft: 6 }}>({n}.0)</span>
    </div>
  );
}
