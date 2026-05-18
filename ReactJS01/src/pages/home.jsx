import HeroBanner from '../components/home/herobanner';
import Categories from '../components/home/categories';
import SaleSection from '../components/home/salesection';
import NewestProduct from '../components/home/newestproduct';
import PromotionBanner from '../components/home/promotionbanner';
import BestSelling from '../components/home/bestseller';
import Testimonial from '../components/home/testimonial';
import ServiceSection from '../components/home/servicesection';
import InstagramSection from '../components/home/instagramsection';
import BlogSection from '../components/home/blogsection';

function HomePage() {
  return (
    <>
      <HeroBanner />
      <Categories />
      <SaleSection />
      <NewestProduct />
      <PromotionBanner />
      <BestSelling />
      <Testimonial />
      <BlogSection />
      <ServiceSection />
      <InstagramSection />
    </>
  );
}

export default HomePage;
