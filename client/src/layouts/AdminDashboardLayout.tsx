import React from 'react';
import { useTheme } from '../store/features/ui/useUITheme';
import Navigation from '../components/Admin/Navigation/Navbar';
import DashboardContent from '../components/Admin/Content/Dashboard/DashboardContent';

const AdminDashboardLayout: React.FC = () => {
	const { isDark } = useTheme();

	return (
		<div
			className={`h-full min-h-screen flex gap-6 p-8 transition-colors duration-300
      ${
				isDark ? 'bg-dark-background text-dark-text-primary' : 'bg-light-background text-light-text-primary'
			}`}
		>
			<Navigation />
			<DashboardContent />
		</div>
	);
};

export default AdminDashboardLayout;
