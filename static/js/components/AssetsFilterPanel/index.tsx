import LabeledSwitcher from '../basic/LabeledSwitcher';

import staticStyles from './style';

export type AssetsFilterPanelProps = {
  optionTitleLeft: string;
  optionTitleRight: string;
  switchOnToggle: (value: boolean) => void;
  switchValue: boolean;
  searchValue: string;
  searchOnChange: (value: string) => void;
  darkOnDarkMode?: boolean;
};

export default function AssetsFilterPanel({
  optionTitleLeft,
  optionTitleRight,
  switchOnToggle,
  switchValue,
  searchValue,
  searchOnChange,
  darkOnDarkMode,
}: AssetsFilterPanelProps) {
  return (
    <div className="AssetsFilterPanel">
      <div className="AssetsFilterPanel__content">
        <LabeledSwitcher
          leftOption={optionTitleLeft}
          rightOption={optionTitleRight}
          onToggle={switchOnToggle}
          value={switchValue}
          darkOnDarkMode={darkOnDarkMode}
        />
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
