import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import HeroContainer from '../components/Hero/HeroContainer';
import HeroGridItem from '../components/Hero/HeroGridItem';
import HeroImage from '../components/Hero/HeroImage';
import BlurTransition from '../components/BlurTransition';

const HomePage: React.FC = () => {
  return (
    <MainLayout
      menu={<MenuCategory />}
      heroContainer={
        <HeroContainer
          columns={12}
          rows={6}
          gapX={16}
          gapY={12}
          padding={{ x: 16, y: 16 }}
          gridClassName="p-4 md:p-8 lg:p-12" // Responsive padding through classes
          background={
            <HeroImage 
              src="./Home1.jpg" 
              alt="Creator showcase" 
              overlay={true}
              overlayOpacity={0}
            />
          }
        > 
          <HeroGridItem 
            gridClasses="col-start-4 col-span-2 col-end-6 row-start-4 row-span-2 row-end-6"
						align="center"
          >
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-purple-600 transition duration-300 w-full">
              Learn More
            </button>
          </HeroGridItem>
        </HeroContainer>
      }
      background={
        <div className="bg-gradient-to-br bg-[#090D23] w-full h-full">
          {/* Main background for the entire page */}
        </div>
      }
			backgroundTransition={
				<BlurTransition 
				color="#090D23"
				blur={40}
				className="bottom-0 h-[230px]" 
			/>
			}
    >
      <div className="w-full p-6 md:p-8 lg:p-12 -mt-10">
        <h2 className="text-3xl text-white font-bold mb-8">Featured Content Creators</h2>
        {/* Rest of your main content here */}
      </div>
    </MainLayout>
  );
};

export default HomePage;