import { useThemeContext } from '../../../../libs/aave-ui-kit';

import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import Caption from '../../../../components/basic/Caption';
import Link from '../../../../components/basic/Link';
import DefaultButton from '../../../../components/basic/DefaultButton';

import staticStyles from './style';

import { LOGO_2 } from '../../../../ui-config';

export default function DashboardNoData() {
  const { currentTheme, isCurrentThemeDark, sm } = useThemeContext();

  return (
    <ContentWrapper className="DashboardNoData" withFullHeight={true}>
      <img src={LOGO_2} alt="" className="DashboardNoData__logo" width={100} />
      <Caption title="No deposits yet" description="Open Deposit" />

      <div className="DashboardNoData__bottom--inner">
        <Link to="/deposit" className="ButtonLink">
          <DefaultButton title="Open Deposit" mobileBig={true} />
        </Link>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .DashboardNoData {
          &__markets {
            &:after {
              background: ${isCurrentThemeDark
                ? currentTheme.lightBlue.hex
                : sm
                ? currentTheme.disabledGray.hex
                : currentTheme.mainBg.hex};
            }
          }
          &__bottom--text {
            color: ${currentTheme.textDarkBlue.hex};
          }

          &__logo {
            margin-bottom: 68.7px;
          }
        }
      `}</style>
    </ContentWrapper>
  );
}
