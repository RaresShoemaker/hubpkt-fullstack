import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BackgroundTransition from '../components/BackgroundTransition';
import BlurTransition from '../components/BlurTransition';

import { useCards } from '../store/features/cards/useCards';
import { useCategories } from '../store/features/categories/useCategories';

const CreatorsHub: React.FC = () => {

	const { creatorsCards, handleFetchCreatorsCards } = useCards();
	const { clientCategory } = useCategories();

	useEffect(() => {
		const fetchData = () => {
			if(clientCategory) {
				handleFetchCreatorsCards(clientCategory.id);
			}
		}

		fetchData();
	}, [clientCategory, handleFetchCreatorsCards]);

	console.log(clientCategory);

	return (
			<MainLayout
				menu={<MenuCategory />}
				heroContainer={<Hero image='./Home1.jpg'></Hero>}
				background={<BackgroundTransition backgroundGradient='#090D23' />}
				backgroundTransition={<BlurTransition color='#090D23' blur={40} className='bottom-0 h-[230px]' />}
			>
				<div className='w-full p-6 md:p-8 lg:p-12 -mt-10'>

				</div>
			</MainLayout>
	);
};

export default CreatorsHub;
