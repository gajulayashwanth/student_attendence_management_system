import React from 'react';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import HowItWorks from '../../components/landing/HowItWorks';
import Footer from '../../components/common/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
