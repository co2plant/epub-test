import { useState } from 'react';
import EpubViewer from './components/EpubViewer';

function App() {
  const [location, setLocation] = useState<string | number>(0);
  const [epubFile, setEpubFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEpubFile(url);
      setLocation(0); // Reset location for new book
    }
  };

  return (
    <div className="App">
      {!epubFile ? (
        <div style={{ padding: '20px' }}>
          <h1>EPUB Viewer</h1>
          <input type="file" accept=".epub" onChange={handleFileChange} />
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100, display: 'flex', gap: '10px' }}>
             <div style={{ background: 'rgba(255,255,255,0.8)', padding: '5px' }}>
                Location: {location.toString().substring(0, 20)}...
             </div>
             <button onClick={() => setEpubFile(null)}>Close Book</button>
          </div>
          <EpubViewer
            url={epubFile}
            location={location}
            locationChanged={(loc: string | number) => setLocation(loc)}
            epubInitOptions={{
              openAs: 'epub',
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
