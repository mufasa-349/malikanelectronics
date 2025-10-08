import React, { useState } from 'react'
import { AiOutlineHeart } from 'react-icons/ai';
import { AiOutlineExpand } from 'react-icons/ai';
import { FaExchangeAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import MyVerticallyCenteredModal from '../../Common/Modal';

const ProductCard = (props) => {
    let dispatch = useDispatch();
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
    const [modalShow, setModalShow] = useState(false);
    return (
        <>
            <div className="product_wrappers_one">
                <div className="thumb">
                    <Link to={`/product-details-one/${props.data.id}`} className="image">
                        <img src={props.data.mainImage || props.data.images[0]} alt={props.data.title} />
                        <img className="hover-image" src={props.data.images[1] || props.data.mainImage || props.data.images[0]}
                            alt={props.data.title} />
                    </Link>
                    <span className="badges">
                        <span className="new">Yeni</span>
                        {props.data.inStock ? <span className="sale">Stokta</span> : <span className="hot">Tükendi</span>}
                    </span>
                    <div className="actions">
                        <a href="#!" className="action wishlist" title="Wishlist" onClick={() => addToFav(props.data.id)}><AiOutlineHeart /></a>
                        <a href="#!" className="action quickview" title="Quick view" onClick={() => setModalShow(true)}><AiOutlineExpand /></a>
                        <a href="#!" className="action compare" title="Compare" onClick={() => addToComp(props.data.id)}><FaExchangeAlt /></a>
                    </div>
                    <div className="product-actions">
                            <a 
                                href={`https://wa.me/905393973949?text=Merhaba, ${props.data.title} ürünü hakkında bilgi almak istiyorum. Ürün Kodu: ${props.data.productCode} - Fiyat: ₺${props.data.price.toLocaleString()}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="whatsapp-btn-small"
                                title="WhatsApp ile İletişim"
                            >
                                <i className="fab fa-whatsapp" style={{fontSize: '16px', marginRight: '6px'}}></i>
                            </a>
                            <a 
                                href="tel:+905393973949" 
                                className="phone-btn-small"
                                title="Telefon Et"
                            >
                                <i className="fa fa-phone"></i>
                            </a>
                    </div>
                </div>
                <div className="content">
                    <h5 className="title">
                        <Link to={`/product-details-one/${props.data.id}`}>{props.data.title}</Link>
                    </h5>
                                    <div className="brand-info">
                                        <small className="text-muted">{props.data.brand}</small>
                                    </div>
                                    <div className="product-code-info">
                                        <small className="text-muted">Kod: <strong>{props.data.productCode}</strong></small>
                                    </div>
                    <div className="rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa fa-star ${i < Math.floor(props.data.rating) ? 'text-warning' : 'text-muted'}`}></i>
                            ))}
                        </div>
                        <small className="text-muted">({props.data.reviewCount})</small>
                    </div>
                    <span className="price">
                        <span className="new">₺{props.data.price.toLocaleString()}</span>
                        {props.data.originalPrice && (
                            <span className="old">${props.data.originalPrice}</span>
                        )}
                    </span>
                </div>
            </div>

            <MyVerticallyCenteredModal data={props.data} show={modalShow} onHide={() => setModalShow(false)} />
        </>
    )
}

export default ProductCard