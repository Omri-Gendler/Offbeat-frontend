
import React from 'react';

export function ContextMenu({ position, onDelete, onClose }) {

    const menuStyle = {
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 1000,
    }

    return (
        <div style={menuStyle} className="context-menu" onClick={e => e.stopPropagation()}>
            <ul>
                <li onClick={onDelete}>
                    <span role="img" aria-label="delete">🗑️</span> Delete
                </li>
                <li onClick={onClose}>
                    <span role="img" aria-label="close">❌</span> Close
                </li>
            </ul>
        </div>
    )
}