import React from 'react'
import Banner from '../component/BabyToys/Banner'
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
            <Banner />
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