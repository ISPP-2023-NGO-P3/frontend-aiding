import "./App.css";
import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication and routes
import { AuthContextProvider } from "./components/routes/authContext";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { NotificationContextProvider } from "./components/notificationContext";

// Advertisement
import ListAdvertisement from "./pages/information/advertisement/ListAdvertisement";
import AdminListAdvertisement from "./pages/information/advertisement/AdminListAdvertisement";
import ShowAdvertisement from "./pages/information/advertisement/ShowAdvertisement";
import AdminCreateAdvertisement from "./pages/information/advertisement/AdminCreateAdvertisement";
import AdminUpdateAdvertisement from "./pages/information/advertisement/AdminUpdateAdvertisement";

// Home
import Home from "./pages/Home";

// Partners
import ListPartner from "./pages/partners/ListPartner";
import ShowPartner from "./pages/partners/ShowPartner";
import CreatePartner from "./pages/partners/CreatePartner";
import UpdatePartner from "./pages/partners/UpdatePartner";
import CreateCommunication from "./pages/partners/CreateCommunication";
import UpdateCommunication from "./pages/partners/UpdateCommunication";
import CreateDonation from "./pages/partners/CreateDonation";
import UpdateDonation from "./pages/partners/UpdateDonation";

// Contacts
import ListContact from "./pages/base/ListContact";
import ContactDetail from "./pages/base/ShowContact";
import CreateContact from "./pages/base/CreateContact";

// Users
import Users from "./pages/base/Users";
import ViewUser from "./pages/base/ViewUser";
import EditUser from "./pages/base/EditUser";
import CreateUser from "./pages/base/CreateUser";
import Login from "./pages/base/Login";
import Register from "./pages/base/Register";

// Volunteers
import ListVolunteers from "./pages/volunteers/ListVolunteers";
import CreateVolunteer from "./pages/volunteers/CreateVolunteer";
import ShowVolunteer from "./pages/volunteers/ShowVolunteer";
import UpdateVolunteer from "./pages/volunteers/UpdateVolunteer";

// Resources
import UpdateResource from "./pages/information/map/UpdateResource.js";
import CreateResource from "./pages/information/map/CreateResource.js";
import ShowResource from "./pages/information/map/ShowResource.js";
import ResourcesTable from "./pages/information/map/ResourcesTable.js";
import ResourcesListEdit from "./components/ResourcesListEdit";
import ShowResourceUser from "./pages/information/map/ShowResourceUser.js";

// Policies
import TermsAndPolicies from "./pages/information/policies/TermsAndPolicies.js";
import SLAs from "./pages/information/policies/SLAs.js";

// Turns
import ListTurn from "./pages/volunteers/ListTurn";
import CreateTurn from "./pages/volunteers/CreateTurn";
import ShowTurnDraft from "./pages/volunteers/ShowTurnDraft";
import ShowTurnFinished from "./pages/volunteers/ShowTurnFinished";
import UpdateTurn from "./pages/volunteers/UpdateTurn";
import CreateVolunteerTurn from "./pages/volunteers/CreateVolunteerTurn";

// Events
import AdminCreateEvent from "./pages/events/AdminCreateEvents";
import ProgramedEvent from "./pages/events/ProgramedEvent";
import StartedEvent from "./pages/events/StartedEvent";
import ShowEvent from "./pages/events/ShowEvent";
import AdminListEvent from "./pages/events/AdminListEvents";
import AdminUpdateEvent from "./pages/events/AdminUpdateEvents";
import BookingEvents from "./pages/events/BookingEvents";

import AdminCreateNotification from './pages/base/AdminCreateNotification';

// Stock
import ListItems from './pages/stock/ListItems';
import CreateItem from './pages/stock/CreateItem';
import ShowItem from './pages/stock/ShowItem';
import UpdateItem from './pages/stock/UpdateItem';

import Error404 from "./pages/Error404";

var navLinksPublic = [
  {
    title: "Inicio",
    path: "/",
  },
  {
    title: "Noticias",
    path: "information/sections",
  },
  {
    title: "Recursos",
    path: "information/map-resources",
  },
];

var navLinksAdmin = [
  {
    title: "Socios",
    path: "admin/partners",
  },
  {
    title: "Usuarios",
    path: "admin/base/users",
  },
  {
    title: "Recursos",
    path: "admin/information/resources",
  },
  {
    title: "Voluntarios",
    path: "admin/volunteers",
  },
  {
    title: "Noticias",
    path: "admin/information/advertisements",
  },
  {
    title: "Atención al cliente",
    path: "admin/base/contacts",
  },
  {
    title: "Eventos",
    path: "admin/events",
  },
  {
    title: "Crear Notificación",
    path: "admin/notification/create"
  },
  {
    title: "Inventario",
    path: "admin/stock/items"
  },
];

var navLinksCaptainSupervisor = [
  {
    title: "Turnos",
    path: "roles/volunteers/turns",
  },
  {
    title: "Voluntarios",
    path: "roles/volunteers",
  },
  {
    title: "Crear Notificación",
    path: "roles/notification/create"
  },
];

var logo = ["/logo.png"];

export default function App() {
  return (
    <div className="App">
      <div className="container-principal">
        <AuthContextProvider>
          <NotificationContextProvider>
            <Router>
              <div className="container-secundario">
                <Navbar
                  navLinksPublic={navLinksPublic}
                  navLinksAdmin={navLinksAdmin}
                  navLinksCaptainSupervisor={navLinksCaptainSupervisor}
                  logo={logo}
                />
                <Routes>
                  {/* Public routes ===========================================*/}
                  <Route path="/" element={<PublicRoute />}>
                    {/* Home */}
                    <Route index element={<Home />} />
                    {/* Contacto */}
                    <Route
                      path="base/contacts/CreateContact"
                      element={<CreateContact />}
                    />

                    {/* Information */}
                    <Route
                      path="information/sections"
                      element={<ListAdvertisement />}
                    />
                    <Route
                      path="information/sections/:id"
                      element={<ListAdvertisement />}
                    />
                    <Route
                      path="information/advertisements/:id"
                      element={<ShowAdvertisement />}
                    />
                    <Route
                      exact
                      path="information/map-resources"
                      element={<ResourcesListEdit />}
                    />
                    <Route
                      path="information/map-resources/:id"
                      element={<ShowResourceUser />}
                    />

                    <Route path="policies/terms" element={<TermsAndPolicies />} />
                    <Route path="policies/slas" element={<SLAs />} />

                    {/* Events */}
                    <Route
                      path="/events/programed"
                      element={<ProgramedEvent />}
                    />

                    <Route path="/events/started" element={<StartedEvent />} />

                    <Route path="/events/:id" element={<ShowEvent />} />

                    <Route path="/events/:id/booking" element={<BookingEvents />} />

                    {/* Login and register */}
                    <Route path="base/login" element={<Login />} />
                    <Route path="base/register" element={<Register />} />
                  </Route>

                  {/* Capitan/supervsior routes ============================================*/}
                  <Route path="/roles" element={<ProtectedRoute />}>
                  <Route path="/roles/notification/create" element={ <AdminCreateNotification/> } />
                    {/* Volunteers */}
                    <Route path="volunteers" element={<ListVolunteers />} />
                    <Route
                      path="volunteers/create"
                      element={<CreateVolunteer />}
                    />
                    <Route path="volunteers/:id" element={<ShowVolunteer />} />
                    <Route
                      path="volunteers/update/:id"
                      element={<UpdateVolunteer />}
                    />
                    {/* Turns */}
                    <Route path="volunteers/turns" element={ <ListTurn/>} />
                    <Route path="volunteers/turns/create" element={ <CreateTurn/>} />
                    <Route path="volunteers/turns/:id/draft" element={ <ShowTurnDraft/>} />
                    <Route path="volunteers/turns/:id" element={ <ShowTurnFinished/>} />
                    <Route path="volunteers/turns/update/:id" element={ <UpdateTurn/>} />
                    <Route path="volunteers/volunteerTurns/create/:id" element={ <CreateVolunteerTurn/>} />
                  </Route>
                                      
                  {/* Admin routes ============================================*/}
                  <Route path="/admin" element={<PrivateRoute />}>
                    {/* Base */}
                    <Route path="base/contacts" element={<ListContact />} />
                    <Route path="base/contacts/:id" element={<ContactDetail />} />
                    <Route exact path="base/users" element={<Users />} />
                    <Route
                      exact
                      path="base/users/crearUsuario"
                      element={<CreateUser />}
                    />
                    <Route
                      exact
                      path="base/users/verUsuario/:id"
                      element={<ViewUser />}
                    />
                    <Route
                      exact
                      path="base/users/editarUsuario/:id"
                      element={<EditUser />}
                    />

                    {/* Information */}
                    <Route
                      path="information/advertisements/create"
                      element={<AdminCreateAdvertisement />}
                    />
                    <Route
                      path="information/advertisements/:id/update"
                      element={<AdminUpdateAdvertisement />}
                    />
                    <Route
                      path="information/advertisements"
                      element={<AdminListAdvertisement />}
                    />
                    <Route
                      exact
                      path="information/edit-resource/:id"
                      element={<UpdateResource />}
                    />
                    <Route
                      path="information/resources/:id"
                      element={<ShowResource />}
                    />
                    <Route
                      exact
                      path="information/create-resource"
                      element={<CreateResource />}
                    />
                    <Route
                      exact
                      path="information/resources"
                      element={<ResourcesTable />}
                    />

                    <Route path="policies/terms" element={<TermsAndPolicies />} />
                    <Route path="policies/slas" element={<SLAs />} />
                    
                    {/* Partner*/}
                    <Route path="partners" element={<ListPartner />} />
                    <Route path="partners/:id" element={<ShowPartner />} />
                    <Route path="partners/create" element={<CreatePartner />} />
                    <Route
                      path="partners/update/:id"
                      element={<UpdatePartner />}
                    />

                    <Route
                      path="partners/:id/communication/create"
                      element={<CreateCommunication />}
                    />
                    <Route
                      path="partners/:id/communication/update/:idc"
                      element={<UpdateCommunication />}
                    />
                    <Route
                      path="partners/:id/donation/create"
                      element={<CreateDonation />}
                    />
                    <Route
                      path="partners/:id/donation/update"
                      element={<UpdateDonation />}
                    />
                    {/* Volunteers */}
                    <Route path="volunteers" element={<ListVolunteers />} />
                    <Route
                      path="volunteers/create"
                      element={<CreateVolunteer />}
                    />
                    <Route path="volunteers/:id" element={<ShowVolunteer />} />
                    <Route
                      path="volunteers/update/:id"
                      element={<UpdateVolunteer />}
                    />

                    <Route path="/admin/events/" element={<AdminListEvent />} />

                    <Route
                      path="/admin/events/create"
                      element={<AdminCreateEvent />}
                    />

                    <Route
                      path="/admin/events/:id/update"
                      element={<AdminUpdateEvent />}
                    />


                    <Route path="volunteers/turns" element={<ListTurn />} />
                    <Route
                      path="volunteers/turns/create"
                      element={<CreateTurn />}
                    />
                    <Route path="volunteers/turns/:id/draft" element={<ShowTurnDraft />} />
                    <Route path="volunteers/turns/:id" element={<ShowTurnFinished />} />
                    <Route
                      path="volunteers/turns/update/:id"
                      element={<UpdateTurn />}
                    />
                    <Route
                      path="volunteers/volunteerTurns/create/:id"
                      element={<CreateVolunteerTurn />}
                    />

                    <Route path="/admin/notification/create" element={ <AdminCreateNotification/> } />
                    
                    <Route path="stock/items" element={<ListItems />} />
                    <Route path="stock/items/create" element={<CreateItem />} />
                    <Route path="stock/items/:id" element={<ShowItem />} />
                    <Route path="stock/items/update/:id" element={<UpdateItem />} />

                  </Route>
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </div>
              <Footer />
            </Router>
          </NotificationContextProvider>
        </AuthContextProvider>
      </div>
    </div>
  );
}
