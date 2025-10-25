import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { updateStation } from '../store/actions/station.actions';
import { useNavigate } from 'react-router-dom';

export function EditStationModal({ station, onClose, onSave }) {

    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [details, setDetails] = useState({
        name: '',
        description: '',
        imgUrl: ''
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => {
        if (station) {
            setDetails({
                name: station.name || '',
                description: station.description || '',
                imgUrl: station.imgUrl || ''
            })
            setImagePreview(station.imgUrl || '')
        }
    }, [station])

    function handleChange({ target }) {
        const { name, value } = target
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }))
    }

    function handleImageClick() {
        fileInputRef.current?.click()
    }

    function handleImageChange(event) {
        const file = event.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB')
                return
            }

            setSelectedImage(file)
            
            // Create preview URL
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
                setDetails(prev => ({ ...prev, imgUrl: e.target.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    function handleRemoveImage() {
        setSelectedImage(null)
        setImagePreview('')
        setDetails(prev => ({ ...prev, imgUrl: '' }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    async function onSaveStation(ev) {
        try {
            ev.preventDefault()
            
            // Prepare the updated station data
            const updatedDetails = { ...details }
            
            // If there's a selected image file, we could upload it here
            // For now, we're using the base64 data URL
            if (selectedImage) {
                console.log('New image selected:', selectedImage.name)
                // In a real app, you might upload to a service like Cloudinary or AWS S3
                // updatedDetails.imgUrl = await uploadImageToService(selectedImage)
            }
            
            onSave(updatedDetails)
            onClose()
            navigate('/station/' + station._id)
        } catch (err) {
            console.error('Failed to update station:', err)
        }
    }

    if (!station) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Edit details</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={onSaveStation} className="edit-details-form">
                    <div className="form-content">
                        <div className="image-uploader">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            
                            <div className="image-container" onClick={handleImageClick}>
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Station cover" />
                                        <div className="image-overlay">
                                            <PhotoCameraIcon />
                                            <span>Change photo</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="image-placeholder">
                                        <PhotoCameraIcon />
                                        <span>Choose photo</span>
                                    </div>
                                )}
                            </div>
                            
                            {imagePreview && (
                                <button 
                                    type="button" 
                                    className="remove-image-btn"
                                    onClick={handleRemoveImage}
                                >
                                    Remove image
                                </button>
                            )}
                        </div>
                        <div className="inputs-container">
                            <input
                                type="text"
                                name="name"
                                value={details.name}
                                onChange={handleChange}
                                autoFocus
                            />
                            <textarea
                                name="description"
                                value={details.description}
                                onChange={handleChange}
                                placeholder="Add an optional description"
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}