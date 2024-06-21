import StructureDefinitionEditor from './editor/StructureDefinitionEditor';
import './hl7fhir/fhir.css';
import './style.css';

export default function App() {
  return (
    <div className="app">
      <StructureDefinitionEditor />
    </div>
  );
}