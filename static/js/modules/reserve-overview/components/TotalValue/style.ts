import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TotalValue {
    display: flex;
    justify-content: center;
    min-width: 350px;
    @include respond-to(xl) {
      min-width: 300px;
    }
    @include respond-to(lg) {
      min-width: 190px;
    }
    @include respond-to(md) {
      min-width: 200px;
    }
    @include respond-to(sm) {
      min-width: 100%;
      order: 1;
      margin-bottom: 30px;
    }

    &__green {
      @include respond-to(sm) {
        justify-content: center;
      }
      .Value {
        align-items: flex-start;
        @include respond-to(sm) {
          align-items: center;
        }
      }
      .Value .Value__value {
        &:after {
          left: 0;
        }
      }
    }
    &__red {
      .Value {
        align-items: flex-start;
      }
      @include respond-to(sm) {
        justify-content: center;
      }

      .TotalValue__title {
        @include respond-to(sm) {
          flex-direction: row;
        }
        i {
          margin-left: 0 !important;
          margin-right: 5px;
          border-radius: 8px;
        }
      }
      .Value {
        @include respond-to(sm) {
          align-items: center;
        }
      }
      .Value .Value__value {
        &:after {
          right: 0;
        }
      }
    }

    &__inner {
      display: flex;
      flex-direction: column;
      justify-content: center !important;

      @media (max-width: 540px) {
        justify-content: start !important;
        align-items: start !important;
        width: 100%;
        .Value__subValue--line {
          width: 100% !important;
        }
      }
    }

    .TotalValue__title {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.8);

      @include respond-to(xl) {
        font-size: $small;
      }
      @include respond-to(lg) {
        font-size: $extraSmall;
      }
      @include respond-to(md) {
        font-size: $small;
      }
      @include respond-to(sm) {
        font-size: $regular;
        font-weight: 400;
      }
      i {
        display: block;
        width: 15px;
        height: 15px;
        @include respond-to(xl) {
          width: 8px;
          height: 8px;
          margin-left: 3px;
        }
        @include respond-to(lg) {
          width: 6px;
          height: 6px;
        }
        @include respond-to(md) {
          width: 8px;
          height: 8px;
        }
        @include respond-to(sm) {
          margin-left: 5px;
        }
      }
    }

    .Value .Value__value {
      position: relative;
      margin-bottom: 6px;
      font-weight: 800;
      font-size: 23px;
      line-height: 28px;
      margin-top: 8px;
      @include respond-to(xl) {
        font-size: 20px;
      }
      @include respond-to(lg) {
        font-size: $medium;
        margin-bottom: 4px;
        padding-bottom: 4px;
      }
      @include respond-to(md) {
        font-size: 20px;
        margin-bottom: 6px;
        padding-bottom: 6px;
      }
      @include respond-to(sm) {
        font-size: 30px;
      }
    }

    .Value .SubValue {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.6);

      @include respond-to(xl) {
        font-size: $extraSmall;
      }
      @include respond-to(sm) {
        font-size: $medium;
        font-weight: 400;
      }
    }
  }
`;

export default staticStyles;
