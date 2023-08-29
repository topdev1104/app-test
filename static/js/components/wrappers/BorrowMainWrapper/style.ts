import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .BorrowMainWrapper {
    display: flex;
    flex: 1;
    @include respond-to(sm) {
      flex-direction: column;
    }

    &__left-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      @include respond-to(sm) {
        order: 1;
        display: block;
        flex: unset;
      }

      .ContentWrapperWithTopLine,
      .ContentWrapperWithTopLine__content,
      .BorrowMainWrapper__content {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .ContentWrapperWithTopLine__content {
        @include respond-to(xl) {
          padding: 20px;
        }
        @include respond-to(lg) {
          padding: 20px 15px;
        }
        @include respond-to(md) {
          padding: 20px 10px;
        }
      }
    }

    &__right-inner {
      width: 400px;
      margin-left: 20px;
      @include respond-to(xl) {
        width: 340px;
      }
      @include respond-to(lg) {
        width: 200px;
        margin-left: 10px;
      }
      @include respond-to(sm) {
        width: 100%;
        margin-left: 0;
        margin-bottom: 20px;
        order: 0;
      }
    }

    .BorrowMainWrapper__title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      padding-bottom: 23px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .BorrowMainWrapper__total {
      padding: 20px 15px;
      @include respond-to(xl) {
        padding: 15px 10px;
      }
      @include respond-to(lg) {
        padding: 10px;
      }
      @include respond-to(md) {
        padding: 15px 10px;
      }
      @include respond-to(sm) {
        padding: 15px 20px;
      }
    }

    .BorrowMainWrapper__changeMarket-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px 0 10px;
      font-size: $large;
      @include respond-to(xl) {
        margin: 20px 0 10px;
        font-size: $medium;
      }
      @include respond-to(lg) {
        font-size: $small;
      }
      @include respond-to(md) {
        font-size: $medium;
      }
      @include respond-to(sm) {
        margin: 30px 10px;
        font-size: $regular;
        order: 2;
      }
      .MarketSwitcher__text-button {
        font-size: $large;
        margin-left: 5px;
        @include respond-to(xl) {
          font-size: $medium;
        }
        @include respond-to(lg) {
          font-size: $small;
        }
        @include respond-to(md) {
          font-size: $medium;
        }
        @include respond-to(sm) {
          font-size: $regular;
        }
      }

      .MarketSwitcher__content {
        width: 130px;
      }
      .MarketSwitcher__title {
        font-size: $small;
        padding: 13px 5px;
      }
      .MarketSwitcher__subLogo {
        height: 39px;
      }
      .MarketSwitcher__market {
        height: 40px;
      }
      .MarketSwitcher__logo-inner {
        img {
          width: 65px;
          max-height: 16px;
        }
        span {
          font-size: $small;
        }
      }
      .MarketSwitcher__marketText {
        line-height: 1.3;
        font-size: $extraSmall;
        letter-spacing: 5px;
        left: 3px;
      }
    }
  }
`;

export default staticStyles;
