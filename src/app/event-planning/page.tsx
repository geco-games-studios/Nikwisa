import Categories from "@/components/event-planning/Categories";
import ForBride from "@/components/event-planning/ForBride";
import ForGroom from "@/components/event-planning/ForGroom";
import HoneymoonAdd from "@/components/event-planning/HoneyMoonAdd";
import HairAdd from "@/components/event-planning/HairAdd";
import PhotographyAd from "@/components/event-planning/PhotographyAdd";
import TheBigDay from "@/components/event-planning/TheBigDay";
import PreEvent from "@/components/event-planning/PreEvent";
// import { useNavigate } from "react-router-dom";

const page = () => {
  // const navigate = useNavigate();

  return (
    <div>
      <Categories />
      <ForBride />
      <HairAdd />
      <ForGroom />
      <HoneymoonAdd />
      <PreEvent />
      <PhotographyAd />
      <TheBigDay />
    </div>
  );
};

export default page;
