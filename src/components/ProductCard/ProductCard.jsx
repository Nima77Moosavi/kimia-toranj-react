
import React from 'react'
import styles from './ProductCard.module.css' // فرض کنید این فایل CSS را دارید

const ProductCard = ({product}) => {
  return (
    <div className={styles.card}>
        <img src={
              product.images.length > 0
                ? `${product.images[0].image}`
                : "/placeholder.jpg"
            }alt={product.title} className={styles.img}/>
        <h4 className={styles.title}>{product.title}</h4>
        <button className={styles.price}> {product.variants[0].price} تومان </button>
    </div>
  )
}

export default ProductCard

