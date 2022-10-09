import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import { ChessView } from "./views/ChessView";
import "./routes.css"
import OpeningView from "./views/OpeningView";
import UserReview from "./views/UserReview";
export const routes = [
    { path: "/chess", name: "Chess" },
    { path: "/opening", name: "Openings" },
    { path: "/user", name: "Review" },
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
            { path: "/opening", element: <OpeningView /> },
            { path: "/user", element: <UserReview /> },
        ]
    },
];


export function getRouter() {
    return createBrowserRouter(
        routesComp
    );
}
