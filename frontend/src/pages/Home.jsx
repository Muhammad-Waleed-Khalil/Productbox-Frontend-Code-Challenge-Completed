import { Link as RouterLink } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import StoreIcon from '@mui/icons-material/Store'

const MotionButton = motion(Button)

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          mt: 8,
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Welcome to RandoStore
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Your one-stop shop for unique and random items.
          Browse our collection, add your own items, or check out what's in your cart!
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }
            }}
          >
            <MotionButton
              component={RouterLink}
              to="/items"
              variant="contained"
              size="large"
              startIcon={<StoreIcon />}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{ py: 2 }}
            >
              Browse Items
            </MotionButton>

            <MotionButton
              component={RouterLink}
              to="/add-item"
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<AddCircleIcon />}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{ py: 2 }}
            >
              Add Item
            </MotionButton>

            <MotionButton
              component={RouterLink}
              to="/checkout"
              variant="contained"
              size="large"
              color="success"
              startIcon={<ShoppingCartIcon />}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{ py: 2 }}
            >
              View Cart
            </MotionButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Home