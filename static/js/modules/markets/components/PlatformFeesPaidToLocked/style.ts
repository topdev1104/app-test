import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .PlatformFeesPaidToLocked {
    color: white;
    border-radius: 8px;
    width: 100%;
    margin-right: 5px;
    padding: 20px;
    height: 432px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__header {
      font-style: normal;
      font-weight: 600;
      font-size: 39px;
      line-height: 47px;
      color: #ffffff;
      margin-top: 38px;
    }

    &__content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 551px;
      margin-top: 40px;

      @include respond-to(sm) {
        max-width: 100%;
      }
      &__total {
        font-style: normal;
        font-weight: 800;
        font-size: 39px;
        line-height: 47px;
        letter-spacing: -0.02em;
        background: linear-gradient(180deg, #a0afff 0%, #b6ffed 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
        margin-top: 16px;
        margin-bottom: 16px;
      }

      &__sub_title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
      }

      @include respond-to(xs) {
        &__fullyMarketCap,
        &__marketCap,
        &__supply {
          width: 33.3%;
        }
      }

      @include respond-to(sm) {
        &__fullyMarketCap,
        &__marketCap,
        &__supply {
          width: 100%;
        }
      }
    }

    &__footer {
      margin-top: 36px;

      @include respond-to(sm) {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      &__price {
        width: 263px;
        padding: 19px 16px;
        background: linear-gradient(
          108.66deg,
          rgba(160, 175, 255, 0.02) 0.33%,
          rgba(182, 255, 237, 0.02) 99.67%
        );
        backdrop-filter: blur(2px);
        border-radius: 40px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;

        &__button {
          width: 90.1px;
          display: flex;
          justify-content: space-evenly;
          flex-direction: row;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          color: #a49fda;
        }
      }
    }
  }
`;

export default staticStyles;
