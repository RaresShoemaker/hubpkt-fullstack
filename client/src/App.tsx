import React, { useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage, SubmissionPage, CreatorsHubPage, AuthenticationPage, DashboardPage, CategoryDesignPage } from './pages/index';
import SubmissionLayout from './layouts/SubmissionLayout';
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
						<Route element={<SubmissionLayout />}>
							<Route path='/submission' element={<SubmissionPage />} />
						</Route>

						<Route
							path='/'
							element={
									<HomePage />
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

						{/* Preview route */}
						<Route
							path='/categorydesign/:id'
							element={
								<ProtectedRoute>
									<ThemeProvider>
										<CategoryDesignPage />
									</ThemeProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path='/creatorshub'
							element={
									<CreatorsHubPage />
							}
						/>
					</Routes>
				</Router>
		</Provider>
	);
};

export default App;