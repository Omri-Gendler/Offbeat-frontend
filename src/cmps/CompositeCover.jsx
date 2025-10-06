import React, { useRef, useEffect, useState } from 'react';

export function CompositeCover({ images, size = 232 }) {
    const canvasRef = useRef(null)
    const [compositeImageUrl, setCompositeImageUrl] = useState('')

    useEffect(() => {
        if (!images || images.length < 2) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = size
        canvas.height = size

        const imagePromises = images.slice(0, 2).map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.crossOrigin = 'Anonymous'
                img.onload = () => resolve(img)
                img.onerror = reject
                img.src = src
            })
        })

        Promise.all(imagePromises)
            .then(loadedImages => {
                const h = size / 2;

                ctx.drawImage(loadedImages[0], 0, 0, size, h)

                ctx.drawImage(loadedImages[1], 0, h, size, h)

                setCompositeImageUrl(canvas.toDataURL('image/jpeg'))
            })
            .catch(err => {
                console.error("Failed to load images for composite cover:", err)
            })
    }, [images, size])

    return (
        <div className="composite-cover-container">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {compositeImageUrl ? (
                <img src={compositeImageUrl} alt="Playlist Cover" className="station-cover-img" />
            ) : (
                <div className="station-cover-placeholder" />
            )}
        </div>
    )
}