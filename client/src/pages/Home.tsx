import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryOverviewLayout from '../layouts/CategoryOverviewLayout';
import CategoryContainer from '../components/Category/CategoryContainer';
import { CategoryData } from '../mockdata/CategoryMockData';
import SEO from '../components/SEO';
import PachetHubLogo from '../assets/PacketaShareLink.png';
import PktHubLogoStacked from '../assets/PktHubLogoStacked.png';
import { useCards } from '../store/features/cards/useCards';

const Home: React.FC = () => {
	const [searchParams] = useSearchParams();
	const category = React.useMemo(() => searchParams.get('category'), [searchParams]);
	const { handleFetchHomeCards } = useCards()

	useEffect(() => {
		const getHomeCards = async () => {
			await handleFetchHomeCards()
		}
		getHomeCards()
	}
	, [handleFetchHomeCards])


	const categoryData = React.useMemo(() => {
		if (category && CategoryData[category]) {
			return CategoryData[category];
		}
		return null;
	}, [category]);

	if (categoryData && !categoryData.squareView) {
		return (
			<>
				<SEO
					title='Packet Hub'
					description='Packet Hub'
					keywords='Packet Hub'
					url='https://hub.pkt.cash/'
					imgSrc={PktHubLogoStacked}
				/>
				<CategoryOverviewLayout>
					<CategoryContainer title={categoryData.title} cards={categoryData.data} isFullPage={true} />
				</CategoryOverviewLayout>
			</>
		);
	}

	return (
		<>
			<SEO
				title='Packet Hub'
				description='Packet Hub'
				keywords='Packet Hub'
				url='https://hub.pkt.cash/'
				imgSrc={PachetHubLogo}
			/>
			<CategoryOverviewLayout>
				<div className='flex flex-col gap-8'>
					{Object.entries(CategoryData).map(([key, categoryInfo]) => (
						<CategoryContainer
							key={key}
							title={categoryInfo.title}
							cards={categoryInfo.data}
							isFullPage={false}
							isViewOnly={categoryInfo.isViewOnly}
							squareView={categoryInfo.squareView}
						/>
					))}
				</div>
			</CategoryOverviewLayout>
		</>
	);
};

export default Home;
