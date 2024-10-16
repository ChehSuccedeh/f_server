import { LoginForm } from './Forms.jsx'
import { DashBoard } from './DashBoard.jsx';
import { NavBar } from './NavBar.jsx';
import { Outlet } from 'react-router-dom';

function LoginLayout(props) {
    return (
        <>
            <LoginForm login={props.login} />
        </>);
}

function MainLayout(props) {
    return (
        <>
            <NavBar username={props.username} isAdmin={props.isAdmin} />
            <Outlet />
        </>
    );
}

function DashBoardLayout(props) {
    return (
        <>
            <DashBoard />
        </>
    );
}

function HomeLayout(props) {
    return (
        <>
            <div className="content">
                <h1>Welcome {props.username}</h1>
            </div>
        </>
    );
}

export { MainLayout, LoginLayout, DashBoardLayout, HomeLayout }