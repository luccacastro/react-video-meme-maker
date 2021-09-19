import Header from './components/Header'
import Content from './components/Content'
import {Route, BrowserRouter, Link, Redirect} from 'react-router-dom'
import VideoMenu from '../src/components/VideoMenu' 
import './main.css'

function App() {
  return (
    <div className="App">
      <Header></Header>
      {/* <Content/> */}
      <BrowserRouter>
        <Route path="/" component={()=> <Redirect to='/home'/>}/>
        <Route path="/home" component={Content}/>
        <Route path="/video-edit" component={VideoMenu}/>
      </BrowserRouter>
    </div>
  );
}

export default App;

{/* <div className="App">
      <Header></Header>
      <Content/>
      <Router>
        <Route path="/" component={<Content/>}/>
      </Router>
    </div> */}