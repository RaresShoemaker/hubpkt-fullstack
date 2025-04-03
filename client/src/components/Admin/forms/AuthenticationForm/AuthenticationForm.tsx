import React from 'react';
import { emailValidator, nameValidator, passwordValidator } from '../validations/auth.validation';
import CustomInput from '../../Input';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import useAuthenticationForm from './useAuthForm';

const AuthenticationForm: React.FC = () => {
	const { state, dispatch, handleSubmit, confirmPasswordValidator } = useAuthenticationForm();

	return (
		<div className='w-full max-w-md mx-auto p-6'>
			<TabGroup
				onChange={(index) =>
					dispatch({
						type: 'SET_FORM_LAYOUT',
						payload: index === 0 ? 'login' : 'register'
					})
				}
			>
				<TabList className='flex space-x-1 rounded-xl bg-white/10 p-1 '>
					<Tab
						className={({ selected }) =>
							clsx(
								'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
								'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
								selected ? 'bg-white text-blue-900 shadow' : 'text-white hover:bg-white/[0.12]'
							)
						}
					>
						Login
					</Tab>
					<Tab
						className={({ selected }) =>
							clsx(
								'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
								'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
								selected ? 'bg-white text-blue-900 shadow' : 'text-white hover:bg-white/[0.12]'
							)
						}
					>
						Register
					</Tab>
				</TabList>

				<TabPanels className='mt-6'>
					<TabPanel>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<CustomInput
								label='Email'
								value={state.email}
								onChange={(value) => dispatch({ type: 'SET_EMAIL', payload: value })}
								onValidationChange={(isValid) => dispatch({ type: 'SET_EMAIL_VALIDITY', payload: isValid })}
								required
								validator={emailValidator}
							/>

							<CustomInput
								label='Password'
								value={state.password}
								onChange={(value) => dispatch({ type: 'SET_PASSWORD', payload: value })}
								onValidationChange={(isValid) =>
									dispatch({ type: 'SET_PASSWORD_VALIDITY', payload: isValid })
								}
								required
								type='password'
							/>

							<div className='w-full flex justify-center'>
								<button
									type='submit'
									className={clsx(
										'w-44 rounded-lg px-4 py-2 text-sm font-medium',
										state.isValidEmail && state.isValidPassword
											? 'bg-blue-500 text-white hover:bg-blue-600'
											: 'bg-blue-500/50 text-white/50 cursor-not-allowed'
									)}
									disabled={!state.isValidEmail || !state.isValidPassword}
								>
									Login
								</button>
							</div>
						</form>
					</TabPanel>

					<TabPanel>
						<form onSubmit={handleSubmit} className='space-y-6'>
            <CustomInput
								label='Name'
								value={state.name}
								onChange={(value) => dispatch({ type: 'SET_NAME', payload: value })}
								required
								validator={nameValidator}
							/>

							<CustomInput
								label='Email'
								value={state.email}
								onChange={(value) => dispatch({ type: 'SET_EMAIL', payload: value })}
								onValidationChange={(isValid) => dispatch({ type: 'SET_EMAIL_VALIDITY', payload: isValid })}
								required
								validator={emailValidator}
							/>

							<CustomInput
								label='Password'
								value={state.password}
								onChange={(value) => dispatch({ type: 'SET_PASSWORD', payload: value })}
								onValidationChange={(isValid) =>
									dispatch({ type: 'SET_PASSWORD_VALIDITY', payload: isValid })
								}
								required
								type='password'
								validator={passwordValidator}
							/>

							<CustomInput
								label='Confirm Password'
								value={state.confirmPassword}
								onChange={(value) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: value })}
								onValidationChange={(isValid) =>
									dispatch({
										type: 'SET_CONFIRM_PASSWORD_VALIDITY',
										payload: isValid
									})
								}
								required
								type='password'
								validator={confirmPasswordValidator}
							/>

							<div className='w-full flex justify-center'>
								<button
									type='submit'
									className={clsx(
										'w-44 rounded-lg px-4 py-2 text-sm font-medium',
										state.isValidEmail &&
											state.isValidPassword &&
											state.isValidConfirmPassword &&
											state.password === state.confirmPassword
											? 'bg-blue-500 text-white hover:bg-blue-600'
											: 'bg-blue-500/50 text-white/50 cursor-not-allowed'
									)}
									disabled={
										!state.isValidEmail ||
										!state.isValidPassword ||
										!state.isValidConfirmPassword ||
										state.password !== state.confirmPassword
									}
								>
									Register
								</button>
							</div>
						</form>

						<div style={{position: 'fixed', bottom: 0, left: 0, background: '#eee', padding: '5px', fontSize: '12px'}}>
  API Base URL: {import.meta.env.VITE_API_BASE_URL || "Not directly accessible"}
	API Key Test: {import.meta.env.VITE_API_KEY || "Not directly accessible"}
</div>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	);
};

export default AuthenticationForm;
