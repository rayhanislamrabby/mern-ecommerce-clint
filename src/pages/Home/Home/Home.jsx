import Accessories from "../accessories/Accessories";
import Banner from "../banner/Banner";
import HomeSlider from "../HomeSlider/HomeSlider";
import TopProducts from "../topcallection/TopProducts";


const Home = () => {
    return (
        <div>
        <Banner></Banner>
        <HomeSlider></HomeSlider>
        <TopProducts></TopProducts>
        <Accessories></Accessories>
        </div>
    );
};

export default Home;