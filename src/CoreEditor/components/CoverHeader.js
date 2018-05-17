import React from 'react';
import ItemList from 'base/jsonld/entities/ItemList';
import ImageObject from 'base/jsonld/entities/ImageObject';

const defaultBg = 'https://default.wrioos.com/img/default-cover-bg.png';

const CoverHeader = ({
  coverDialog,
  onCoverPressed
}) => {
  const coverBgStyle = {textAlign: 'center'};
  const headerStyle = { height: 'auto', minHeight: '110px', backgroundSize: 'auto' };

  return (
    <div className="page-header" style={headerStyle} >
      <div
        className="cover-bg"
        onClick={onCoverPressed}
        style={coverBgStyle}
      >
        {coverDialog && coverDialog.submit
          ? coverDialog.tabs.length === 1
            ? '1 cover'
            : coverDialog.tabs.length + ' covers'
          : ''
        }
      </div>
    </div>
  )
}

export default CoverHeader;
