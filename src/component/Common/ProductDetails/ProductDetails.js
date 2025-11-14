import React, { useState, useEffect, useRef } from 'react'
import RelatedProduct from './RelatedProduct'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { RatingStar } from "rating-star";
import Swal from 'sweetalert2';
import { fetchProductById } from '../../../app/slices/products';
import { incrementWhatsAppClick, getProductWhatsAppClicks } from '../../../utils/whatsappTracker';

const ProductDetailsOne = () => {
    let dispatch = useDispatch();
    let { id } = useParams();
    
    // Redux'tan ürün ve loading state'lerini al
    const product = useSelector((state) => state.products.single);
    const loading = useSelector((state) => state.products.singleLoading);
    const [localProduct, setLocalProduct] = useState(null);
    
    // Firebase'den ürünü yükle
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [id, dispatch]);
    
    // Ürün yüklendiğinde WhatsApp tıklama sayısını ekle
    useEffect(() => {
        if (product) {
            const whatsappClicks = getProductWhatsAppClicks(product.id);
            const updatedProduct = {
                ...product,
                whatsappClicks: whatsappClicks
            };
            setLocalProduct(updatedProduct);
        }
    }, [product]);
    
    // Product yüklendiğinde ana görseli ata - image attribute'unu öncelikli kullan
    useEffect(() => {
        const productToUse = localProduct || product;
        if (productToUse?.image) {
            setImg(productToUse.image);
        } else if (productToUse?.img) {
            setImg(productToUse.img);
        } else if (productToUse?.mainImage) {
            setImg(productToUse.mainImage);
        } else if (productToUse?.images?.length) {
            setImg(productToUse.images[0]);
        } else {
            setImg(null);
        }
    }, [product, localProduct]);

    // Add to cart
    const addToCart = async (id) => {
        dispatch({ type: "products/addToCart", payload: { id } })
    }

    // Add to Favorite
    const addToFav = async (id) => {
        dispatch({ type: "products/addToFav", payload: { id } })
    }

    // Add to Compare
    const addToComp = async (id) => {
        dispatch({ type: "products/addToComp", payload: { id } })
    }

    // WhatsApp tıklama sayısını artır
    const handleWhatsAppClick = (productId) => {
        const newCount = incrementWhatsAppClick(productId);
        // Ürün state'ini güncelle
        setLocalProduct(prevProduct => ({
            ...prevProduct,
            whatsappClicks: newCount
        }));
    }

    // Color swatch fonksiyonu kaldırıldı - sadece ana görsel kullanıyoruz

    const [count, setCount] = useState(1)

    const [img, setImg] = useState(null)
    const [hoveredImage, setHoveredImage] = useState(null)
    const [isHovering, setIsHovering] = useState(false)
    
    // Placeholder görsel
    const PLACEHOLDER = "https://via.placeholder.com/800x600?text=G%C3%B6rsel+Bulunamad%C4%B1"
    
    // Hover timeout için ref
    const hoverTimeoutRef = useRef(null)
    
    // Gelişmiş hover fonksiyonları
    const handleThumbnailHover = (image) => {
        // Önceki timeout'u temizle
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }
        
        setIsHovering(true)
        setHoveredImage(image)
    }
    
    const handleThumbnailLeave = () => {
        // Kısa bir delay ile hover'ı temizle (flicker'ı önlemek için)
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(false)
            setHoveredImage(null)
        }, 100)
    }
    
    const handleThumbnailClick = (image) => {
        // Tıklama durumunda hover'ı hemen temizle
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }
        setIsHovering(false)
        setHoveredImage(null)
        setImg(image)
    }
    
    // Component unmount'ta timeout'u temizle
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
            }
        }
    }, [])

    const incNum = () => {
        setCount(count + 1)
    }
    const decNum = () => {
        if (count > 1) {
            setCount(count - 1)
        } else {
            Swal.fire('Sorry!', "Minimun Quantity Reached",'warning')
            setCount(1)
        }
    }
    if (loading) {
        return (
            <section id="product_single_one" className="ptb-100">
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Yükleniyor...</span>
                        </div>
                        <p className="mt-3">Ürün yükleniyor...</p>
                    </div>
                </div>
            </section>
        )
    }

    const productToDisplay = localProduct || product;
    
    if (!productToDisplay) {
        return (
            <section id="product_single_one" className="ptb-100">
                <div className="container">
                    <div className="text-center py-5">
                        <h3>Ürün bulunamadı</h3>
                        <p>Bu ürün mevcut değil veya kaldırılmış olabilir.</p>
                        <Link to="/shop" className="btn btn-primary">Alışverişe Dön</Link>
                    </div>
                </div>
            </section>
        )
    }

    const descriptionParagraphs = productToDisplay.description
        ? productToDisplay.description.split(/\n+/).map(paragraph => paragraph.trim()).filter(Boolean)
        : [];

    return (
        <>
            <section id="product_single_one" className="ptb-100">
                <div className="container">
                    <div className="row area_boxed">
                        <div className="col-lg-4">
                            <div className="product-image-container">
                                <div className="main-product-image">
                                    <img 
                                        src={isHovering && hoveredImage ? hoveredImage : (img || PLACEHOLDER)} 
                                        alt={product?.title || 'Ürün'} 
                                        className="main-image"
                                        onError={(e) => {
                                            e.currentTarget.src = PLACEHOLDER;
                                        }}
                                    />
                                    {/* Hover indicator */}
                                    {isHovering && (
                                        <div className="hover-indicator">
                                            <i className="fa fa-eye"></i>
                                            <span>Önizleme</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Thumbnail Galerisi */}
                                {productToDisplay.images && productToDisplay.images.length > 0 && (
                                    <div className="product-gallery mt-4">
                                        <h6 className="gallery-title">Ürün Görselleri</h6>
                                        <div className="gallery-thumbnails">
                                            {productToDisplay.images.map((image, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`thumbnail-item ${img === image ? 'active' : ''} ${isHovering && hoveredImage === image ? 'hovering' : ''}`}
                                                    onClick={() => handleThumbnailClick(image)}
                                                    onMouseEnter={() => handleThumbnailHover(image)}
                                                    onMouseLeave={handleThumbnailLeave}
                                                >
                                                    <img 
                                                        src={image} 
                                                        alt={`${product?.title || 'Ürün'} ${index + 1}`}
                                                        className="thumbnail-image"
                                                        onError={(e) => {
                                                            e.currentTarget.src = PLACEHOLDER;
                                                        }}
                                                    />
                                                    {/* Hover overlay */}
                                                    <div className="thumbnail-hover-overlay">
                                                        <i className="fa fa-search-plus"></i>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="product_details_right_one">
                                <div className="modal_product_content_one">
                                    <h3>{productToDisplay.title}</h3>
                                    <div className="brand-info mb-2">
                                        <small className="text-muted">Marka: {productToDisplay.brand}</small>
                                    </div>
                                    <div className="product-code-info mb-2">
                                        <small className="text-muted">Ürün Kodu: <strong>{productToDisplay.productCode}</strong></small>
                                    </div>
                                    {productToDisplay.ean && (
                                        <div className="product-ean-info mb-3">
                                            <small className="text-muted">EAN: <strong>{productToDisplay.ean}</strong></small>
                                        </div>
                                    )}
                                <div className="reviews_rating">
                                    <RatingStar maxScore={5} rating={productToDisplay.rating} id="rating-star-common" />
                                    <span>({productToDisplay.reviewCount} Müşteri Değerlendirmesi)</span>
                                </div>
                                
                                {/* WhatsApp İlgi Sayısı - Sadece 3 ve üzeri olduğunda göster */}
                                {(productToDisplay.whatsappClicks || 0) >= 3 && (
                                    <div className="whatsapp-interest">
                                        <span className="interest-count">
                                            <i className="fab fa-whatsapp" style={{color: '#25D366', marginRight: '5px'}}></i>
                                            {productToDisplay.whatsappClicks >= 10 ? `${productToDisplay.whatsappClicks}+` : productToDisplay.whatsappClicks} kişi bu ürünle ilgilendi
                                        </span>
                                    </div>
                                )}
                                <div className="price-section">
                                    <h4 className="current-price">₺{productToDisplay.price.toLocaleString()}</h4>
                                    {productToDisplay.originalPrice && productToDisplay.originalPrice !== productToDisplay.price && (
                                        <span className="original-price">Orijinal: ₺{productToDisplay.originalPrice.toLocaleString()}</span>
                                    )}
                                    <div className="price-info mt-2">
                                        <small className="text-muted">
                                            <i className="fa fa-info-circle" style={{marginRight: '5px'}}></i>
                                            Fiyatlarımıza KDV dahildir ve ürünlerimiz faturalıdır
                                        </small>
                                        <div className="delivery-payment-info mt-2">
                                            <div className="delivery-info mb-3">
                                                <div className="alert alert-success py-2 px-3 mb-0" style={{fontSize: '0.9rem'}}>
                                                    <i className="fa fa-truck" style={{marginRight: '8px', fontSize: '1.1rem'}}></i>
                                                    <strong>Tahmini Teslim Tarihi:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: 'numeric' 
                                                    })}
                                                </div>
                                            </div>
                                            <div className="payment-info mb-3">
                                                <div className="alert alert-info py-2 px-3 mb-0" style={{fontSize: '0.9rem'}}>
                                                    <i className="fa fa-credit-card" style={{marginRight: '8px', fontSize: '1.1rem'}}></i>
                                                    <strong>Ödeme:</strong> Ürün tesliminde ödemenizi tüm kredi/banka kartlarıyla ya da nakit yapabilirsiniz.
                                                </div>
                                            </div>
                                            <div className="return-info">
                                                <small className="text-muted" style={{fontSize: '0.8rem'}}>
                                                    <i className="fa fa-undo" style={{marginRight: '5px'}}></i>
                                                    İade Süresi: 30 gün
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* WhatsApp ve Telefon İletişim Butonları - Fiyatın hemen altında */}
                                <div className="contact-buttons-price">
                                    <a 
                                        href={`https://wa.me/905393973949?text=Merhaba, ${productToDisplay.title} ürünü hakkında bilgi almak istiyorum. Ürün Kodu: ${productToDisplay.productCode} - Fiyat: ₺${productToDisplay.price.toLocaleString()}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="whatsapp-btn-price"
                                        onClick={() => handleWhatsAppClick(productToDisplay.id)}
                                    >
                                        <i className="fab fa-whatsapp" style={{fontSize: '18px', marginRight: '8px'}}></i>
                                        WhatsApp ile İletişim
                                    </a>
                                    <a 
                                        href="tel:+905393973949" 
                                        className="phone-btn-price"
                                    >
                                        <i className="fa fa-phone"></i>
                                        Telefon Et
                                    </a>
                                </div>
                                    {/* Color seçimi kaldırıldı - sadece ana görsel kullanıyoruz */}
                                    <form id="product_count_form_two">
                                        <div className="product_count_one">
                                            <div className="plus-minus-input">
                                                <div className="input-group-button">
                                                    <button type="button" className="button" onClick={decNum}>
                                                        <i className="fa fa-minus"></i>
                                                    </button>
                                                </div>
                                                <input className="form-control" type="number" value={count} readOnly />
                                                <div className="input-group-button">
                                                    <button type="button" className="button" onClick={incNum}>
                                                        <i className="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    
                                    {/* Ürün Açıklaması - Color bilgisinin altında */}
                                    <div className="product-description-section mt-4">
                                        <h5 className="description-title">Ürün Açıklaması</h5>
                                        <div className="description-content">
                                            {descriptionParagraphs.length > 0 ? (
                                                descriptionParagraphs.map((paragraph, index) => (
                                                    <p key={index}>{paragraph}</p>
                                                ))
                                            ) : (
                                                <p>Bu ürün için detaylı açıklama yakında eklenecektir.</p>
                                            )}
                                            {productToDisplay.ean && (
                                                <p><strong>EAN:</strong> {productToDisplay.ean}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="links_Product_areas">
                                        
                                        {/* WhatsApp ve Telefon İletişim Butonları */}
                                        <div className="contact-buttons">
                                            <a 
                                                href={`https://wa.me/905393973949?text=Merhaba, ${productToDisplay.title} ürünü hakkında bilgi almak istiyorum. Ürün Kodu: ${productToDisplay.productCode} - Fiyat: ₺${productToDisplay.price.toLocaleString()}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="whatsapp-btn"
                                                onClick={() => handleWhatsAppClick(productToDisplay.id)}
                                            >
                                                <i className="fab fa-whatsapp" style={{fontSize: '18px', marginRight: '8px'}}></i>
                                                WhatsApp ile İletişim
                                            </a>
                                            <a 
                                                href="tel:+905393973949" 
                                                className="phone-btn"
                                            >
                                                <i className="fa fa-phone"></i>
                                                Telefon Et
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <RelatedProduct />
        </>
    )
}

export default ProductDetailsOne