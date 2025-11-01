import React, { useState, useEffect, useRef, useCallback } from 'react'
import { IconClose16, IconPlaylist24, IconEdit24 } from './Icon'
import { uploadService } from '../services/upload.service'

export function EditStationModal({ station, onClose, onSave }) {
  const fileInputRef = useRef(null)
  const dialogRef = useRef(null)

  const [details, setDetails] = useState({ name: '', description: '', imgUrl: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // initialize from station
  useEffect(() => {
    if (!station) return
    const img = station.imgUrl || ''
    setDetails({
      name: station.name || '',
      description: station.description || '',
      imgUrl: img
    })
    setImagePreview(img)
  }, [station])

  // body scroll lock
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  // Escape to close
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // very light focus trap inside dialog
  useEffect(() => {
    const root = dialogRef.current
    if (!root) return
    const focusableSel = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="file"]:not([disabled])',
      'input[type="search"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    const focusables = () => Array.from(root.querySelectorAll(focusableSel))
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    root.addEventListener('keydown', onKeyDown)
    // focus the first focusable on mount
    const items = focusables()
    items[0]?.focus()

    return () => root.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleChange = ({ target }) => {
    const { name, value } = target
    setDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB'); return
    }
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result || '')
    reader.readAsDataURL(file)
    
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview('')
    setDetails(prev => ({ ...prev, imgUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSaveStation = useCallback(async (ev) => {
    ev.preventDefault()
    if (isSaving) return
    try {
      setIsSaving(true)
      const updated = { ...details }
      if (selectedImage) {
        const uploadData = await uploadService.uploadImg(selectedImage)
        updated.imgUrl = uploadData.secure_url
      }
      await onSave(updated) // let parent persist
      onClose()
    } catch (err) {
      console.error('Failed to save station', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }, [details, selectedImage, onSave, onClose, isSaving])

  if (!station) return null

  // backdrop click closes
  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onOverlayClick}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-station-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h1 id="edit-station-title" className="title-modal">Edit details</h1>
          <button className="close-btn icon-btn" onClick={onClose} aria-label="Close">
            <IconClose16 />
          </button>
        </header>

        <form className="edit-details-form" onSubmit={onSaveStation}>
          <div className="form-content modal-main-content">
            {/* Hidden file input */}
            <input
              className="image-uploder-input"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp,image/gif"
              data-testid="image-file-picker"
              style={{ display: 'none' }}
            />

            {/* Image / placeholder */}
            <div className="album-image">
              <div className="image-container" onClick={handleImageClick} role="button" tabIndex={0}
                   onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && handleImageClick()}>
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="" draggable={false} />
                    <div className="image-overlay">
                      <IconEdit24 />
                      <span>Change photo</span>
                      <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <IconPlaylist24 />
                    <span>Choose photo</span>
                  </div>
                )}
              </div>

              {/* Separate edit button if you prefer click target */}
              <div className="edit-image-container">
                <div className="edit-image-button-container">
                  <button type="button" className="edit-image-button" onClick={handleImageClick}>
                    <div className="edit-icon">
                      <IconEdit24 />
                      <span className="choose-photo-span">Choose photo</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="edit-title">
            <input
                id="station-name"
                name="name"
                className="edit-title-input"
                type="text"
                autoCorrect="off"
                autoComplete="off"
                
                placeholder={`${details.name}`}
                value={details.name}
                onChange={handleChange}
                required
            />
            <label htmlFor="station-name">Name</label>
            </div>

            <div className='edit-description' >
              <textarea
                id="station-description"
                name="description"
                value={details.description}
                onChange={handleChange}
                className="edit-description-textarea"
                autoCorrect='off'
                autoComplete='off'
                placeholder="Add an optional description"
                rows={4}
              />
             <label htmlFor="station-description">Description</label>
             </div>



            <div className='save-btn-container'>
            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
