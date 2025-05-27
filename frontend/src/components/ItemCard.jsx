import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material'
import { motion } from 'framer-motion'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import axios from 'axios'

const MotionCard = motion(Card)

function ItemCard({ item, onDelete }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(item)
    toast.success(`${item.name} added to cart!`)
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await axios.delete(`/items/${item.id}`)
        toast.success(`${item.name} deleted successfully!`)
        onDelete(item.id)
      } catch (error) {
        console.error('Error deleting item:', error)
        toast.error('Failed to delete item.')
      }
    }
  }

  return (
    <MotionCard
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={item.img}
        alt={item.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {item.name}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          ${parseFloat(item.price).toFixed(2)}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{ flexGrow: 1, mr: 1 }}
          >
            Add to Cart
          </Button>
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            color="error"
            onClick={handleDelete}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </MotionCard>
  )
}

export default ItemCard