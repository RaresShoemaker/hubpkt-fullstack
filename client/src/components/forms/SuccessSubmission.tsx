import React from 'react';
import { CheckCircleIcon } from '../../assets/icons/index';

interface SuccessSubmissionProps {
	resetForm: () => void;
}

const SuccessSubmission: React.FC<SuccessSubmissionProps> = ({ resetForm }) => {
	return (
		<div className='w-full h-full min-h-[80vh] flex flex-col gap-6 items-center justify-center'>
			<div className='flex w-full justify-center items-center'>
				<CheckCircleIcon className='w-16 h-16 md:w-20 md:h-20 text-green-500' />
			</div>
			<div className='text-center items-center flex flex-col gap-4'>
				<h1 className='text-3xl md:text-5xl font-semibold'>Thank you for your submission</h1>
				<p className='text-lg md:text-2xl'>You must click the link in your email to confirm</p>
				<p className='md:max-w-[60%] max-w-[76%]'>
					Your submission is now being processed. It can take 3-5 business days for your content to be added.
				</p>
			</div>
			<div className='w-full md:max-w-[480px] max-w-[350px]'>
				<button
					onClick={resetForm}
					className='text-primary rounded-full bg-white w-full uppercase py-3 text-center font-semibold'
				>
					New Submission
				</button>
			</div>
		</div>
	);
};

export default SuccessSubmission;
