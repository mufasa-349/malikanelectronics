import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import ProductCard from '../Product/ProductCard'
import Filter from '../../Shop/Filter'
import { getProductsByCategory, getProductsData } from '../../../app/data/productsData'

const CategoryPage = () => {
    const { categorySlug } = useParams()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoryName, setCategoryName] = useState('')
    const [sortBy, setSortBy] = useState('popularity')
    const [filterBy, setFilterBy] = useState('most-popular')

    // Kategori slug'ından kategori adını çevir
    const getCategoryName = (slug) => {
        const categoryMap = {
            'tum-urunler': 'Tüm Ürünler',
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

    // Sıralama fonksiyonları
    const sortProducts = (products, sortType) => {
        const sortedProducts = [...products]
        
        switch (sortType) {
            case 'popularity':
                return sortedProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
            case 'newness':
                return sortedProducts.sort((a, b) => b.id - a.id)
            case 'price-low':
                return sortedProducts.sort((a, b) => a.price - b.price)
            case 'price-high':
                return sortedProducts.sort((a, b) => b.price - a.price)
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
            default:
                return sortedProducts
        }
    }

    // Filtreleme fonksiyonu
    const filterProducts = (products, filterType) => {
        switch (filterType) {
            case 'most-popular':
                return sortProducts(products, 'popularity')
            case 'best-seller':
                return sortProducts(products, 'popularity')
            case 'trending':
                return sortProducts(products, 'newness')
            case 'featured':
                return sortProducts(products, 'rating')
            default:
                return products
        }
    }

    // Sıralama değiştiğinde
    const handleSortChange = (sortType) => {
        setSortBy(sortType)
        const sorted = sortProducts(products, sortType)
        setFilteredProducts(sorted)
    }

    // Filtre değiştiğinde
    const handleFilterChange = (filterType) => {
        setFilterBy(filterType)
        const filtered = filterProducts(products, filterType)
        setFilteredProducts(filtered)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                let categoryProducts
                if (categorySlug === 'tum-urunler') {
                    // Tüm ürünleri getir
                    categoryProducts = getProductsData()
                } else {
                    // Belirli kategori ürünlerini getir
                    categoryProducts = getProductsByCategory(categorySlug)
                }
                setProducts(categoryProducts)
                setFilteredProducts(categoryProducts)
                setCategoryName(getCategoryName(categorySlug))
            } catch (error) {
                console.error('Ürünler yüklenirken hata:', error)
                setProducts([])
                setFilteredProducts([])
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
                                <p>{filteredProducts.length} ürün bulundu</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bileşeni */}
                    <div className="row mb-4">
                        <div className="col-lg-6 col-md-12">
                            <div className="product_filter">
                                <div className="customs_selects">
                                    <select 
                                        name="filter" 
                                        className="customs_sel_box" 
                                        value={filterBy}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    >
                                        <option value="most-popular">Most Popular</option>
                                        <option value="best-seller">Best Seller</option>
                                        <option value="trending">Trending</option>
                                        <option value="featured">Featured</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="product_shot">
                                <div className="product_shot_title">
                                    <p>Sort By:</p>
                                </div>
                                <div className="customs_selects">
                                    <select 
                                        name="sort" 
                                        className="customs_sel_box" 
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                    >
                                        <option value="popularity">Sort By Popularity</option>
                                        <option value="newness">Sort By Newness</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name-asc">Name: A to Z</option>
                                        <option value="name-desc">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {filteredProducts.length > 0 ? (
                        <div className="row">
                            {filteredProducts.map((product) => (
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
