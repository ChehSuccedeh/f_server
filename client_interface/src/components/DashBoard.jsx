import { GaugeChart, GaugeChartVariant } from "@fluentui/react-charting";
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import TempIcon from './../assets/thermometer.svg?react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { useEffect, useState } from 'react'
import API from '../API.js'

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
            <TempIcon fill={interpolatedColor} width="100" height="100" />
            <span>{T}°C</span>
        </>
    )
}
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
                //setTemperature(stats.T)
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
        <>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            New Window <MenubarShortcut>⌘N</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled>New Incognito Window</MenubarItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>Share</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Email link</MenubarItem>
                                <MenubarItem>Messages</MenubarItem>
                                <MenubarItem>Notes</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem>
                            Print... <MenubarShortcut>⌘P</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>Find</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Search the web</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Find...</MenubarItem>
                                <MenubarItem>Find Next</MenubarItem>
                                <MenubarItem>Find Previous</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem>Cut</MenubarItem>
                        <MenubarItem>Copy</MenubarItem>
                        <MenubarItem>Paste</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
                        <MenubarCheckboxItem checked>
                            Always Show Full URLs
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarItem inset>
                            Reload <MenubarShortcut>⌘R</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled inset>
                            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Hide Sidebar</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Profiles</MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value="benoit">
                            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                        </MenubarRadioGroup>
                        <MenubarSeparator />
                        <MenubarItem inset>Edit...</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Add Profile...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className="grid grid-cols-4">
                <div className="min-w-50">
                    <div>
                        <GaugeComponent value={CPU_percentage} />
                        <span>CPU Load</span>
                    </div>
                    <div>
                        <GaugeComponent value={RAM_percentage} />
                        <span>RAM Usage</span>
                    </div>
                    <div>
                        <TemperatureIndicator value={Temperature} />
                        <span>Temperature</span>
                    </div>
                </div>
                <div className="col-span-3">
                    <h1>Dashboard e testo a caso</h1>
                </div>
            </div>
        </>
    )
}

export { DashBoard }