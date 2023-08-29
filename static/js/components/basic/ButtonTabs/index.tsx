import { useCallback } from 'react';

import staticStyles from './style';
import DefaultButton from '../DefaultButton';

interface ButtonTabsProps {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function ButtonTabs({ tabs, selectedTab, setSelectedTab }: ButtonTabsProps) {
  const handleChange = useCallback(
    (value: string) => () => {
      setSelectedTab(value);
    },
    [setSelectedTab]
  );

  return (
    <>
      <div className="ButtonTabs">
        {tabs.map((tab, index) => (
          <DefaultButton
            color="tabs"
            key={`button-tab-${index}`}
            title={tab}
            onClick={handleChange(tab)}
            transparent={selectedTab !== tab}
          />
        ))}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
