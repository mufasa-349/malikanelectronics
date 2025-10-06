import React from 'react'
import BabyHeading from '../Heading'
import { Link } from 'react-router-dom'
import { getMainCategories } from '../../../app/data/categoriesData'

const Category = () => {
    const categories = getMainCategories()
    
    return (
        <>
            <section id="baby_shop_categories" className="pb-100">
                <div className="container">
                    <BabyHeading heading="Kategoriler" />
                    <div className="row">
                        {categories.map((category, index) => (
                            <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={category.id}>
                                <div className="baby_category_card">
                                    <Link to={`/shop?category=${category.slug}`}>
                                        <div className="baby_cat_img">
                                            <img src={category.img} alt={category.name} />
                                        </div>
                                        <div className="baby_cat_content">
                                            <h5>{category.name}</h5>
                                            <p>{category.itemCount} Ürün</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Category