import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import GaugeComponent from 'react-gauge-component';

import './App.css'
import API from './API.js'

function App() {

	const [CPU_percentage, setCPU_percentage] = useState(40);
	const [RAM_percentage, setRAM_percentage] = useState(40);
	const [Temperature, setTemperature] = useState(25);

	const getStats = async () => {
		API.getStats()
		.then((stats) => {
			setCPU_percentage(stats.CPU_percentage);
			setRAM_percentage(stats.RAM_percentage);
			setTemperature(stats.T)
		})
	}

	useEffect(()=>{
		getStats();	
	}, []);

	return (
		<GaugeComponent
			value={CPU_percentage}
			type="radial"
			labels={{
				tickLabels: {
					type: "inner",
					ticks: [
						{ value: 20 },
						{ value: 40 },
						{ value: 60 },
						{ value: 80 },
						{ value: 100 }
					]
				}
			}}
			arc={{
				colorArray: ['#5BE12C', '#EA4228'],
				subArcs: [{ limit: 40 }, { limit: 60 }, {}, {}, {}],
				padding: 0.02,
				width: 0.3
			}}
			pointer={{
				elastic: true,
				animationDelay: 0
			}}
		/>
	)
}

export default App
