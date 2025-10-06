export const uploadService = { uploadImg }

async function uploadImg(file) {
  const CLOUD_NAME = 'dklhy0he2'          // <- verify this exactly matches your Cloudinary cloud name
  const UPLOAD_PRESET = 'car_preset'      // <- verify this preset exists and is UNSIGNED
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  if (!(file instanceof Blob)) {
    throw new Error('uploadImg: expected a File/Blob')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })

  // Read the JSON body even on failure to see Cloudinary’s error
  let data
  try {
    data = await res.json()
  } catch {
    // if non-JSON for some reason
    throw new Error(`Upload failed (HTTP ${res.status})`)
  }

  if (!res.ok) {
    // Cloudinary typically returns: { error: { message: "..."} }
    const msg = data?.error?.message || `Upload failed (HTTP ${res.status})`
    throw new Error(msg)
  }

  return data
}
