import HeroBanner from '../components/home/heroBanner';
import Categories from '../components/home/categories';
import SaleSection from '../components/home/saleSection';
import NewestProduct from '../components/home/newestProduct';
import PromotionBanner from '../components/home/promotionBanner';
import BestSelling from '../components/home/bestSeller';
import Testimonial from '../components/home/testimonial';
import ServiceSection from '../components/home/serviceSection';
import InstagramSection from '../components/home/instagramSection';
import BlogSection from '../components/home/blogSection';

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
