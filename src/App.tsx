import './App.css';
import { generateFakeData,generateColumns,fakeAddRLA,fakeDeleteRLA } from './fake/fakefunc';
import GlideTable from "./table/index"
function App() {
  return (
    <div className="App">
      <GlideTable data={generateFakeData(200)} columns={generateColumns()} emptyMessage={"empty"} height={500} deleteRlas={fakeDeleteRLA} addRlas={fakeAddRLA}></GlideTable>
    </div>
  );
}

export default App;
