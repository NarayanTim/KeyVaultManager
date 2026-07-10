import {Landing, Dashboard} from "./pages/index"

function App() {
  const test = false;
  return (
    <div>
      {/* <Header /> */}
      {
        test ? <Dashboard/> : <Landing/>
      }
    </div>
  )
}

export default App
