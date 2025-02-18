import React from 'react';
import CategoryOverviewLayout from '../layouts/CategoryOverviewLayout';
import SEO from '../components/SEO';
import NewsContainer from '../components/News/NewsContainer';

const NewsHubPage: React.FC = () => {

	return (
		<>
			<SEO
				title='News Hub'
				description='News Hub'
				keywords='News Hub'
				url='https://hub.pkt.cash/newshub'
			/>
			<CategoryOverviewLayout>
				<div className='flex flex-col gap-8'>
					<NewsContainer />
				</div>
			</CategoryOverviewLayout>
		</>
	);
};

export default NewsHubPage;
