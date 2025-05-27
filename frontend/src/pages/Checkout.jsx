import { useNavigate } from 'react-router-dom'
import { Container, Typography, Paper, Button, Box, Grid, IconButton, Divider } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId)
    toast.success('Item removed from cart')
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity)
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/items')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Shopping Cart
        </Typography>

        <AnimatePresence mode="wait">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              exit="exit"
            >
              <Paper
                elevation={2}
                sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="subtitle1" color="primary">
                      ${parseFloat(item.price).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                      >
                        -
                      </Button>
                      <Typography>{item.quantity || 1}</Typography>
                      <Button
                        size="small"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                      >
                        +
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      color="error"
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>

        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Total:</Typography>
            <Typography variant="h5" color="primary">
              ${getCartTotal().toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/items')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => toast.success('Thank you for your purchase!')}
            >
              Checkout
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default Checkout