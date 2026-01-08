import React from 'react';
import { ReactReader } from 'react-reader';

interface EpubViewerProps {
  url: string;
  location: string | number;
  locationChanged: (loc: string | number) => void;
  epubInitOptions?: Record<string, any>;
  getRendition?: (rendition: any) => void;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ url, location, locationChanged, epubInitOptions, getRendition }) => {
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url={url}
        location={location}
        locationChanged={locationChanged}
        epubInitOptions={epubInitOptions}
        getRendition={getRendition}
      />
    </div>
  );
};

export default EpubViewer;
