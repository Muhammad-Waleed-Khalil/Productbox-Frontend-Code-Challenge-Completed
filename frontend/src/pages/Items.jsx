import { useState, useEffect } from 'react'
import { Container, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import ItemCard from '../components/ItemCard'
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function Items() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get('/items')
      setItems(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load items')
      setLoading(false)
    }
  }

  const handleDeleteItem = (deletedItemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== deletedItemId));
  }

  const filteredAndSortedItems = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = parseFloat(a.price)
      const priceB = parseFloat(b.price)
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
    })

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search items"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
              <InputLabel>Sort by price</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort by price"
              >
                <MenuItem value="asc">Price: Low to High</MenuItem>
                <MenuItem value="desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredAndSortedItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <motion.div
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <ItemCard item={item} onDelete={handleDeleteItem} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </Container>
  )
}

export default Items