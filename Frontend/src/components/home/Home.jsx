import { useState } from "react";
import CategorySection from "../../pages/public/CategorySection.jsx";
import HeroSection from "../../pages/public/HeroSection.jsx";


const Home = () => {
   const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <>
    
      <HeroSection />
      <div className= "pt-24 max-w-7xl mx-auto px-4">
        <CategorySection
          selectedCategory={selectedCategory}
          setSelectedCategory = {setSelectedCategory}
        />
        {/* <ProductSection selectedCategory={selectedCategory}/> */}
      </div> 
    </>
  );
};

export default Home;