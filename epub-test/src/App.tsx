import { useState, useEffect, useRef } from 'react';
import EpubViewer from './components/EpubViewer';
import { io, Socket } from 'socket.io-client';

function App() {
  const [location, setLocation] = useState<string | number>(0);
  const [epubFile, setEpubFile] = useState<string | null>(null);
  const [userPositions, setUserPositions] = useState<Map<string, string>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const [currentRendition, setCurrentRendition] = useState<any>(null);

  useEffect(() => {
    // Connect to the socket server
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
    });

    socket.on('receive_progress', (data: { socketId: string; location: string }) => {
      setUserPositions((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.socketId, data.location);
        return newMap;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEpubFile(url);
      setLocation(0);
      setUserPositions(new Map()); // Reset other users on new book
    }
  };

  const onLocationChanged = (loc: string | number) => {
    setLocation(loc);
    // Emit progress to server
    if (socketRef.current && typeof loc === 'string') {
      socketRef.current.emit('send_progress', {
        socketId: socketRef.current.id,
        location: loc,
      });
    }
  };

  const getRendition = (rendition: any) => {
    setCurrentRendition(rendition);
    rendition.themes.fontSize('100%');
    
    // Generate locations for percentage calculation
    rendition.book.ready.then(() => {
        console.log('Book ready, generating locations...');
        return rendition.book.locations.generate(1000);
    }).then((locations: any) => {
        console.log('Locations generated:', locations);
    });
  };

  const getPercentage = (cfi: string) => {
      if (!currentRendition || !currentRendition.book) return 0;
      // percentageFromCfi returns 0-1, so multiply by 100
      try {
          return currentRendition.book.locations.percentageFromCfi(cfi) * 100;
      } catch (e) {
          console.error(e);
          return 0;
      }
  };

  return (
    <div className="App" style={{ paddingBottom: '60px' }}>
      {!epubFile ? (
        <div style={{ padding: '20px' }}>
          <h1>EPUB Viewer</h1>
          <input type="file" accept=".epub" onChange={handleFileChange} />
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100, display: 'flex', gap: '10px' }}>
             <button onClick={() => setEpubFile(null)}>Close Book</button>
          </div>
          <EpubViewer
            url={epubFile}
            location={location}
            locationChanged={onLocationChanged}
            getRendition={getRendition}
            epubInitOptions={{
              openAs: 'epub',
            }}
          />
        </>
      )}
      
      {/* Footer Progress Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        backgroundColor: '#eee',
        borderTop: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 200,
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', width: '100%', height: '10px', backgroundColor: '#ccc', borderRadius: '5px' }}>
            {/* My Position */}
            {typeof location === 'string' && (
                 <div style={{
                    position: 'absolute',
                    left: `${getPercentage(location)}%`,
                    top: '-15px',
                    transition: 'left 0.3s ease'
                 }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'blue', border: '2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'10px' }}>
                        Me
                    </div>
                 </div>
            )}

            {/* Other Users */}
            {Array.from(userPositions.entries()).map(([id, loc]) => {
                const percent = getPercentage(loc);
                return (
                    <div key={id} title={id} style={{
                        position: 'absolute',
                        left: `${percent}%`,
                        top: '-15px',
                        transition: 'left 0.3s ease'
                     }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'green', border: '2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'10px' }}>
                            {id.substring(0, 2)}
                        </div>
                     </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
export default App;
