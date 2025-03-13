import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import ToasterBannerProvider from '../context/ToasterBannerContext/ToasterBannerProvider';
import ToasterBanner from '../components/ToasterBanner/ToasterBannerCard';

const SubmissionLayout: React.FC = () => {
	return (
		<div className='flex flex-col relative bg-blue-700 '>
			<ToasterBannerProvider>
				<main className='flex-grow relative min-h-dvh md:min-h-screen mx-6 md:mx-20 lg:mx-28 2xl:mx-40 mb-10'>
					<ToasterBanner />
					<Outlet />
				</main>
				<Footer />
			</ToasterBannerProvider>
		</div>
	);
};

export default SubmissionLayout;
