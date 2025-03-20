import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BlurTransition from '../components/BlurTransition';

const HomePage: React.FC = () => {
	return (
		<MainLayout
			menu={<MenuCategory />}
			heroContainer={
				<Hero image=''>
				
				</Hero>}
			background={
				<div className='bg-gradient-to-br bg-[#090D23] w-full h-full'>
					{/* Main background for the entire page */}
				</div>
			}
			backgroundTransition={<BlurTransition color='#090D23' blur={40} className='bottom-0 h-[230px]' />}
		>
			<div className='w-full p-6 md:p-8 lg:p-12 -mt-10'>
				<h2 className='text-3xl text-white font-bold mb-8'>Featured Content Creators</h2>
				{/* Rest of your main content here */}
			</div>
		</MainLayout>
	);
};

export default HomePage;
