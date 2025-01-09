import "./App.css";

// import react-router-dom
import { Route, Switch } from "react-router-dom";

// imports pages
import Home from "../Pages/Home";
import Room from "../Pages/Room";
import SingleRoom from "../Pages/SingleRoom";
import AboutUs from "../Pages/Aboutus";
import ContactUs from "../Pages/ContactUs";
import Login from "../Pages/Login";
import Signup from "../Pages/Sign Up";
import Profile from "../Pages/Profile";
import AdminPanel from "../Pages/Admin/AdminPanel";
import RoomManagement from "../Pages/Admin/RoomManagement";
import GuestManagement from '../Pages/Admin/GuestManagement'; 
import AdminBookingRequests from '../Pages/Admin/AdminBookingRequests';// New Admin Booking Requests Page
import ViewUserMessages from '../Pages/Admin/ViewUserMessages';// New Admin Booking Requests Page
import Error from "../Pages/Error";
import BookingPage from "../Pages/BookingPage"; // New Booking Page
import PaymentPage from "../Pages/PaymentPage"; // New Payment Page
import PaymentVerificationPage from "../Pages/PaymentVerificationPage"; // New Payment Verification Page
import BookingConfirmationPage from '../Pages/BookingConfirmationPage'; // New Booking Confirmation Page

// import components
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/rooms/" component={Room} />
        <Route exact path="/rooms/:slug" component={SingleRoom} />
        <Route exact path="/about-us" component={AboutUs} />
        <Route exact path="/contact-us" component={ContactUs} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/admin" component={AdminPanel}/>
        <Route exact path="/admin/rooms" component={RoomManagement} />
        <Route exact path="/admin/guests" component={GuestManagement} />
        <Route exact path="/admin/requests" component={AdminBookingRequests} />  {/* New Route */}  
        <Route exact path="/admin/viewmessages" component={ViewUserMessages} />  {/* New Route */}     
        <Route exact path="/booking" component={BookingPage} /> {/* New Route */}
        <Route exact path="/payment" component={PaymentPage} /> {/* New Route */}
        <Route exact path="/payment-verification" component={PaymentVerificationPage} /> {/* New Route */}
        <Route exact path="/booking-confirmation" component={BookingConfirmationPage} /> {/* New Route */}

        <Route component={Error} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;
