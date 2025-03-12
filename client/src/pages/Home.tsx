import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';

const HomePage: React.FC = () => {
	return (
		<MainLayout 
			menu={<MenuCategory />}
			heroContainer={
				<div className='bg-red-500 w-full h-full'>
					<h1>Hero Container</h1>
				</div>
			}
			background={
				<div className='bg-blue-700 w-full h-full'>
					{/* You can put any background content here */}
					{/* This could be an image, gradient, or any other component */}
				</div>
			}
		>
			<div className='w-full h-full'>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
				<h1>Main Content</h1>
			</div>
		</MainLayout>
	);
};

export default HomePage;