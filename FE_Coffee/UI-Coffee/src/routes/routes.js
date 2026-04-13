import routes from "../config/routes";
import DefaultLayout from "../layouts/defaultLayout";
// AUTH
import Login from "../pages/auth/logIn/LoginContainer.jsx";
import Register from "../pages/auth/register/Register";
import ForgotPassword from "../pages/auth/forgotPassword/ForgotPassword";
// PAGES
import Home from "../pages/home";
import OrderPage from "../pages/order";
import CategoryPage from "../pages/category";
import BeveragePage from "../pages/beverage";
import BranchPage from "../pages/branch";
import TablePage from "../pages/table";
import AccountPage from "../pages/account";
import StatisticsPage from "../pages/statistics";
// CUSTOMER
import PageCustomer from "../pagescustomer/customer/index.jsx";

import settings from "../pages/settings/Settings.jsx";

// 404
import NotFound from "../components/commons/Notfound.jsx";
import VerifyOTP from '../pages/auth/forgotPassword/VerifyOTP.jsx';
import ResetPassword from '../pages/auth/forgotPassword/ResetPassword.jsx';
/* PUBLIC */

export const publicRoutes = [
    { path: routes.login, component: Login },
    { path: routes.register, component: Register },
    { path: routes.forgotPassword, component: ForgotPassword },
    { path: routes.resetPassword, component: ResetPassword },
    { path: routes.verifyOpt, component: VerifyOTP },
    {path: routes.customer, component: PageCustomer},
    { path: routes.customerOrder, component: PageCustomer },
    {path: routes.notfound, component: NotFound},
    {path:routes.help, component:NotFound }
];

/* PROTECTED */
export const protectedRoutes = [
    { path: routes.home, component: Home, layout: DefaultLayout },
    { path: routes.order, component: OrderPage, layout: DefaultLayout },
    { path: routes.category, component: CategoryPage, layout: DefaultLayout },
    { path: routes.beverage, component: BeveragePage, layout: DefaultLayout },
    { path: routes.branch, component: BranchPage, layout: DefaultLayout },
    { path: routes.table, component: TablePage, layout: DefaultLayout },
    { path: routes.account, component: AccountPage, layout: DefaultLayout },
    { path: routes.statistics, component: StatisticsPage, layout: DefaultLayout },
    {path: routes.settings, component: settings},
];
