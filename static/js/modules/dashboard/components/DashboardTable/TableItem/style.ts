import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    position: relative;
    margin-bottom: 6px;
    min-height: 70px;
    @include respond-to(xl) {
      min-height: 60px;
    }
    @include respond-to(lg) {
      min-height: 55px;
    }

    &__withInfo {
      position: relative;
      margin-bottom: 35px;
    }

    .TableItem__inner {
      align-items: flex-start;
    }

    &__assetColor {
      display: inline-block;
      position: absolute;
      left: 0;
      width: 2px;
      height: 25px;
    }

    .TableItem__token {
      margin-left: 10px;
      display: flex;
      .TokenIcon__name {
        font-size: $medium;
        color: #ffffff;
      }
      .TokenIcon__image {
        margin-right: 5px;
      }
      .MultipleIcons {
        margin-right: 5px;
        .TokenIcon__image {
          margin-right: 0;
        }
      }
    }

    .TableCol {
      min-width: 80px;
    }

    .Value {
      .Value__Value {
        font-weight: 500;
        line-height: 19px;
        font-size: $medium;
        letter-spacing: 0.16px;
      }
      .SubValue {
        @include respond-to(xl) {
          font-size: $small;
        }
        @include respond-to(lg) {
          font-size: $extraSmall;
        }
      }
    }
  }
`;

export default staticStyles;
