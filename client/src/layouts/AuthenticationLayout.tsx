import React from 'react';
import AuthenticationForm from '../components/Admin/forms/AuthenticationForm/AuthenticationForm';

const AuthenticationLayout: React.FC = () => {
	return (
		<div className='flex h-full w-full'>
			<div className='h-full w-1/2 rounded-l-2xl'>
				<img  
					src='./Home1-mobile.jpg'
					className='h-full w-full object-cover rounded-l-2xl'
				/>
			</div>
			<div className='h-full w-1/2 bg-gray-900 rounded-r-2xl'>
				<AuthenticationForm />
			</div>
		</div>
	);
};

export default AuthenticationLayout;
