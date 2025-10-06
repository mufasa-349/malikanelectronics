import React, { useState, useEffect } from 'react'
import ProductInfo from './ProductInfo'
import RelatedProduct from './RelatedProduct'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { RatingStar } from "rating-star";
import Swal from 'sweetalert2';
import { getProductById } from '../../../app/data/productsData';

const ProductDetailsOne = () => {
    let dispatch = useDispatch();
    let { id } = useParams();
    
    // Gerçek ürün verilerini al
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const productData = getProductById(id);
        if (productData) {
            setProduct(productData);
            // Redux store'u da güncelle
            dispatch({ type: "products/getProductById", payload: { id } });
        }
        setLoading(false);
    }, [id, dispatch]);

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

    // Color swatch fonksiyonu kaldırıldı - sadece ana görsel kullanıyoruz

    const [count, setCount] = useState(1)

    const [img, setImg] = useState(product?.images?.[0] || '')

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

    if (!product) {
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

    return (
        <>
            <section id="product_single_one" className="ptb-100">
                <div className="container">
                    <div className="row area_boxed">
                        <div className="col-lg-4">
                            <div className="product-image-container">
                                <div className="main-product-image">
                                    <img src={img} alt={product.title} className="main-image" />
                                </div>
                                
                                {/* Thumbnail Galerisi */}
                                <div className="product-gallery mt-4">
                                    <h6 className="gallery-title">Ürün Görselleri</h6>
                                    <div className="gallery-thumbnails">
                                        {product.images.map((image, index) => (
                                            <div 
                                                key={index} 
                                                className={`thumbnail-item ${img === image ? 'active' : ''}`}
                                                onClick={() => setImg(image)}
                                            >
                                                <img 
                                                    src={image} 
                                                    alt={`${product.title} ${index + 1}`}
                                                    className="thumbnail-image"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="product_details_right_one">
                                <div className="modal_product_content_one">
                                    <h3>{product.title}</h3>
                                    <div className="brand-info mb-2">
                                        <small className="text-muted">Marka: {product.brand}</small>
                                    </div>
                                <div className="reviews_rating">
                                    <RatingStar maxScore={5} rating={product.rating} id="rating-star-common" />
                                    <span>({product.reviewCount} Müşteri Yorumu)</span>
                                </div>
                                <div className="price-section">
                                    <h4 className="current-price">₺{product.price.toLocaleString()}</h4>
                                    <span className="original-price">Orijinal: ${product.originalPrice}</span>
                                </div>
                                
                                {/* WhatsApp ve Telefon İletişim Butonları - Fiyatın hemen altında */}
                                <div className="contact-buttons-price">
                                    <a 
                                        href={`https://wa.me/905551234567?text=Merhaba, ${product.title} ürünü hakkında bilgi almak istiyorum. Fiyat: ₺${product.price.toLocaleString()}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="whatsapp-btn-price"
                                    >
                                        <i className="fab fa-whatsapp"></i>
                                        WhatsApp ile İletişim
                                    </a>
                                    <a 
                                        href="tel:+905551234567" 
                                        className="phone-btn-price"
                                    >
                                        <i className="fa fa-phone"></i>
                                        Telefon Et
                                    </a>
                                </div>
                                    <div className="customs_selects">
                                        <select name="product" className="customs_sel_box">
                                            <option value="volvo">Size</option>
                                            <option value="xl">XL</option>
                                            <option value="small">S</option>
                                            <option value="medium">M</option>
                                            <option value="learz">L</option>
                                        </select>
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
                                            <p>{product.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="links_Product_areas">
                                        <ul>
                                            <li>
                                                <a href="#!" className="action wishlist" title="Wishlist" onClick={() => addToFav(product.id)}><i
                                                    className="fa fa-heart"></i>Favorilere Ekle</a>
                                            </li>
                                            <li>
                                                <a href="#!" className="action compare" onClick={() => addToComp(product.id)} title="Compare"><i
                                                    className="fa fa-exchange"></i>Karşılaştır</a>
                                            </li>
                                        </ul>
                                        
                                        {/* WhatsApp ve Telefon İletişim Butonları */}
                                        <div className="contact-buttons">
                                            <a 
                                                href={`https://wa.me/905551234567?text=Merhaba, ${product.title} ürünü hakkında bilgi almak istiyorum.`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="whatsapp-btn"
                                            >
                                                <i className="fab fa-whatsapp"></i>
                                                WhatsApp ile İletişim
                                            </a>
                                            <a 
                                                href="tel:+905551234567" 
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
                    <ProductInfo />
                </div>
            </section>
            <RelatedProduct />
        </>
    )
}

export default ProductDetailsOne