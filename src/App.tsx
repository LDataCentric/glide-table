import './App.css';
import { generateFakeData,generateColumns } from './fake/fakefunc';
import GlideTable from "./table/index"
function App() {
  return (
    <div className="App">
      <GlideTable data={generateFakeData(200)} columns={generateColumns()} emptyMessage={"azul"} height={500}></GlideTable>
    </div>
  );
}

export default App;
