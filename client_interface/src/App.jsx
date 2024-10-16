import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import GaugeComponent from 'react-gauge-component';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout, DashBoardLayout, LoginLayout, HomeLayout } from './components/Layouts.jsx'

import './App.css'
import API from './API.js'

function App() {
	return(
		<BrowserRouter>
			<AppWithBrowser />
		</BrowserRouter>
	)
}

function AppWithBrowser() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const handleLogin = (credentials) => {
		const res = API.login(credentials).then(response => {
				setIsLoggedIn(true);
				setUsername(response.username);
				setIsAdmin(response.isAdmin); // Assuming the response contains isAdmin flag

				// navigate(`/${response.username}`, {state : {reloadFromServer: false}});
				return response;
			}
		).catch(err => {
			console.log(err);
		});
		return res;
	}

	useEffect(() => {
		// Simulate an API call to check if the user is logged in
		// API.checkLoginStatus().then(response => {
		// 	if (response.loggedIn) {
		// 		setIsLoggedIn(true);
		// 		setUsername(response.username);
		// 		setIsAdmin(response.isAdmin); // Assuming the response contains isAdmin flag
		// 	} else {
		// 		setIsLoggedIn(false);
		// 	}
		// });
	}, []);

	return (
		<div className="container">
		<Routes>
			<Route path="/" element={isLoggedIn ? <Navigate to={`/${username}`} /> : <Navigate to="/login" />} />
			{isLoggedIn ?
				<Route path="/:username" element={<MainLayout username={username} isAdmin={isAdmin}/>}>
					<Route path="dashboard" element={isAdmin ? <DashBoardLayout username={username} isAdmin={isAdmin}/> : <Navigate to={`/${username}`} />} />
					<Route path="personal" element={<div></div>} />
				</Route> : null
			}
			<Route path="/login" element={<LoginLayout login={handleLogin}/>} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
		</div>
	)

}

export default App
