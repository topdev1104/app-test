import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  .Loop {
    &__header {
      display: flex;
      flex-direction: row;
      color: white;
      margin-top: 28px;
      padding-left: 32px;
      padding-right: 32px;
    }

    &__header-column {
      display: flex;
      flex-direction: column;
      //background: #2ebac6;
      width: 80%;
    }
    &__header-column-inline {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      //background: #2ebac6;
      width: 20%;
    }

    @media (max-width: 540px) {
      &__header-column {
        width: 50%;
      }
      &__header-column-inline {
        width: 50%;
      }
    }
    h1 {
      margin-bottom: 16px;
    }
    h2 {
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
    }
  }

  .LoopCurrencyWrapper {
    padding-left: 32px;
    padding-right: 32px;
  }

  .LoopCurrency {
    color: white;
    background: #120d48;
    border-radius: 8px;
    margin-top: 32px;
    padding-left: 49px;
    padding-right: 49px;
    padding-top: 18px;
    padding-bottom: 18px;

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 11px;
    }
    &__metrics {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &__column {
        &__title {
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          margin-bottom: 4px;
          text-align: center;
        }
        &__value,
        &__sub-value {
          font-weight: 600;
          font-size: 20px;
          line-height: 24px;
          text-align: center;
        }
      }

      &__divider {
        margin-top: 25px;
        &:after {
          content: ' ';
          border: 1px solid rgba(255, 255, 255, 0.6);
          top: 35%;
          right: 0;
          height: 30%;
          margin-top: auto;
          margin-bottom: auto;
        }
      }
    }

    @media (max-width: 540px) {
      &__metrics {
        display: none;
      }
    }
  }

  .LoopContent {
    background: #120d48;
    border-radius: 8px;
  }
`;

export default staticStyles;
