import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Places from "./components/screens/Places";
import Place from "./components/screens/Place";
import NotFound from "./components/screens/NotFound";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import React, {useState, useEffect} from "react";
import PrivateRoute from "./components/PrivateRoute";

export const UserContext = React.createContext();

function App(props) {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);

    const updateUserData = (action) => {
    switch(action.type){
        case "LOGOUT":
            setUserData(null);
            localStorage.clear();
            break;
        case "LOGIN":
            setUserData(action.payload);
            break;
        default:
            break;
        }
           
    }

    useEffect(() => {        
        setUserData(JSON.parse(localStorage.getItem("user_data")));
        setLoading(false);
    }, []);
    return loading ?
    (<h1>Loading...</h1>) :
    (
        <div>
            <UserContext.Provider value={{userData, updateUserData}}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Places/>} />
                        <Route path="/auth/login/" element={<Login/>} />
                        <Route path="/auth/create/" element={<Signup/>} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/place/:id" element={<Place />} />
                        </Route>
                        <Route path="*" element={<NotFound/>} />
                    </Routes>
                </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;
