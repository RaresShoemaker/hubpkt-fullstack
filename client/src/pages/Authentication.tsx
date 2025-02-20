import React from 'react';
import AuthenticationLayout from '../layouts/AuthenticationLayout';

const AuthenticationPage: React.FC = () => {
	return (
		<div className='h-screen w-screen bg-gray-700 flex justify-center items-center'>
			<div className='h-3/4 w-3/4'>
				<AuthenticationLayout />
			</div>
		</div>
	);
};

export default AuthenticationPage;
