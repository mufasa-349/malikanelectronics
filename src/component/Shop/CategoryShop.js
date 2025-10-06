import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ProductCard from '../Common/Product/ProductCard'
import Filter from './Filter'
import { useSelector } from "react-redux"
import { findCategoryBySlug, getCategoryBreadcrumb } from '../../app/data/categoriesData'
import { getProductsByCategory } from '../../app/data/productsData'

const CategoryShop = () => {
    const { categorySlug } = useParams()
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [category, setCategory] = useState(null)
    const [breadcrumb, setBreadcrumb] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtering, setFiltering] = useState(false)
    const [categoryChanging, setCategoryChanging] = useState(false)
    const [previousCategory, setPreviousCategory] = useState(null)
    
    // Tüm ürünleri al
    let allProducts = useSelector((state) => state.products.products)
    
    useEffect(() => {
        setLoading(true)
        setCategoryChanging(true)
        
        // URL'den kategori slug'ını al
        const urlParams = new URLSearchParams(location.search)
        const categoryParam = urlParams.get('category') || categorySlug
        
        // Önceki kategoriyi kaydet
        if (category && category.slug !== categoryParam) {
            setPreviousCategory(category)
        }
        
        // Simüle edilmiş loading delay
        setTimeout(() => {
            if (categoryParam) {
                // Kategoriyi bul
                const foundCategory = findCategoryBySlug(categoryParam)
                setCategory(foundCategory)
                
                // Breadcrumb oluştur
                const breadcrumbPath = getCategoryBreadcrumb(categoryParam)
                setBreadcrumb(breadcrumbPath)
                
                // Kategoriye göre ürünleri filtrele
                filterProductsByCategory(categoryParam)
            } else {
                // Tüm ürünleri göster
                setProducts(allProducts)
                setCategory({ name: "Tüm Ürünler", slug: "all" })
            }
            setLoading(false)
            
            // Kategori değişikliği animasyonunu bitir
            setTimeout(() => {
                setCategoryChanging(false)
                setPreviousCategory(null)
            }, 300)
        }, 500)
    }, [categorySlug, location.search, allProducts])
    
    const filterProductsByCategory = (categorySlug) => {
        // Gerçek ürün verilerini kullan
        const filteredProducts = getProductsByCategory(categorySlug)
        setProducts(filteredProducts)
    }
    
    const randProduct = (page) => {
        if (page) {
            setFiltering(true)
            setTimeout(() => {
                let data = [...products].sort((a, b) => 0.5 - Math.random())
                setProducts(data)
                setPage(page)
                setFiltering(false)
            }, 300)
        }
    }
    
    return (
        <>
            <section id="shop_main_area" className="ptb-100">
                <div className="container">
                    {/* Breadcrumb */}
                    {breadcrumb.length > 0 && (
                        <nav aria-label="breadcrumb" className={`mb-4 ${categoryChanging ? 'updating' : ''}`}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/">Ana Sayfa</a>
                                </li>
                                {breadcrumb.map((item, index) => (
                                    <li key={index} className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}>
                                        {index === breadcrumb.length - 1 ? (
                                            item.name
                                        ) : (
                                            <a href={`/shop?category=${item.slug}`}>{item.name}</a>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}
                    
                    {/* Kategori Başlığı */}
                    <div className={`category-header mb-4 ${categoryChanging ? 'changing' : ''}`}>
                        <h1 className={`category-title ${categoryChanging ? 'changing' : ''}`}>
                            {category ? category.name : 'Ürünler'}
                        </h1>
                        <p className={`category-description ${categoryChanging ? 'updating' : ''}`}>
                            {category ? `${category.name} kategorisindeki ${products.length} ürün` : `${products.length} ürün bulundu`}
                        </p>
                        {categoryChanging && previousCategory && (
                            <div className="category-transition-indicator">
                                <small className="text-muted">
                                    {previousCategory.name} → {category ? category.name : 'Tüm Ürünler'}
                                </small>
                            </div>
                        )}
                    </div>
                    
                    <Filter filterEvent={randProduct}/>
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="loading-container text-center py-5">
                            <div className="loading-spinner">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Yükleniyor...</span>
                                </div>
                            </div>
                            <p className="loading-text mt-3">Ürünler yükleniyor...</p>
                        </div>
                    )}
                    
                    {/* Products Grid */}
                    <div className={`products-grid ${loading ? 'loading' : ''} ${filtering ? 'filtering' : ''}`}>
                        <div className="row">
                            {!loading && products.length > 0 ? (
                                products.map((data, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-12 product-item" key={index}>
                                        <ProductCard data={data} />
                                    </div>
                                ))
                            ) : !loading && products.length === 0 ? (
                                <div className="col-12">
                                    <div className="no-products text-center py-5">
                                        <h3>Bu kategoride ürün bulunamadı</h3>
                                        <p>Farklı bir kategori seçmeyi deneyin.</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    
                    {/* Pagination */}
                    {!loading && products.length > 0 && (
                        <div className="col-lg-12">
                            <ul className="pagination">
                                <li className="page-item" onClick={(e) => { randProduct(page > 1 ? page - 1 : 0) }}>
                                    <a className="page-link" href="#!" aria-label="Previous">
                                        <span aria-hidden="true">«</span>
                                    </a>
                                </li>
                                <li className={"page-item " + (page === 1 ? "active" : null)} onClick={(e) => { randProduct(1) }}>
                                    <a className="page-link" href="#!">1</a>
                                </li>
                                <li className={"page-item " + (page === 2 ? "active" : null)} onClick={(e) => { randProduct(2) }}>
                                    <a className="page-link" href="#!">2</a>
                                </li>
                                <li className={"page-item " + (page === 3 ? "active" : null)} onClick={(e) => { randProduct(3) }}>
                                    <a className="page-link" href="#!">3</a>
                                </li>
                                <li className="page-item" onClick={(e) => { randProduct(page < 3 ? page + 1 : 0) }}>
                                    <a className="page-link" href="#!" aria-label="Next">
                                        <span aria-hidden="true">»</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default CategoryShop
