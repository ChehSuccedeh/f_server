import {Link} from 'react-router-dom';

function NavBar(props) {
    console.log(props);
    return (
        <div className="navbar">
            <div className="nav-user">{props.username}</div>
            <div className="nav-links">
                {props.isAdmin ? <Link to={`/${props.username}/dashboard`} className="nav-link">DashBoard</Link> : null}
                <Link to={`/${props.username}/personal`} className="nav-link">Personal Cloud</Link>
            </div>
        </div>
    );
}

export {NavBar};