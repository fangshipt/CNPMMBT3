import HeroBanner from '../components/home/heroBanner';
import Categories from '../components/home/categories';
import NewestProduct from '../components/home/newestProduct';
import PromotionBanner from '../components/home/promotionBanner';
import BestSelling from '../components/home/bestSeller';
import Testimonial from '../components/home/testimonial';
import ServiceSection from '../components/home/serviceSection';
import BlogSection from '../components/home/blogSection';

function HomePage() {
  return (
    <div style={{ background: '#f9f3ec' }}>
      <HeroBanner />
      <Categories />
      <NewestProduct />
      <PromotionBanner />
      <BestSelling />
      <BlogSection />
      <Testimonial />
      <ServiceSection />
    </div>
  );
}

export default HomePage;
