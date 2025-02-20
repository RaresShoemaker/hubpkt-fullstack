import React, { useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage, SubmissionPage, CreatorsHubPage, AuthenticationPage, DashboardPage } from './pages/index';
import PageLayout from './layouts/PageLayout';
import { TransitionAnimationProvider } from './context/TransitionAnimationContext/TransitionAnimationProvider';
import AnalyticsTracker from './components/AnalyticsTracker';
import { ThemeProvider } from './components/Admin/Theme/ThemeProvider';

const App: React.FC = () => {
	const TRACKING_ID = useMemo(() => import.meta.env.VITE_TRACKING_ID_GA, []);

	useEffect(() => {
		ReactGA.initialize(TRACKING_ID);
	}, [TRACKING_ID]);

	return (
		<Provider store={store}>
				<Router>
					<AnalyticsTracker />
					<Routes>
						<Route element={<PageLayout />}>
							{/* Protected route that requires authentication */}
							<Route path='/submission' element={<SubmissionPage />} />
						</Route>

						<Route
							path='/'
							element={
								<TransitionAnimationProvider>
									<HomePage />
								</TransitionAnimationProvider>
							}
						/>

						<Route path='/authentication' element={<AuthenticationPage />} />
						<Route
							path='/dashboard/*'
							element={
								<ProtectedRoute>
									<ThemeProvider>
										<DashboardPage />
									</ThemeProvider>
								</ProtectedRoute>
							}
						/>

						{/* Another protected route example */}
						<Route
							path='/creatorhub'
							element={
								<TransitionAnimationProvider>
									<CreatorsHubPage />
								</TransitionAnimationProvider>
							}
						/>
					</Routes>
				</Router>
		</Provider>
	);
};

export default App;
