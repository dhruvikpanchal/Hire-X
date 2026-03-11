// import files
import Hero from "./components/Hero";
import {
  Statistics,
  PopularVacancies,
  HowItWorks,
  PopularCategories,
  FeaturedJobs,
  TopCompanies,
  Testimonials,
  CallToAction,
} from "./components/HomeSections";

const Home = () => {
  return (
    <>
      <Hero />
      <Statistics />
      <PopularVacancies />
      <HowItWorks />
      <PopularCategories />
      <FeaturedJobs />
      <TopCompanies />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;
