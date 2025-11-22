'use client';

import React from 'react';

const Loader = (props) => {
  const { isActive } = props;
  return (
    <>
      {isActive && (
        <div className="overlay">
          <div className="overlay__inner">
            <div className="overlay__content">
              <span className="spinner"></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
  