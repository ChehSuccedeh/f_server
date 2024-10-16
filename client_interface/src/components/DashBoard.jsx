import { GaugeChart, GaugeChartVariant } from "@fluentui/react-charting";
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import TempIcon from './../assets/thermometer.svg?react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from 'react';
import API from '../API.js';

function GaugeComponent(props) {

    return (
        <GaugeChart
            className="gauge"
            chartValue={props.value}
            type="range"
            segments={[
                { color: 'green', size: 40 },
                { color: 'yellow', size: 30 },
                { color: 'red', size: 30 },
            ]}

            variant={GaugeChartVariant.MultipleSegments}
            hideLegend={true}
        />
    )
}

function interpolateColors(colors, percentage) {
    // Calcola il numero di step e la lunghezza di ogni step
    const numSteps = colors.length - 1;
    const stepSize = 1 / numSteps;

    // Trova gli indici dei colori di partenza e di arrivo per la percentuale data
    const startIndex = Math.floor(percentage / stepSize);
    const endIndex = Math.min(startIndex + 1, colors.length - 1);

    // Calcola la percentuale relativa all'interno dello step corrente
    const localPercentage = (percentage - startIndex * stepSize) / stepSize;

    // Estrai i componenti RGB dai colori di partenza e di arrivo
    const startColor = colors[startIndex];
    const endColor = colors[endIndex];

    const start = {
        r: parseInt(startColor.slice(1, 3), 16),
        g: parseInt(startColor.slice(3, 5), 16),
        b: parseInt(startColor.slice(5, 7), 16)
    };

    const end = {
        r: parseInt(endColor.slice(1, 3), 16),
        g: parseInt(endColor.slice(3, 5), 16),
        b: parseInt(endColor.slice(5, 7), 16)
    };

    // Calcola i componenti RGB del colore intermedio
    const result = {
        r: Math.round(start.r + (end.r - start.r) * localPercentage),
        g: Math.round(start.g + (end.g - start.g) * localPercentage),
        b: Math.round(start.b + (end.b - start.b) * localPercentage)
    };

    // Converti i componenti RGB in formato esadecimale e restituisci il colore
    return `#${((1 << 24) + (result.r << 16) + (result.g << 8) + result.b).toString(16).slice(1)}`;
}

function TemperatureIndicator(props) {
    const T = props.value;
    const percentage = (T - 20) / 60;
    const colors = ["#0000ff", "#ffffff", "#ff0000"]; // Blu, Bianco, Rosso

    const interpolatedColor = interpolateColors(colors, percentage);
    // console.log(interpolatedColor);
    return (
        <>
            <div style={{
                display: "flex"
                , justifyContent: "center"
            }}>
                <TempIcon fill={interpolatedColor} width="100" height="100" />
            </div>
            <span>{T}°C</span>
        </>
    )
}
function ProcessRow(props) {
    return (
        <TableRow>
            <TableCell>{props.value.PID}</TableCell>
            <TableCell>{props.value.PPID}</TableCell>
            <TableCell>{props.value.CMD}</TableCell>
            <TableCell>{props.value.CPU_Percentage}%</TableCell>
            <TableCell>{props.value.RAM_Percentage}%</TableCell>
        </TableRow>
    )
}
function DashBoard() {
    const [CPU_percentage, setCPU_percentage] = useState(40);
    const [RAM_percentage, setRAM_percentage] = useState(40);
    const [Temperature, setTemperature] = useState(25);
    const [processes, setProcesses] = useState([]);

    const getStats = async () => {
        API.getStats()
            .then((stats) => {
                // console.log(stats);
                setCPU_percentage(stats.CPU_percentage);
                setRAM_percentage(stats.RAM_percentage);
                //setTemperature(stats.T)
            })
    }
    const getProccesses = async () => {
        API.getProcesses()
            .then((processes) => {
                // console.log(processes);
                setProcesses(processes);
            })
    }

    useEffect(() => {
        // Esegui getStats subito e poi ogni 10 secondi
        getStats();
        getProccesses();
        const interval = setInterval(() => { 
            console.log("useEffect");
            getStats();
            getProccesses();
        }, 3000);

        // Pulisci l'intervallo quando il componente viene smontato
        return () => {
            clearInterval(interval);
        };

    }, [])

    return (
        <>


            <div className="container">
                <div className="sidebar">
                    <div className="sidebar-content">
                        <GaugeComponent value={CPU_percentage} />
                        <span>CPU Load</span>
                    </div>
                    <div className="sidebar-content">
                        <GaugeComponent value={RAM_percentage} />
                        <p>RAM Usage</p>
                    </div>
                    <div className="sidebar-content">
                        <TemperatureIndicator value={Temperature} />
                        <p>Temperature</p>
                    </div>
                </div>
                <div className="content">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">PID</TableHead>
                                <TableHead className="text-center">PPID</TableHead>
                                <TableHead className="text-center">CMD</TableHead>
                                <TableHead className="text-center">CPU Percentage</TableHead>
                                <TableHead className="text-center">RAM Percetage</TableHead>
                            </TableRow>
                            {
                                processes.map((p) => { return <ProcessRow value={p} /> })
                            }
                        </TableHeader>
                    </Table>
                </div>
            </div>
        </>
    )
}

export { DashBoard };