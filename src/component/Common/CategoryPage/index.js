import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import ProductCard from '../Product/ProductCard'
import { getProductsByCategory } from '../../../app/data/productsData'

const CategoryPage = () => {
    const { categorySlug } = useParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoryName, setCategoryName] = useState('')

    // Kategori slug'ından kategori adını çevir
    const getCategoryName = (slug) => {
        const categoryMap = {
            'bilgisayar-aksesuarlari': 'Bilgisayar Aksesuarları',
            'kamera-fotograf': 'Kamera & Fotoğraf',
            'arac-elektronik': 'Araç Elektronik',
            'elektronik': 'Elektronik',
            'ses-ve-muzik': 'Ses & Müzik',
            'spor-acik-hava': 'Spor & Açık Hava',
            'genel': 'Genel'
        }
        return categoryMap[slug] || slug
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const categoryProducts = getProductsByCategory(categorySlug)
                setProducts(categoryProducts)
                setCategoryName(getCategoryName(categorySlug))
            } catch (error) {
                console.error('Ürünler yüklenirken hata:', error)
                setProducts([])
            }
            setLoading(false)
        }

        fetchProducts()
    }, [categorySlug])

    if (loading) {
        return (
            <>
                <Header />
                <section className="ptb-100">
                    <div className="container">
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Yükleniyor...</span>
                            </div>
                            <p className="mt-3">Ürünler yükleniyor...</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <section className="ptb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center mb-5">
                                <h2>{categoryName} Kategorisi</h2>
                                <p>{products.length} ürün bulundu</p>
                            </div>
                        </div>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                    <ProductCard data={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center py-5">
                                    <h3>Bu kategoride ürün bulunamadı</h3>
                                    <p>Bu kategoride henüz ürün bulunmuyor.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    )
}

export default CategoryPage
