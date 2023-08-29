import React, { ReactElement } from 'react';
import { useIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { rgba, useThemeContext } from '../../../libs/aave-ui-kit';
import classNames from 'classnames';

import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import ValuePercent from '../../basic/ValuePercent';
import TribeRewardHelpModal from '../../HelpModal/TribeRewardHelpModal';

import messages from './messages';
import staticStyles from './style';

import tribeIcon from '../../../images/tirbe.svg';
import catIco from '../../../images/cat-ico.svg';
interface LiquidityMiningAPYLineProps {
  symbol?: string;
  value: string | number;
  tooltipId?: string;
  noBorder?: boolean;
  showUwUIcon?: boolean;
}

export default function LiquidityMiningAPYLine({
  symbol,
  value,
  tooltipId,
  noBorder = false,
  showUwUIcon = false,
}: LiquidityMiningAPYLineProps): ReactElement {
  const intl = useIntl();
  const { currentTheme, xl, isCurrentThemeDark } = useThemeContext();
  const { networkConfig } = useProtocolDataContext();

  const borderColor = rgba(`${currentTheme.lightBlue.rgb}, 0.2`);

  const isFeiReward = symbol === 'FEI';

  return (
    <div
      className={classNames(
        'LiquidityMiningAPYLine',
        {
          LiquidityMiningAPYLine__withTooltip: tooltipId,
        },
        noBorder && 'noBorder'
      )}
      data-tip={true}
      data-for={tooltipId}
    >
      {isFeiReward ? (
        <div className="LiquidityMiningAPYLine__tribe">
          <img src={tribeIcon} alt="" />
          <strong className="LiquidityMiningAPYLine__titleTribe LiquidityMiningAPYLine__title">
            TRIBE
          </strong>
        </div>
      ) : (
        <>
          {/*<TokenIcon*/}
          {/*  tokenSymbol={networkConfig.rewardTokenSymbol}*/}
          {/*  width={xl ? 10 : 12}*/}
          {/*  height={xl ? 10 : 12}*/}
          {/*/>*/}
          {showUwUIcon && <img src={catIco} alt="" width={14} height={14} />}

          <ValuePercent value={value} maximumDecimals={2} minimumDecimals={2} />
        </>
      )}

      {isFeiReward ? (
        <TribeRewardHelpModal text="" />
      ) : (
        <p className="LiquidityMiningAPYLine__title">{intl.formatMessage(messages.apr)}</p>
      )}

      {!!tooltipId && !isFeiReward && (
        <ReactTooltip className="LiquidityMiningAPYLine__tooltip" id={tooltipId} effect="solid">
          <div className="LiquidityMiningAPYLine__tooltip--content">
            <p>
              {intl.formatMessage(messages.tooltipText, {
                token: networkConfig.rewardTokenSymbol,
              })}
            </p>
          </div>
        </ReactTooltip>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .LiquidityMiningAPYLine {
          color: ${currentTheme.lightBlue.hex};
          border: 1px solid ${borderColor};

          &__tribe {
            strong {
              color: ${currentTheme.textDarkBlue.hex};
            }
          }

          .LiquidityMiningAPYLine__tooltip {
            background: ${isCurrentThemeDark
              ? currentTheme.mainBg.hex
              : currentTheme.darkBlue.hex} !important;
            &:after {
              border-top-color: ${isCurrentThemeDark
                ? currentTheme.mainBg.hex
                : currentTheme.darkBlue.hex} !important;
            }
          }
        }
      `}</style>
    </div>
  );
}
