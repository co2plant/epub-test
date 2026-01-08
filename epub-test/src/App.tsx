import { useState } from 'react';
import EpubViewer from './components/EpubViewer';

function App() {
  const [location, setLocation] = useState<string | number>(0);

  return (
    <div className="App">
      <EpubViewer
        url="https://react-reader.metabits.no/files/alice.epub"
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        epubInitOptions={{
          openAs: 'epub',
        }}
      />
    </div>
  );
}

export default App;
