import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Fragment } from "react";
import { publicRoutes, protectedRoutes } from "./routes/routes";
import RequireAuth from "./routes/RequireAuth";
import routes from "./config/routes";

function App() {
    const isLoggedIn = !!localStorage.getItem("token");
    return (
        <Router>
            <Routes>
                {/* ENTRY */}
                <Route
                    path={routes.root}
                    element={
                        isLoggedIn
                            ? <Navigate to={routes.home} replace />
                            : <Navigate to={routes.login} replace />
                    }
                />

                {/* PUBLIC */}
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={<Page />}
                        />
                    );
                })}

                {/* PROTECTED */}
                {protectedRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout || Fragment;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <RequireAuth>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </RequireAuth>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}
export default App;
