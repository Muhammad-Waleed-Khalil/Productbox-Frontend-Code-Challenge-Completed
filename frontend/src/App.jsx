import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Items from './pages/Items'
import AddItem from './pages/AddItem'
import Checkout from './pages/Checkout'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  )
}

export default App