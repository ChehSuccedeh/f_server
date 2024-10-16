
const SERVER_URL = "http://localhost:3001/api"

const parseJson = async (httpResponse) => {
    return new Promise( (resolve, reject) => {
        httpResponse.then((response) =>{
            if(response.ok){
                response.json()
                    .then( (json) => {
                        resolve(json);
                    })
                    .catch( (err) =>{
                        reject({error:'Failed parsing server response'});
                    });
            } else {
                response.json()
                    .then( (res) => {
                        reject(res);
                    })
                    .catch( (err) => {
                        reject({error: 'Failed parsing server response'});
                    });
            }
        })
        .catch( (err) => {
            reject({error: 'Failed to communicate with server'});
        });
    });
}

function getStats(){
    return parseJson(fetch(`${SERVER_URL}/stats`, {
        credentials:'include'
    }))
        .then((json) => {
            // console.log(json);
            const server_statistics = {
                CPU_percentage : json.CPU_Percentage,
                RAM_percentage : json.RAM_Percentage,
                T : json.T
            }
            // console.log(server_statistics);
            return server_statistics;
        })
}

function getProcesses(){
    return parseJson(fetch(`${SERVER_URL}/processes`, {
        credentials:'include'
    }))
        .then((json) => {
            // console.log(json);
            const processes = json.array.map( (p) => {
                return {
                    CMD: p.CMD,
                    CPU_Percentage: p.CPU,
                    RAM_Percentage: p.MEM,
                    PID: p.PID,
                    PPID: p.PPID
                }
            });
            // console.log(processes);
            return processes;
        })
        .catch( (err) => {
            console.log(err);
        }); 
}

function login(credentials){
    return parseJson(fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    }))
    .then((json) => {
        return json;
    })
    .catch((err) => {
        return err;
    });
}

function logout(){
    return parseJson(fetch(`${SERVER_URL}/logout`, {
        method: 'DELETE',
        credentials: 'include',
    }))
    .then((json) => {
        return json;
    })
    .catch((err) => {
        return err;
    });
}

const API = { getStats, getProcesses, login, logout };
export default API;