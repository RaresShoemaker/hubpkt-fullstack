import React, { useState } from 'react';
import ChannelSubmissionForm from '../components/forms/ChannelSubmission';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubmissionTab from '../components/forms/SubmissionTab';
import CreatorsSubmissionForm from '../components/forms/CreatorsSubmission';
import SuccessSubmission from '../components/forms/SuccessSubmission';
import { cn } from '../lib/utils';

const SubmissionPage: React.FC = () => {
	const [selectedTab, setSelectedTab] = useState<'channel' | 'creator'>('channel');
	const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

	const handleChangeTab = (tab: 'channel' | 'creator') => {
		setSelectedTab(tab);
	};

	const handleFormSubmit = (value:boolean) => {
		setFormSubmitted(value);
	};

	return (
		<main className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-6 md:py-4'>
				<div className='max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 text-white'>
					{/* Header */}
					<header className='flex items-center'>
						<Link to='/' className='flex items-center gap-2 z-40'>
							<ChevronLeft className='w-6 h-6' />
							<span className={cn('md:inline', formSubmitted ? '' : 'hidden')}>Back</span>
						</Link>
						{!formSubmitted && <div className='flex-1 flex justify-center md:-ml-6 ml-0'>
							<SubmissionTab handleTabChange={handleChangeTab} selectedValue={selectedTab} />
						</div>}
					</header>
					{/* Content */}
					{!formSubmitted && (
						<div className='flex justify-center flex-col items-center text-center'>
							<h1 className='text-2xl md:text-4xl font-semibold'>Submission Form</h1>
							<p className='font-medium text-sm lg:text-xl max-w-2xl mx-auto'>
								{`To feature your platform on the ${
									selectedTab === 'channel' ? 'Packet Hub' : 'Creator Hub'
								}`}
								<br />
								{`please submit the form below.`}
							</p>
						</div>
					)}

						{formSubmitted && <SuccessSubmission resetForm={() => handleFormSubmit(false)} />}

					{/* Form */}
					{!formSubmitted && (
						<div className='w-full max-w-2xl mx-auto'>
							{selectedTab === 'channel' && <ChannelSubmissionForm handleOnSubmit={handleFormSubmit} />}
							{selectedTab === 'creator' && <CreatorsSubmissionForm handleOnSubmit={handleFormSubmit}/>}
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default SubmissionPage;
