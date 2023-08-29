import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .Caption {
    &__primary h2 {
      font-weight: 600;
      font-size: 23px;
      line-height: 28px;
      text-align: center;
      letter-spacing: -0.02em;
    }
  }

  .VaultForm {
    margin: 0 auto;
    padding-left: 117px;
    padding-right: 117px;

    .FormName {
      color: white;
      font-weight: 600;
      font-size: 19px;
      line-height: 23px;
      margin-bottom: 24px;
      margin-top: 32px;
    }
    h2 {
      font-weight: 600;
      font-size: 23px;
      line-height: 28px;
      letter-spacing: -0.02em;
      color: #ffffff;
      text-align: center;
      margin-bottom: 16px;
    }
    .Caption {
      &__description {
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        margin-bottom: 40px;
      }
    }
    .TableButtonsWrapper {
      margin: 0 auto;
    }

    &__warning {
      max-width: 430px;
      margin: 0 auto;
      text-align: center;
      font-size: $medium;
      @include respond-to(xl) {
        max-width: 335px;
        font-size: $small;
      }
      @include respond-to(lg) {
        font-size: $extraSmall;
      }
      @include respond-to(md) {
        font-size: $small;
      }
      @include respond-to(sm) {
        font-size: $medium;
      }
    }

    &__buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 50px;

      .Button {
        width: 273px;
      }
      @include respond-to(sm) {
        margin-bottom: 50px;
      }

      &__button-deposit {
        width: 50% !important;
        margin: 0 auto;
      }
    }

    &__field {
      width: 100% !important;
    }
  }

  .VaultOverview__form {
    background: #120d48;
    border-radius: 8px;
    padding: 12px;
    width: 100%;
    &__vault {
      margin-top: 24px;
      &__wrapper {
        background: rgba(57, 48, 159, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 24px;
      }

      &__title {
        color: white;
        font-weight: 600;
        font-size: 19px;
        line-height: 23px;
      }

      &__values {
        display: flex;
        flex-direction: column;

        &__row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          color: #ffffff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
          padding-top: 16px;
        }

        &__sub-row,
        &__sub-row-first {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          color: #ffffff;
          padding-top: 16px;
        }

        &__sub-row-first {
          padding-top: 0;
        }
      }

      &__apy {
        color: #3ae47c;
      }
    }
  }

  @media (max-width: 540px) {
    .AmountField {
      width: 100% !important;
    }
    .Button__mobileBig {
      min-height: 35px;
      width: 180px !important;
    }
    .VaultForm {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .TabsVault {
    &__buttons {
      background: #0d0745;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      width: 240px;
      height: 51px;
      display: flex;
      flex-direction: row;
      color: white;
      font-weight: 400;
      font-size: 16px;
      justify-content: center;
      align-items: center;
    }

    &__button,
    &__button-active {
      width: 105px;
      height: 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    &__button-active {
      background: #312893;
      border-radius: 8px;
    }
  }

  .CurrencySwitcher {
    &__buttons {
      display: flex;
      flex-direction: row;
      color: white;
      margin-top: 16px;

      &__button,
      &__button-active {
        width: 78px;
        height: 35px;
        left: 2px;
        top: 310px;
        border-radius: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #39309f;
        cursor: pointer;
      }

      &__button:nth-child(1),
      &__button-active:nth-child(1) {
        margin-right: 16px;
      }

      &__button-active {
        background: #312893;
      }
    }
  }
`;

export default staticStyles;
