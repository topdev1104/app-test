import { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import staticStyles from './style';

import animationCircle from '../../../images/animationCircle.svg';

interface CaptionProps {
  title: string;
  description?: string | ReactNode;
  color?: 'primary' | 'secondary' | 'dark';
  className?: string;
  withAnimationCircle?: boolean;
  onWhiteBackground?: boolean;
}

export default function Caption({
  title,
  description,
  color = 'primary',
  className,
  withAnimationCircle,
  onWhiteBackground,
}: CaptionProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div className={classNames('Caption', `Caption__${color}`, className)}>
      <h2 className={classNames({ Caption__titleWithCircle: withAnimationCircle })}>
        {title} {withAnimationCircle && <img src={animationCircle} alt="" />}
      </h2>

      <div style={{ marginBottom: '10px' }}>{description}</div>

      <style jsx={true}>{staticStyles}</style>
      {/* <style jsx={true}>{`
        .Caption {
          &__market {
            h2 {
              color: white;
            }
          }

          &__primary {
            h2 {
              color: white;
              font-weight: 600;
              font-size: 23px;
            }
          }

          &__secondary {
            h2 {
              color: white;
            }
          }

          &__dark {
            h2 {
              color: ${onWhiteBackground
                ? currentTheme.darkBlue.hex
                : currentTheme.textDarkBlue.hex};
            }
          }

          &__description {
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 24px;
          }
        }
      `}</style> */}
    </div>
  );
}
