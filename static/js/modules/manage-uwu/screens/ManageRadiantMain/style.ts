import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ant-list-item-meta-title {
    color: white !important;
  }

  .ant-list-item-meta-description {
    color: white !important;
  }

  .ant-list-item {
    padding: 0px !important;
  }

  .DepositButton {
    width: 160px;
    border-radius: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .DepositButton:disabled {
    color: grey !important;
  }

  .DepositButton:hover {
    color: white;
  }

  .nft-list,
  .ntf-list-lock {
    /* cursor: pointer; */
    padding: 5px !important;
    border-style: solid;
    border-width: 2px;
    border-radius: 15px;
    border-color: rgba(255, 0, 0, 0);
    margin-bottom: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .nft-list.selected {
    border-color: #493fb5;
  }

  .nft-list:hover {
    cursor: pointer;
    border-color: #493fb5;
  }

  .ManageUwu {
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.6);

    .vestIntro {
      font-weight: 400;
      font-size: 16px;
    }

    .container {
      display: flex;
      width: 100%;

      .child {
        width: 50%;

        &__penalty {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: end;
        }
      }

      .child:nth-child(2) {
        display: flex;
        justify-content: end;
      }
    }

    &__left-container {
      display: flex;
      flex-direction: column;
      align-self: self-start;
      width: 100%;

      &__informStringAndSwitch {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        color: #ffffff;
        margin-bottom: 20px;
        margin-top: 20px;

        background: linear-gradient(
          90deg,
          rgba(49, 40, 147, 0.34) 0%,
          rgba(251, 81, 130, 0.2) 50.89%,
          rgba(73, 63, 181, 0.34) 100%
        );

        border-radius: 60px;

        &__textInfo {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;

          &__span {
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;
          }

          @include respond-to(xs) {
            display: none;
          }
        }

        &__blockSwitch {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          &__switchInfo {
            width: 225px;
            height: 24px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
            font-size: 10px;
            line-height: 12px;
            text-align: center;
          }
        }
      }
    }

    &__card-title {
      font-weight: 600;
      font-size: 39px;
      line-height: 47px;
      color: #ffffff;
      margin-bottom: 25px;

      @include respond-to(sm) {
        font-size: 24px;
      }
    }

    &__card-container {
      display: flex;
      flex-direction: row;

      @include respond-to(sm) {
        flex-direction: column;
      }
    }

    &__right-container {
      width: 100%;
      margin-left: 30px;

      @include respond-to(lg) {
        width: 30%;
      }

      @include respond-to(md) {
        width: 100%;
        margin-left: 0;
        margin-top: 30px;
      }
    }

    &__content-card {
      background-color: #120d48;
      border-radius: 8px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      padding: 20px 20px;
      color: white;
    }
  }

  .ContentWrapperWithTopLine__content {
    padding: 20px;
    display: flex;
    justify-content: space-between;

    @include respond-to(sm) {
      flex-direction: column;
      padding: 0;
      width: 100%;
    }
  }

  .data-grid {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 24.5px;
    margin-top: 20px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.014em;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20px;

    @include respond-to(sm) {
      justify-content: space-between;
    }
    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        font-weight: 600;
        font-size: 19px;
        line-height: 23px;
        color: #ffffff;
      }
    }
    &__grid:nth-child(1) {
      margin-left: 40px;
    }
    &__grid:nth-child(2) {
      margin-right: 40px;
    }
    &__grid-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      &__title {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        span {
          font-weight: 600;
          font-size: 19px;
          line-height: 23px;
          color: #ffffff;
        }
      }
      &__desc {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .ManageUwu__content-item {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: linear-gradient(180deg, rgba(28, 22, 91, 0.3) 0%, rgba(28, 22, 91, 0.1) 103.62%);
    box-shadow: 0px 4px 4px rgba(4, 2, 27, 0.2);
    border-radius: 24px;
    padding: 32px;
    width: 50%;

    .ManageUwu__content-title {
      span {
        font-size: 18px;
      }
    }

    @include respond-to(sm) {
      width: 100%;
      padding: 10px;
    }
  }
  .ManageUwu__content-item:nth-child(2) {
    margin-left: 10px;

    @include respond-to(sm) {
      margin: 0;
    }
  }

  .ManageUwuMain__top {
    display: flex;
    gap: 30px;

    @include respond-to(sm) {
      flex-direction: column;
    }
  }

  .ManageUwuMain {
    &__top-revenue {
      flex: 1;
      display: flex;
      flex-direction: column;

      @include respond-to(xs) {
        /* display: none; */
        /* padding: 0; */
      }
    }

    &__top-revenue-first {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 33.3%;
    }

    &__revenue-item {
      width: 100%;
      margin-right: 10px;

      @include respond-to(xs) {
        margin-right: 0;
        margin-bottom: 20px;
      }

      &__main-title {
        font-weight: 600;
        font-size: 39px;
        line-height: 47px;
        letter-spacing: 0.005em;
        color: #ffffff;
      }
      &__container {
        width: 100%;
        height: 100%;
        background: linear-gradient(
          108.66deg,
          rgba(160, 175, 255, 0.02) 0.33%,
          rgba(182, 255, 237, 0.02) 99.67%
        );
        backdrop-filter: blur(2px);
        border-radius: 16px;
        width: 100%;
        padding: 30px 24px 47px 24px;
        gap: 32px;
      }
      &__header {
        display: flex;
        clex-direction: row;
        align-items: center;
        justify-content: center;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
  }

  .ManageUwuRewards {
    background: linear-gradient(180deg, rgba(28, 22, 91, 0.3) 0%, rgba(28, 22, 91, 0.1) 103.62%);
    box-shadow: 0px 4px 4px rgba(4, 2, 27, 0.2);
    backdrop-filter: blur(15px);
    border-radius: 24px;
    padding: 24px 24px 32px 24px;

    @include respond-to(xs) {
      display: none;
    }
  }

  .MobileManageUwuRewards {
    display: none;
    @include respond-to(xs) {
      display: flex;
    }
  }

  .ButtonTabs {
    &__container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
`;

export default staticStyles;
