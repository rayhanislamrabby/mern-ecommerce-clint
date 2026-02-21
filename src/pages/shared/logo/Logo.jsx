
import logoImg from "../../../assets/Shop-Zone.png"; 

const Logo = () => {
  return (
    <div className="flex items-center">
      <img 
        src={logoImg} 
        alt="ShopZone Logo" 
       className="h-15 md:h-20  rounded-4xl lg:h-26 w-auto object-contain"
      />
    </div>
  );
};

export default Logo;