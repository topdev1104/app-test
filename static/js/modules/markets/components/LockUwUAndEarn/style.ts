import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .LockUwUAndEarn {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 85%;
    padding: 16px 24px;
    align-items: stretch;
    margin: 53px 32px 54px 0;

    @include respond-to(sm) {
      width: 100%;
    }
    background: linear-gradient(
      108.66deg,
      rgba(160, 175, 255, 0.02) 0.33%,
      rgba(182, 255, 237, 0.02) 99.67%
    );
    backdrop-filter: blur(2px);
    border-radius: 16px;

    &__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      &__cardLockApr {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.014em;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: row;
        align-items: center;

        &__icon {
          margin-right: 10px;
          width: 32px;
          height: 32px;
        }

        &__title {
          margin-bottom: 6px;
        }

        &__apr {
          font-weight: 600;
          font-size: 19px;
          line-height: 23px;
          color: #ffffff;
        }
      }
    }

    &__body {
      margin-top: 17px;
      cursor: pointer;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;

      &__button {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #a49fda;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

    &__verticalDiv {
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 25px;
    }

    &__content {
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &__column {
        display: flex;
        flex-direction: column;
        margin-right: 12px;

        &__item {
          display: flex;
          flex-direction: row;
          width: 131px;
          height: 61px;
          margin-bottom: 8px;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          padding-left: 10px;
          padding-bottom: 13px;
          padding-top: 8px;

          &__info {
            display: flex;
            flex-direction: column;

            &__symbol {
              color: rgba(255, 255, 255, 0.6);
              font-weight: 400;
              margin-bottom: 4px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }

  .LockUwUAndEarn_mobile {
    color: white;
    padding: 16px 16px;

    background: linear-gradient(
      108.66deg,
      rgba(160, 175, 255, 0.02) 0.33%,
      rgba(182, 255, 237, 0.02) 99.67%
    );
    backdrop-filter: blur(2px);
    border-radius: 16px;

    &__header {
      font-weight: 700;
      font-size: 24px;
      color: rgb(255, 255, 255);

      @include respond-to(sm) {
        font-size: 18px;
      }

      &__selected-text {
        background: linear-gradient(rgb(160, 175, 255) 0%, rgb(182, 255, 237) 100%) text;
      }

      &__button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(90deg, rgb(73, 63, 181) 0%, rgb(49, 40, 147) 100%);
        border-radius: 8px;
        font-weight: 600;
        height: 44px;
        width: 204px;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
        color: rgb(255, 255, 255);
        cursor: pointer;
        margin-top: 17px;
        @include respond-to(sm) {
          width: 100%;
        }
      }
    }

    &__body {
      margin-top: 17px;
      cursor: pointer;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;

      &__button {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #a49fda;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

    &__verticalDiv {
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 25px;
    }

    &__content {
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &__column {
        display: flex;
        flex-direction: column;
        margin-right: 12px;

        &__item {
          display: flex;
          flex-direction: row;
          width: 131px;
          height: 61px;
          margin-bottom: 8px;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          padding-left: 10px;
          padding-bottom: 13px;
          padding-top: 8px;

          &__info {
            display: flex;
            flex-direction: column;

            &__symbol {
              color: rgba(255, 255, 255, 0.6);
              font-weight: 400;
              margin-bottom: 4px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }

  .LockUwUAndEarn_mobile {
    display: none;
  }

  @media only screen and (max-width: 540px) {
    .LockUwUAndEarn_mobile {
      display: flex;
      flex-direction: column;
    }

    .LockUwUAndEarn {
      display: none;

      &__header {
        width: 100%;
        font-weight: 700;
        font-size: 27px;
        line-height: 32px;
        color: rgb(255, 255, 255) &__button {
          width: 100%;
          margin-bottom: 16px;
        }
      }
    }
  }
`;

export default staticStyles;
