import React, { useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { 
  HomePage, 
  SubmissionPage, 
  CreatorsHubPage, 
  AuthenticationPage, 
  DashboardPage, 
  CategoryDesignPage,
  CategoryPage // Import the new CategoryPage
} from './pages/index';
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
					{/* Submission route with its own layout */}
					<Route element={<SubmissionLayout />}>
						<Route path='/submission' element={<SubmissionPage />} />
					</Route>

					{/* Home route */}
					<Route
						path='/'
						element={<HomePage />}
					/>

					{/* Category route with slugified title */}
					<Route
						path='/category/:title'
						element={<CategoryPage />}
					/>

					{/* Authentication route */}
					<Route path='/authentication' element={<AuthenticationPage />} />
					
					{/* Protected dashboard routes */}
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

					{/* Creators Hub route */}
					<Route
						path='/creatorshub'
						element={<CreatorsHubPage />}
					/>
				</Routes>
			</Router>
		</Provider>
	);
};

export default App;