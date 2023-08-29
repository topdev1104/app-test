import { ReactElement } from 'react';
import classNames from 'classnames';
import { gradient, useThemeContext, Button } from '../../../libs/aave-ui-kit';

export interface DefaultButtonProps {
  onClick?: (event: any) => void;
  title: string;
  type?: 'button' | 'submit';
  color?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'green'
    | 'red'
    | 'white'
    | 'gradient'
    | 'inherit'
    | 'primary300'
    | 'tabs';
  size?: 'big' | 'medium' | 'normal' | 'small';
  transparent?: boolean;
  mobileBig?: boolean;
  iconComponent?: ReactElement | ReactElement[];
  disabled?: boolean;
  className?: string;
  onDarkBackground?: boolean;
}

export default function DefaultButton({
  onClick,
  title,
  type = 'button',
  color = 'primary',
  size = 'medium',
  transparent,
  mobileBig,
  iconComponent,
  disabled,
  className,
  onDarkBackground,
}: DefaultButtonProps) {
  const { currentTheme, isCurrentThemeDark } = useThemeContext();

  const backgroundGradient = gradient(
    -90,
    `${currentTheme.primary.rgb}, 1`,
    0,
    `${currentTheme.secondary.rgb}, 1`,
    100
  );

  return (
    <>
      <Button
        className={classNames(
          `DefaultButton`,
          `DefaultButton__${color}`,
          {
            DefaultButton__mobileBig: mobileBig,
            DefaultButton__transparent: transparent,
            DefaultButton__onDarkBackground: isCurrentThemeDark && onDarkBackground,
          },
          className
        )}
        title={title}
        disabled={disabled}
        onClick={onClick}
        iconComponent={iconComponent}
        transparent={transparent}
        mobileBig={mobileBig}
        size={size}
        type={type}
      />

      <style jsx={true} global={true}>{`
        @import 'src/_mixins/screen-size';

        .DefaultButton {
          color: ${currentTheme.white.hex};
          &__inherit {
            background: inherit;
            border: none;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 2px;
            color: #a49fda;
          }
          &__primary {
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            border-radius: 24px;
            border: none;
          }
          &__primary300 {
            background: rgba(100, 92, 192, 0.4);
            border: 1px solid #8079cb;
            border-radius: 24px;
          }
          &__secondary {
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            border-radius: 24px;
            padding: 16px 20px;
            width: 144px;
            height: 40px;
            font-weight: 400;
            line-height: 19px;
            text-align: center;
            letter-spacing: 0.01em;
            color: #ffffff;
            border: none;
          }
          &__dark {
            color: ${currentTheme.whiteElement.hex};
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            border: none;
            border-radius: 24px;
            color: white;
            font-weight: 400;
            &.DefaultButton__transparent {
              background: transparent;
              color: ${currentTheme.textDarkBlue.hex};
              &:hover {
                background: ${currentTheme.textDarkBlue.hex};
                color: ${currentTheme.whiteElement.hex};
              }
            }
          }
          &__green {
            background: ${currentTheme.green.hex};
            border-color: ${currentTheme.green.hex};
          }
          &__red {
            background: ${currentTheme.red.hex};
            border-color: ${currentTheme.red.hex};
          }
          &__white {
            background: ${currentTheme.white.hex};
            border-color: ${currentTheme.white.hex};
            color: ${currentTheme.darkBlue.hex};
            &.DefaultButton__transparent {
              background: transparent;
              color: ${currentTheme.white.hex};
              &:hover {
                background: ${currentTheme.white.hex};
                color: ${currentTheme.darkBlue.hex};
              }
            }
          }
          &__gradient {
            background: ${backgroundGradient};
            color: ${currentTheme.white.hex};
          }
          &__tabs {
            font-weight: 400;
            color: #ffffff;
            border: none;
            border-radius: 24px;
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
          }

          &__transparent {
            background: transparent;
          }

          &:disabled {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 24px;
            color: rgba(255, 255, 255, 0.6);
            @include respond-to(sm) {
              background: ${currentTheme.disabledGray.hex} !important;
              border-color: ${currentTheme.disabledGray.hex} !important;
            }
          }
        }

        .DefaultButton__onDarkBackground {
          &:disabled {
            background: ${currentTheme.disabledGray.hex} !important;
            border-color: ${currentTheme.disabledGray.hex} !important;
          }
        }
      `}</style>
    </>
  );
}
