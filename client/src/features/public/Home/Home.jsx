// import files
import Hero from "./components/Hero";
import {
  Statistics,
  PopularVacancies,
  HowItWorks,
  FeaturedJobs,
  Testimonials,
} from "./components/HomeSections";

const Home = () => {
  return (
    <>
      <Hero />
      <Statistics />
      <PopularVacancies />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
    </>
  );
};

export default Home;
