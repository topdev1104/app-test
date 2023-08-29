import css from 'styled-jsx/css';
import AccordionFooterLockAndVesting from './index';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .Accordion {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    &__header {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 13px;
      display: flex;
      justify-content: flex-start;
    }

    &__header-column {
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.6);
      min-width: 33.3%;
    }

    &__body {
    }

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    &__column {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
      color: #ffffff;
      min-width: 33.3%;
    }
    .Accordion__header {
      margin-top: 15px;
    }
  }
`;

export default staticStyles;
