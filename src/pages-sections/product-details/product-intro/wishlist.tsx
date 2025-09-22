"use client"
import WishlistSelector from '@/components/wishlist/wish-list-selector'
import Heart from '@/icons/Heart'
import HeartLine from '@/icons/HeartLine'
import { SingleProductResponse } from '@/models/SingleProduct.model'
import { Avatar } from '@mui/material'
import React, { useState } from 'react'

type Props = {
    product: SingleProductResponse
}

function Wishlist({ product }: Props) {
    const [isAdded, setIsAdded] = useState(false)
    const [open, setOpen] = useState(false)

    const toggleOpen = () => {
        setOpen(prev => !prev)
    }

    const handleCloseModal = (isToggled: boolean) => {
        setOpen(false)
        if (isToggled) {
            setIsAdded(prev => !prev)
        }
    }

    return <div style={{ position: 'relative' }}>
        <Avatar sx={{
            position: 'absolute',
            right: '0.5rem',
            top: '0.5rem',
            cursor: 'pointer'
        }} onClick={toggleOpen} variant="rounded" className="avatar">
            {
                isAdded ?
                    <Heart color="error" /> :
                    <HeartLine color="primary" />
            }
        </Avatar>
        {
            open && <WishlistSelector product={product} handleCloseModal={handleCloseModal} />
        }
    </div>
}

export default Wishlist