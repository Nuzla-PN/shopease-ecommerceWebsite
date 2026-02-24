import { Link } from "react-router-dom";
import HeroImage from "../../assets/HeroImage.jpg";


const HeroSection = ()=>{
    return(
        <section className="relative h-[70vh] w-full">
            <img 
                src={HeroImage}
                alt="heroBanner"
                className="absolute inset-0 w-full h-full object-cover"
                />

                
                <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z=10 h-full flex items-center justify-center px-4">
                <div className="text-center text-white max-w-4xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                        Shop Smart.Buy Better.
                    </h1>
                    <p className="text-sm md:text-lg mb-10 text-gray-200">
                        Discover amazing products at unbeatable prices. Quality you can trust, delivered to your door.
                    </p>

                    <button 
                    onClick={()=>{
                        const el= document.getElementById("products");
                        if(el){
                            el.scrollIntoView({behavior:"smooth"});
                        }
                    }}
                        className="inline-block bg-white md:font-bold hover:bg-gray-300 text-black px-6 py-3 rounded-lg font-medium transition">                    
                        Shop Now
                    </button>
                </div>
            </div>     
        </section>
    );

};

export default HeroSection;