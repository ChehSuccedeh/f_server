import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import GaugeComponent from 'react-gauge-component';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashBoard } from './components/DashBoard'

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



	// useEffect(()=>{
	// 	getStats();	
	// }, []);

	return (
		<Routes>
			<Route path="/" element={<DashBoard />} />
		</Routes>
	)

}

export default App
