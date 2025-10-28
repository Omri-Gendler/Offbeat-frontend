export const uploadService = { uploadImg };

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

async function uploadImg(ev) { 
  let file;
  if (ev.target && ev.target.files && ev.target.files[0]) {
    file = ev.target.files[0]
  } else if (ev instanceof Blob) {
    file = ev
  } else {
    console.error("uploadImg: Invalid input provided.", ev)
    throw new Error("Invalid input for image upload")
  }

  console.log(`Uploading to Cloudinary. Cloud Name: ${CLOUD_NAME}, Preset: ${UPLOAD_PRESET}`)

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary environment variables VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET are not set.")
    throw new Error("Cloudinary configuration missing")
  }


  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    });
    const data = await res.json()
    if (!res.ok) {
      const msg = data?.error?.message || `Upload failed (HTTP ${res.status})`
      console.error("Cloudinary upload error:", data.error)
      throw new Error(msg)
    }
    console.log('Cloudinary upload response:', data)
    return data
  } catch (err) {
    console.error('Failed to upload image to Cloudinary:', err)
    throw err
  }
}