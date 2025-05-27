import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import toast from 'react-hot-toast'
import axios from 'axios'

function AddItem() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0'
    }
    if (!formData.image) {
      newErrors.image = 'Image is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 2MB' }))
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPG and PNG images are allowed' }))
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setPreviewUrl(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, image: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('price', formData.price)
    submitData.append('image', formData.image)

    try {
      await axios.post('/items', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Item added successfully!')
      navigate('/items')
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Item
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              error={!!errors.price}
              helperText={errors.price}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <input
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
              {errors.image && (
                <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                  {errors.image}
                </Typography>
              )}
            </Box>

            {previewUrl && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Item'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default AddItem