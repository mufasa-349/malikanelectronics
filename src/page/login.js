import React from 'react'
import Header from '../component/Common/Header'
import Banner from '../component/Common/Banner'
import Footer from '../component/Common/Footer'

const Contact = () => {
    return (
        <>
            <Header />
            <Banner title="İletişim" />
            <section className="ptb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                            <div className="contact-info text-center">
                                <h2>Malikanelectronics ile İletişime Geçin</h2>
                                <p className="lead">Ürünlerimiz hakkında bilgi almak veya sipariş vermek için bizimle iletişime geçebilirsiniz.</p>
                                
                                <div className="contact-methods">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="contact-card">
                                                <div className="contact-icon">
                                                    <i className="fab fa-whatsapp"></i>
                                                </div>
                                                <h4>WhatsApp</h4>
                                                <p>Hızlı yanıt için WhatsApp'tan mesaj gönderin</p>
                                                <a 
                                                    href="https://wa.me/905551234567?text=Merhaba, ürünleriniz hakkında bilgi almak istiyorum." 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="whatsapp-btn"
                                                >
                                                    <i className="fab fa-whatsapp"></i>
                                                    WhatsApp ile İletişim
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="contact-card">
                                                <div className="contact-icon">
                                                    <i className="fa fa-phone"></i>
                                                </div>
                                                <h4>Telefon</h4>
                                                <p>Doğrudan arayarak bizimle konuşun</p>
                                                <a 
                                                    href="tel:+905551234567" 
                                                    className="phone-btn"
                                                >
                                                    <i className="fa fa-phone"></i>
                                                    +90 555 123 45 67
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="business-info mt-5">
                                    <h3>İş Saatleri</h3>
                                    <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                                    <p>Cumartesi: 09:00 - 16:00</p>
                                    <p>Pazar: Kapalı</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Contact