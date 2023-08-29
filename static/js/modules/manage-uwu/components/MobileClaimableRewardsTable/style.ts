import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .MobileClaimbelRewardsList {
    &__claim-button {
      width: 71px;
      height: 33px;
      min-height: 33px;
      font-size: 14px;
      background: rgba(100, 92, 192, 0.4);
      border: 1px solid #8079cb;
      border-radius: 24px;
    }

    &__row {
      display: flex;
      flex-direction: column;
      width: 100%;

      &__cell {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 40px;

        &__icon {
          width: 24px;
          height: 24px;
        }

        &__label {
          margin-left: 12px;
        }
      }

      &__cell-symbol {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 32%;
      }

      &__cell-value {
        width: 32%;
        &__amount {
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.01em;
          color: #ffffff;
        }

        &__amount-in-usd {
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }

    &__row {
      border-right-style: solid;
      border-right-width: 1px;
      border-color: rgba(255, 255, 255, 0.05);
    }

    &__row:nth-child(3) {
      border: none;
    }

    &__title {
      font-weight: 600;
      font-size: 39px;
      line-height: 47px;
      letter-spacing: 0.005em;
      color: #ffffff;

      @include respond-to(sm) {
        font-size: 24px;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
    &__content {
      &__list-items {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: start;
        &__container {
          border-right: 1px solid;
          border-right-color: rgba(255, 255, 255, 0.1);
          padding: 0px 32px 50px 0px;
        }
      }
    }
    &__info {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 60px;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 8px 8px;
    }
    &__symbol {
      width: 50px;
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: 0.01em;
      color: #ffffff;
    }
    &__label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 75px;
      max-width: 75px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
    }
    &__footer {
      gap: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &__fees {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 16px;

        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        color: #ffffff;

        span {
          font-weight: 600;
          font-size: 27px;
          line-height: 32px;
          margin-left: 2px;
        }
      }
      &__buttonClaim {
        background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
        border-radius: 24px;
        padding: 12px 18px;
        gap: 8px;
        height: 44px;
        width: 130px;

        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
        letter-spacing: 0.01em;
        color: #ffffff;
      }
    }
  }

  .Table__MobileClaimableRewards {
    @include respond-to(sm) {
      width: 100%;
    }
  }
`;

export default staticStyles;
