const os = require('os');

exports.getStats = () => {

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
}