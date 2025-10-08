import React, { useState, useEffect } from 'react'

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    
    // Placeholder banner resimleri - local placeholder kullan
    const slides = [
        {
            id: 1,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA3YmZmIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgMTwvdGV4dD4KPC9zdmc+',
            title: 'Elektronik Ürünlerde Büyük İndirim',
            subtitle: 'En kaliteli ürünler, en uygun fiyatlarla',
            buttonText: 'Alışverişe Başla',
            buttonLink: '/shop'
        },
        {
            id: 2,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjhhNzQ1Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgMjwvdGV4dD4KPC9zdmc+',
            title: 'Yeni Gelen Ürünler',
            subtitle: 'Son teknoloji ürünleri keşfedin',
            buttonText: 'Keşfet',
            buttonLink: '/shop'
        },
        {
            id: 3,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZGMzNTQ1Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgMzwvdGV4dD4KPC9zdmc+',
            title: 'Kampanya Fırsatları',
            subtitle: 'Sınırlı süreli özel fiyatlar',
            buttonText: 'Fırsatları Gör',
            buttonLink: '/shop'
        },
        {
            id: 4,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmZjMTA3Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgNDwvdGV4dD4KPC9zdmc+',
            title: 'Premium Kalite',
            subtitle: 'Sadece en iyi markalar',
            buttonText: 'İncele',
            buttonLink: '/shop'
        },
        {
            id: 5,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNmY0MmM1Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgNTwvdGV4dD4KPC9zdmc+',
            title: 'Hızlı Teslimat',
            subtitle: 'Aynı gün kargo imkanı',
            buttonText: 'Sipariş Ver',
            buttonLink: '/shop'
        }
    ]

    // Otomatik slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000) // 5 saniyede bir değişir

        return () => clearInterval(timer)
    }, [slides.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    return (
        <section className="hero-slider">
            <div className="slider-container">
                <div className="slider-wrapper">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="slide-content">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="slide-text">
                                                <h1 className="slide-title">{slide.title}</h1>
                                                <p className="slide-subtitle">{slide.subtitle}</p>
                                                <a href={slide.buttonLink} className="btn btn-primary btn-lg">
                                                    {slide.buttonText}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation arrows */}
                <button className="slider-nav prev" onClick={goToPrevious}>
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button className="slider-nav next" onClick={goToNext}>
                    <i className="fa fa-chevron-right"></i>
                </button>

                {/* Dots indicator */}
                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Slider
