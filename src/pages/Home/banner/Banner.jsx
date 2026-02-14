import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.jpg";
import banner3 from "../../../assets/banner1.jpg";

const Banner = () => {
  return (
    <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      interval={3000}
      transitionTime={800}
      dynamicHeight={true}
    >
      <div>
        <img src={banner1} alt="Exclusive Offer 1" />
      </div>
      <div>
        <img src={banner2} alt="Exclusive Offer 2" />
      </div>
      <div>
        <img src={banner3} alt="Exclusive Offer 3" />
      </div>
    </Carousel>
  );
};

export default Banner;
