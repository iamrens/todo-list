import { NavLink, Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <div>
            <header>
                <nav>
                    <h1>Todo List App</h1>
                    <NavLink to="/">My Task</NavLink>
                    <NavLink to="about">About This Project</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
 
export default RootLayout;