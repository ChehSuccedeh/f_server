import GaugeComponent from "react-gauge-component";

import { useEffect, useState } from 'react'
import API from '../API.js'

function DashBoard() {
    const [CPU_percentage, setCPU_percentage] = useState(40);
	const [RAM_percentage, setRAM_percentage] = useState(40);
	const [Temperature, setTemperature] = useState(25);

	const getStats = async () => {
		API.getStats()
		.then((stats) => {
            // console.log(stats);
			setCPU_percentage(stats.CPU_percentage);
			setRAM_percentage(stats.RAM_percentage);
			setTemperature(stats.T)
		})
	}

    useEffect(() => {
        // Esegui getStats subito e poi ogni 10 secondi
        getStats();
        const intervalId = setInterval(getStats, 10000);
    
        // Pulisci l'intervallo quando il componente viene smontato
        return () => clearInterval(intervalId);
      }, [])

    return (
        <div 
            style={{
                display:"flex",
                justifyContent:"space-around",
                alignItems: "start",
                gap:"10px",
                width:"100%"
            }}>
            <div name="colonna1"
                style={{
                    flex: "0 0 20%",
                }}
            >
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
                <GaugeComponent
                    value={RAM_percentage}
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
                <p style={{ color: Temperature > 50 ? 'red' : Temperature > 30 ? 'white' : 'blue' }}>
                    {Temperature}°C
                </p>
            </div>
            <div name="colonna2"
                style={{
                    flex: "0 0 80%",
                }}
            >
                <h1>Dashboard e testo a caso</h1>
            </div>
        </div>
    )
}

export { DashBoard }