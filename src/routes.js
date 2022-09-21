import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import { ChessView } from "./views/ChessView";
import "./routes.css"
import OpeningView from "./views/OpeningView";
export const routes = [
    { path: "/chess", name: "Chess" },
    { path: "/foo", name: "Foo" },
];

function renderNavBar() {
    return (
        <div>
            <nav className="navbar">
                <ul>
                    {routes.map(route =>
                        <li key={route.path}>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "selected" : undefined}
                                to={route.path}>{route.name}</NavLink>
                        </li>)
                    }
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

const routesComp = [
    {
        path: "/", element: renderNavBar(), children: [
            { path: "/chess", element: <ChessView /> },
            { path: "/foo", element: <OpeningView /> },
        ]
    },
];


export function getRouter() {
    return createBrowserRouter(
        routesComp
    );
}
