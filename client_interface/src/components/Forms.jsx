import { Navigate } from 'react-router-dom';
import API from '../API.js'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!username || !password){
            setError('Please fill all the fields');
            return;
        } else {
            const credentials = {
                username: username, 
                password: password
            };
            props.login(credentials)
            .then((response)=>{
                navigate(`/${response.username}`);
            }).catch((err) => {
                setError(err);
            });
        }
    }
    
    return (
        <div className='content'>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export { LoginForm }