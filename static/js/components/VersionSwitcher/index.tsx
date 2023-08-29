import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import staticStyles from './style';
import CheckBoxField from '../fields/CheckBoxField';

export default function VersionSwitcher() {
  const [version, setVersion] = useState(window.localStorage.getItem('version') ?? 'v2');
  const checkboxInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem('version', version);
  }, [version]);

  const handleChange = (version: string) => {
    setVersion(version);
    window.localStorage.setItem('version', version);
    window.location.reload();
  };

  if (location.pathname === '/manage-uwu') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div className="VersionSwitcher">
          {/* <div className="VersionSwitcher__label-left">V1</div>
          <div className="VersionSwitcher__toggle-switch" onClick={handleChange}>
            <input
              type="checkbox"
              id="togle-swith"
              defaultChecked={version === 'v2' ? true : false}
              ref={checkboxInputRef}
            />
            <label htmlFor="VersionSwitcher__togle-swith"></label>
          </div>
          <div className="VersionSwitcher__label-right">V2</div> */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            onClick={() => handleChange('v1')}
          >
            {version === 'v1' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
              >
                <g>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="#4cdebb"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                  />
                </g>
              </svg>
            )}
            {version !== 'v1' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                <path
                  fill="grey"
                  d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
                />
                <path d="M0 0h48v48H0z" fill="none" />
              </svg>
            )}
            <div className="VersionSwitcher__label-right">V1</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            onClick={() => handleChange('v2')}
          >
            {version === 'v2' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
              >
                <g>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="#4cdebb"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                  />
                </g>
              </svg>
            )}
            {version !== 'v2' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                <path
                  fill="grey"
                  d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
                />
                <path d="M0 0h48v48H0z" fill="none" />
              </svg>
            )}
            <div className="VersionSwitcher__label-right">V2</div>
          </div>
          {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleChange('v3')}>
            {version === 'v3' && <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
                <g>
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path fill="#4cdebb" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                </g>
            </svg>}
            {version !== 'v3' && <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                <path fill="grey" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"/>
                <path d="M0 0h48v48H0z" fill="none"/>
            </svg>}
            <div className="VersionSwitcher__label-right">V3</div>
          </div> */}
        </div>
        <style jsx={true} global={true}>
          {staticStyles}
        </style>
      </div>
    );
  } else {
    return <></>;
  }
}
