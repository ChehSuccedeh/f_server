const os = require('os');
const sys_info = require('systeminformation');
const { execSync } = require('child_process');

exports.getStats = async () => {

    const cpus = os.cpus();

    let totalIdle = 0, totalTick = 0;
    cpus.forEach(cpu => {
        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const CPU_Percentage = Math.floor(((total - idle) / total) * 100);
    // console.log(`Utilizzo CPU: ${CPU_Percentage}%`);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = ((totalMem - freeMem) / totalMem) * 100;
    // console.log(`Utilizzo RAM: ${usedMem.toFixed(2)}%`);

    const temp = await sys_info.cpuTemperature()
        .then(data => {
            return data.main;
        })
        .catch(error => {
            console.log(error);
        });
    // console.log(`Temperatura CPU: ${temp}°C`);
    return {
        "CPU_Percentage": CPU_Percentage,
        "RAM_Percentage": usedMem.toFixed(2),
        "T": temp
    }
}

exports.getProcesses = async () => {
    const ps = execSync('ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu  ');
    // console.log(ps.toString());

    const lines = ps.toString().split('\n');
    // console.log(lines);
    lines.pop();

    const info = lines.shift().trim().replace(/%/g, '').split(/\s+/);
    const processes = [];
    // console.log(info);
    let line;
    for (line in lines) {
        let item = {};
        const elements = lines[line].trim().split(/\s+/);
        // console.log(elements);
        // assegnazione manuale dei valori
        item[info[0]] = elements[0];
        item[info[1]] = elements[1];
        item[info[2]] = elements.slice(2, -2).join(' ');
        item[info[3]] = elements[elements.length-2];
        item[info[4]] = elements[elements.length-1];

        
        // console.log(item);
        processes.push(item);
    }
    // console.log(processes);
    return processes;
}    
