import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import CreateAdvertisementPage from "./Pages/CreateAdvertisementPage/CreateAdvertisementPage.jsx";
import SingleAdvertisementDetailsPage from "./Pages/SingleAdvertisementDetailsPage/SingleAdvertisementDetailsPage.jsx"
import UserDetailsPage from "./Pages/UserDetailsPage/UserDetailsPage.jsx";
import AboutPage from "./Pages/AboutPage/AboutPage.jsx";
import ContactPage from "./Pages/ContactPage/ContactPage.jsx";


function App() {

  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/CreateAdvertisementPage" element={<CreateAdvertisementPage/>}/>
            <Route path="/SingleAdvertisementDetailsPage/:spaceID" element={<SingleAdvertisementDetailsPage/>}/>
            <Route path="/UserDetailsPage/:sideBarSelection" element={<UserDetailsPage/>}/>
            <Route path="/AboutPage" element={<AboutPage/>}/>
            <Route path="ContactPage" element={<ContactPage/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
