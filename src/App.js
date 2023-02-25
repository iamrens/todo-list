import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from "./layouts/RootLayout";
import About from "./pages/About";
import Tasks from "./pages/Tasks";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Tasks />}/>
      <Route path="about" element={<About />} />
    </Route>
  )
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#fefefe'
    }
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 400,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: 'Poppins',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Tasks />
      </ThemeProvider>

      {/* <RouterProvider router={router} /> */}
      {/* <Router>
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/about" element={<About />}></Route>
            </Routes>
        </Router> */}
    </div>
  );
}

export default App;
