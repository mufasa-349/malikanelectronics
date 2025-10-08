import React from 'react'
import Slider from '../component/Common/Slider'
import Category from '../component/BabyToys/Category'
import TrendingProducts from '../component/BabyToys/TrendingProducts'
import TopProducts from '../component/BabyToys/TopProducts'
import BannerBottom from '../component/BabyToys/BannerBottom'
import Instagram from '../component/BabyToys/instagram'
import Footer from '../component/Common/Footer'
import Header from '../component/Common/Header'

const Home = () => {
    return (
        <>
            <Header />
            <Slider />
            <Category />
            <TrendingProducts />
            <TopProducts />
            <BannerBottom />
            <Instagram />
            <Footer />
        </>
    )
}

export default Home