"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import HeroFilter from "@/components/HeroFilter";
import Categories from "@/components/Categories";
import PopularSearches from "@/components/PopularSearches";
import ExploreCities from "@/components/ExploreCities";
import ExploreCitiesMobile from "@/components/ExploreCitiesMobile";
import EventCategory from "@/components/event-planning/EventCategory";
import RentCategory from "@/components/rent-hire/RentCategory";

const Home: React.FC = () => {
  return (
    <div>
      {/* <SearchBar /> */}
      <HeroFilter />
      <Categories />
      <div className=" flex md:flex-row flex-col w-full ">
        {/* EventCategory takes 50% width on desktop */}
        <div className="flex-1 w-full md:w-1/2 md:p-4 ">
          <EventCategory />
        </div>
        {/* RentCategory takes 50% width on desktop */}
        <div className="flex-1 w-full md:w-1/2 md:p-4">
          <RentCategory />
        </div>
      </div>

      {/* <MiniCategories />
      <MobileCategories /> */}
      <PopularSearches />
      <ExploreCities />
      <ExploreCitiesMobile />
    </div>
  );
};

export default Home;
