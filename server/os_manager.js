const os = require('os');
const sys_info = require('systeminformation');
const { exec } = require('child_process');

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
    const CPU_Percentage = Math.floor(((total-idle) / total) * 100);
    console.log(`Utilizzo CPU: ${CPU_Percentage}%`);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = ((totalMem - freeMem) / totalMem) * 100;
    console.log(`Utilizzo RAM: ${usedMem.toFixed(2)}%`);

    const temp = await sys_info.cpuTemperature()
    .then(data => {
        return data.main;
    })
    .catch(error => {
        console.log(error);
    });
    console.log(`Temperatura CPU: ${temp}°C`);
    return {
        "CPU_Percentage" : CPU_Percentage,
        "RAM_Percentage" : usedMem.toFixed(2),
        "T" : temp
    }
}

exports.getProcesses = async () => {
    const ps = exec('ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head -n 10', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
}