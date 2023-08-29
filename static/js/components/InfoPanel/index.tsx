import { ReactNode } from 'react';
import { useThemeContext } from '../../libs/aave-ui-kit';
import staticStyles from './style';
import animationCircle from '../../images/animationCircle.svg';

interface InfoPanelProps {
  children: ReactNode;
}

export default function InfoPanel({ children }: InfoPanelProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div className="InfoPanel">
      <img className="InfoPanel__circle" src={animationCircle} alt="" />

      <div className="InfoPanel__content-inner">
        <div className="InfoPanel__content">{children}</div>
      </div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .InfoPanel {
          color: ${currentTheme.textDarkBlue.hex};
          background: ${currentTheme.whiteItem.hex};
          border: 1px solid ${currentTheme.secondary.hex};
        }
      `}</style>
    </div>
  );
}
