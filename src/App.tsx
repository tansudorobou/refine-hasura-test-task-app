import {
    Refine,
    Authenticated,
} from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
    AuthPage, ErrorComponent
    , notificationProvider
    , ThemedLayoutV2
    , ThemedSiderV2
} from '@refinedev/antd';
import "@refinedev/antd/dist/reset.css";

import dataProvider, { GraphQLClient, graphqlWS, liveProvider } from "@refinedev/hasura";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { authProvider } from "./authProvider";
import { TasksList, TasksCreate, TasksEdit } from "./pages/tasks";

const API_URL = import.meta.env.VITE_API_URL;
const HEADER_VALUE = import.meta.env.VITE_HEADER_VALUE;
// const API_URL = "https://flowing-mammal-24.hasura.app/v1/graphql";
// const WS_URL = "ws://flowing-mammal-24.hasura.app/v1/graphql";



const client = new GraphQLClient(API_URL, {
    headers: {
        // "x-hasura-role": "public",
        "x-hasura-admin-secret": HEADER_VALUE
    },
});

// const webSocketClient = graphqlWS.createClient({
//                 url: WS_URL,
//             });


function App() {
    const { t, i18n } = useTranslation();


    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };


    return (
        <BrowserRouter>
            {/* <GitHubBanner /> */}
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <Refine dataProvider={dataProvider(client, {
                        idType: "Int"
                    })}
                        // liveProvider={liveProvider(webSocketClient)}
                        notificationProvider={notificationProvider}
                        routerProvider={routerBindings}
                        authProvider={authProvider}
                        i18nProvider={i18nProvider}
                        resources={[
                            {
                                name: "tasks",
                                list: "/tasks",
                                create: "/tasks/create",
                                edit: "/tasks/edit/:id",
                                meta: {
                                    canDelete: true,
                                }
                            }
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            projectId: "ajzYrs-cbj9Jo-OvjdNu",
                            liveMode: "auto",
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        fallback={<CatchAllNavigate to="/login" />}
                                    >
                                        <ThemedLayoutV2
                                            Header={() => <Header sticky />}
                                            Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route index element={
                                    <NavigateToResource resource="tasks" />
                                } />
                                <Route path="/tasks">
                                    <Route index element={<TasksList />} />
                                    <Route path="create" element={<TasksCreate />} />
                                    <Route path="edit/:id" element={<TasksEdit />} />
                                </Route>
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                            <Route
                                element={
                                    <Authenticated fallback={<Outlet />}>
                                        <NavigateToResource />
                                    </Authenticated>
                                }
                            >
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                            </Route>
                        </Routes>


                        <RefineKbar />
                        <UnsavedChangesNotifier />
                        <DocumentTitleHandler />
                    </Refine>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
};

export default App;
