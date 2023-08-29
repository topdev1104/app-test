import classNames from 'classnames';
import staticStyles from './style';

interface GradientPlusButtonProps {
  active: boolean;
  positionVertical: 'top' | 'bottom';
  positionHorizontal: 'left' | 'right';
  onClick?: () => void;
  className?: string;
}

export default function GradientPlusButton({
  active,
  positionVertical,
  positionHorizontal,
  onClick,
  className,
}: GradientPlusButtonProps) {
  return (
    <div
      className={classNames(
        'GradientPlusButton',
        `GradientPlusButton__${positionVertical}`,
        `GradientPlusButton__${positionHorizontal}`,
        { GradientPlusButton__active: active },
        className
      )}
      onClick={onClick}
    >
      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .GradientPlusButton {
          span {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
