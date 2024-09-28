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
    return httpResponse(fetch(`${SERVER_URL}/stats`))
        .then((json) => {
            const server_statistics = {
                CPU_percentage : json.CPU,
                RAM_percentage : json.RAM,
                T : json.T
            }
            return server_statistics;
        })
}
const API = { getStats };
export default API;