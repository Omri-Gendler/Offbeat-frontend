import { useState, useEffect, useRef } from 'react'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { uploadService } from '../services/upload.service'

export default  
function StationCover({ station, onChangeUrl }) {
  const [isHover, setIsHover] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(station?.imgUrl || '/img/unnamed-song.png')
  const inputRef = useRef(null)

  useEffect(() => {
    setPreviewUrl('/img/unnamed-song.png')
  }, [station?.imgUrl])

  function openFileDialog() {
    inputRef.current?.click()
  }

  async function handleFiles(files) {
    if (!files || !files.length) return
    const file = files[0]

const imageTypeRegex = new RegExp('^image\\/(png|jpe?g|webp)$', 'i')
const imageNameRegex = new RegExp('\\.(png|jpe?g|webp)$', 'i')

const isImage = file.type
  ? imageTypeRegex.test(file.type)
  : imageNameRegex.test(file.name || '')

if (!isImage) {
  showErrorMsg('Please choose a PNG, JPG, JPEG, or WEBP image')
  return
}

if (file.size > 10 * 1024 * 1024) {
  showErrorMsg('Max size is 10MB')
  return
}


    let localPreviewUrl = ''
try {
  setIsUploading(true)
  const imgData = await uploadService.uploadImg(file)
  const url = imgData.secure_url || imgData.url
  const squareUrl = url.replace('/upload/', '/upload/c_fill,ar_1:1,g_auto,w_600,h_600/')
  setPreviewUrl(squareUrl)
  onChangeUrl?.(squareUrl)
  showSuccessMsg('Cover updated')
} catch (err) {
  console.error('Cloudinary upload error:', err)
  showErrorMsg(err.message || 'Upload failed. Check preset/cloud name.')
  setPreviewUrl(station?.imgUrl || '')
} finally {
  setIsUploading(false)
  if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
}

  }

  function onInputChange(ev) {
    handleFiles(ev.target.files)
  }

  function onDragOver(ev) { ev.preventDefault(); setIsHover(true) }
  function onDragLeave() { setIsHover(false) }
  function onDrop(ev) { ev.preventDefault(); setIsHover(false); handleFiles(ev.dataTransfer.files) }

  return (
    <section className='station-cover-section'>
    <div
      className="station-cover"
      onClick={openFileDialog}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      aria-label="Change station image"
      tabIndex={0}
      onKeyDown={(e) =>{
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault()
         openFileDialog()}}}

    >
      <img src={previewUrl} alt=""  className={`cover-img ${isUploading ? 'uploading' : ''}`} />
        <div className={`overlay ${isHover ? 'show' : ''}`}>
        </div>

      <input
        ref={inputRef}
        id="imgUpload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
    </div>
    </section>
  )
}