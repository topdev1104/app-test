import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ReserveInformation {
    max-width: 80%;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 30px;

    @include respond-to(xl) {
      margin-right: 20px;
    }

    @include respond-to(md) {
      display: block;
      margin: 0 0 10px 0;
      width: 100%;
      max-width: 100%;
    }
    @include respond-to(sm) {
      margin: 30px 0 0 0;
      display: block;
    }

    &__APY-info {
      margin-top: 16px;
      &__card-wrapper {
        width: 50%;
        margin-right: 16px;
        background: linear-gradient(
          180deg,
          rgba(140, 214, 255, 0.04) 0%,
          rgba(137, 255, 227, 0.1) 100%
        );
        backdrop-filter: blur(15px);
        border-radius: 16px;
      }

      &__card-wrapper-borrowing {
        width: 50%;
        background: linear-gradient(
          180deg,
          rgba(209, 151, 255, 0.04) 0%,
          rgba(255, 202, 139, 0.1) 100%
        );
        backdrop-filter: blur(15px);
        border-radius: 16px;
      }
    }

    @media (max-width: 540px) {
      &__APY-info {
        &__card-wrapper {
          width: 100%;
          margin-top: 16px;
        }

        &__card-wrapper-borrowing {
          width: 100%;
          margin-top: 16px;
        }
      }

      .APYCard {
        &__color {
          margin-right: 0;
          margin-left: 0;
        }
      }
    }

    &__title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 29px;
      @include respond-to(xl) {
        font-size: $small;
      }
      @include respond-to(sm) {
        font-size: $regular;
      }
    }

    &__title-mobile {
      display: none;
    }

    &__inner {
      display: flex;
      flex-direction: column;
      flex: 1;

      h1 {
        font-weight: 600;
        font-size: 39px;
        line-height: 47px;
        color: white;
        margin-bottom: 16px;
      }

      &__info {
        &__graph {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(
              108.92deg,
              rgba(98, 90, 187, 0.08) 0.3%,
              rgba(98, 90, 187, 0) 47.56%,
              rgba(98, 90, 187, 0.2) 100%
            ),
            linear-gradient(
              108.66deg,
              rgba(160, 175, 255, 0.02) 0.33%,
              rgba(182, 255, 237, 0.02) 99.67%
            );
          backdrop-filter: blur(2px);
          border-radius: 16px;
          padding: 24px;
          &__title {
            font-weight: 600;
            font-size: 23px;
            line-height: 28px;
            letter-spacing: 0.02em;
            color: #ffffff;
            margin-bottom: 4px;
          }
          &__inner {
            margin-top: 150px;
          }
        }

        &__graph-data {
          margin-top: -150px;
          margin-bottom: -200px;
          width: 100%;

          &__symbol {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 600;
            color: white;
            font-size: 23px;
          }

          &__symbol-mobile {
            display: none;
          }
          &__values {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
        }
      }

      @media (max-width: 540px) {
        .APYCard {
          &__color {
            //margin: 0;
          }
        }

        &__info {
          display: flex;
          flex-direction: column;

          &__graph {
            display: none;
            flex-direction: column;
            justify-content: space-between;
          }

          &__graph-data {
            width: 100%;
            margin-left: 0;
            display: flex;
            flex-direction: column;

            &__symbol {
              display: none;
              flex-direction: column;
              align-items: center;
              font-weight: 600;
              color: white;
              font-size: 23px;
            }

            &__symbol-mobile {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-weight: 600;
              color: white;
              font-size: 23px;
            }

            &__values {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 16px;
            }
          }
        }
      }
    }

    &__content {
      padding: 20px;
      flex: 1;
      border-radius: 8px;
      @include respond-to(xl) {
        padding: 10px;
      }
      @include respond-to(lg) {
        padding: 10px 5px;
      }
      @include respond-to(md) {
        padding: 20px 30px;
      }
      @include respond-to(sm) {
        padding: 0;
      }
    }

    &__top-info {
      display: none;
      @include respond-to(lg) {
        display: block;
        position: absolute;
        left: 5px;
        top: 5px;
      }
      @include respond-to(md) {
        display: none;
      }
      @include respond-to(sm) {
        position: static;
        margin-bottom: 30px;
        display: block;
      }
      .ReserveInformation__line {
        margin: 0;
        font-size: $extraSmall;
        @include respond-to(sm) {
          font-size: $regular;
          padding: 10px;
        }
        .TokenIcon__dollar,
        .Value .Value__value {
          font-size: $extraSmall;
          @include respond-to(sm) {
            font-size: $regular;
          }
        }
      }
    }

    &__graph-inner {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      @include respond-to(xl) {
        margin-bottom: 10px;
      }
      @include respond-to(md) {
        margin-bottom: 15px;
      }
      @include respond-to(sm) {
        flex-direction: column;
      }
    }

    &__middle-info {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      @include respond-to(xl) {
        margin-bottom: 20px;
      }
      @include respond-to(lg) {
        display: none;
      }
      @include respond-to(md) {
        display: flex;
      }
      @include respond-to(sm) {
        display: none;
      }
    }

    &__line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      border-radius: $borderRadius;
      margin: 0 15px;
      font-size: $regular;
      min-width: 300px;
      @include respond-to(xl) {
        min-width: 200px;
        font-size: $small;
      }
      .BlockWrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      strong {
        margin-left: 5px;
        white-space: nowrap;
      }
      .TokenIcon__dollar,
      .Value .Value__value {
        font-size: $regular;
        @include respond-to(xl) {
          font-size: $small;
        }
      }
    }

    &__APY-info {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      width: 100%;
      @include respond-to(xl) {
        margin-bottom: 25px;
      }
      @include respond-to(lg) {
        margin-bottom: 15px;
      }
      @include respond-to(md) {
        margin-bottom: 20px;
      }
      @include respond-to(sm) {
        margin-bottom: 35px;
        flex-direction: column;
      }
    }

    &__bottom-info {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      margin: 0 auto;
      padding: 32px;
      gap: 16px;

      @include respond-to(xl) {
        max-width: 1100px;
        justify-content: center;
      }

      @include respond-to(lg) {
        max-width: 600px;
        justify-content: center;
      }

      @include respond-to(md) {
        max-width: 750px;
      }
      @include respond-to(sm) {
        max-width: 100%;
      }
    }

    &__bottom-info-mobile {
      display: none;
      flex-direction: column;
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      max-width: 100%;
      background: #120d48;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
    }

    @include respond-to(sm) {
      &__bottom-info-mobile {
        display: flex;

        &__row {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          margin-top: 16px;
        }

        &__row:nth-child(2) {
          margin-top: 20px;
        }
      }

      &__bottom-info {
        display: none;
      }
    }

    &__poolLink-inner {
      position: relative;
      font-size: $medium;
      display: flex;
      align-items: center;
      @include respond-to(xl) {
        font-size: $small;
      }
      @include respond-to(lg) {
        justify-content: flex-end;
        text-align: right;
      }
      @include respond-to(md) {
        justify-content: flex-start;
        text-align: left;
      }
      @include respond-to(sm) {
        display: none;
      }
      img {
        width: 12px;
        height: 12px;
        margin-left: 5px;
      }
    }

    @media (max-width: 540px) {
      margin-top: 0;
      &__title-mobile {
        display: block;
        margin-bottom: 16px;
      }

      &__title {
        display: none;
      }
    }
  }

  .BackTo {
    color: #a49fda;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 130px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .gorizontalDiv {
    &__cards {
      margin-bottom: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .PlatformFeesPaidToLocked {
    &__footer {
      margin-top: 36px;
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

        &__symbol {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.014em;
          color: rgba(255, 255, 255, 0.6);
        }

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
