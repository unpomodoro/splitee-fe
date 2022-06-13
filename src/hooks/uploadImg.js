import { imgUploadUrl } from "../URL"

export async function uploadImg(file) {

    const formData = new FormData()
    formData.append("api_key", '786584771818663')
    formData.append("api_secret", 'dyM3OV8_EBr8iLm9BFb02KASToI')
    formData.append("file", file)
    formData.append("cloud_name", 'dmp5u8qaq')
    formData.append('upload_preset', 'splitee')
    const res = await fetch(imgUploadUrl, {method:'POST', body: formData})
                        .then(response => response.json())

    return res.secure_url
}