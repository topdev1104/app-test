import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .NFTContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: white;

    padding: 0px 20px;

    &__select-collection {
      display: flex;
      flex-direction: row;
      algine-items: center;
      width: 450px;

      &__label {
        width: 50%;
        font-size: 16px;
        font-weight: bold;
      }
    }

    &__list {
      width: 715px;
      heigth: 482px;
      // background: #120d48;
      padding: 20px;
      border-radius: 8px;
    }

    &__collection-name {
      margin-top: 32px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &__name {
        line-height: 23px;
        font-weight: 600;
        font-size: 19px;
      }

      &__selected-nft {
        letter-spacing: 0.005em;
        font-weight: 400;
        line-height: 20px;
        font-size: $medium;
      }
    }

    &__list-cards {
      margin-top: 24px;
      display: flex;
      flex-direction: column;

      overflow: auto;

      width: 680px;
      height: 482px;

      ::-webkit-scrollbar {
        width: 6px;
        heigth: 20px;
      }

      ::-webkit-scrollbar-track {
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      &__row {
        margin: 10px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 16px;

        &__card {
          width: 158px;
          height: 265px;
          cursor: pointer;

          background: #1c165b;
          box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.02);
          border-radius: 16px;
          &__description {
            padding: 0px 8px;
          }

          &__image {
            border-radius: 16px 16px 0px 0px;
            width: 100%;
            img {
              width: 100%;
              border-top-left-radius: 16px;
              border-top-right-radius: 16px;
            }
          }

          &__collectionName {
            margin-top: 8px;
            font-size: $extraSmall;
            font-weight: 400;
            line-height: 12px;
            color: rgba(255, 255, 255, 0.6);
          }

          &__title {
            margin-top: 4px;
            font-size: $small;
            line-height: 16px;
            font-weight: 600;
          }

          &__container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
          }

          &__container-left {
            display: flex;
            flex-direction: row;
            align-items: center;

            font-weight: 600;
            line-height: 16px;

            &__tokenIcon {
              margin-right: 4px;
              height: 24px;
              width: 24px;
            }
            &__price {
              margin-left: 10px;
              margin-right: 5px;
            }

            &__button {
              padding-top: 5px;
              background-image: url('../../images/nft/checkbox-selected.svg');
              background-repeat: no-repeat;
              height: 24px;
              width: 24px;
            }
          }
        }

        &__card-selected {
          border: 2px solid #8079cb;
        }
      }
    }

    &__select-option {
      padding: 7px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &:disabled {
        cursor: default;
      }
      p {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        transition: $transition;
        font-size: $regular;
        @include respond-to(xl) {
          font-size: $small;
        }
        @include respond-to(sm) {
          font-size: $medium;
        }
      }
    }

    &__total {
      width: 100%;
      background-image: url('../../images/nft-main.png');
      background-size: cover;
      height: 460px;
      padding: 20px;
      margin-top: 185px;
      margin-right: 15px;
      border-radius: 8px;

      &__uwuGet {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 68px;
        backgroundcolor: rgba(57, 48, 159, 0.1);
        padding: 24px 16px 24px 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
      }

      &__nfts {
        margin-top: 24px;
        height: 104px;
        backgroundcolor: rgba(57, 48, 159, 0.1);
        padding: 24px 16px 24px 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
      }
    }
  }

  .dropdown {
    margin-top: 35px;
    max-width: 343px;
    position: relative;
    width: 259px;
    &__button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      line-height: 18px;
      color: #fff;
      width: 100%;
      text-align: left;
      background: #1c165b;
      border: 1px solid #493fb5;
      border-radius: 8px;
      height: 50px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 15px;
      padding-right: 40px;
      cursor: pointer;
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        // background: url("../../images/arrowDropDown.svg") 100% 100%;
        pointer-events: none;
        transition: 200ms ease;
      }
      &_active {
        &::after {
          transform: translateY(-50%) rotate(-180deg);
        }
      }
    }
    &__list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      position: absolute;
      left: 0;
      top: 50px;
      box-shadow: 0px 10px 20px 0px #88919d4d;
      border: 1px solid #e6eaed;
      border-radius: 4px;
      background: #1c165b;
      overflow: hidden;
      width: 100%;
      z-index: 1;
      opacity: 0;
      visibility: hidden;
      transition: 200ms ease;
      &_visible {
        opacity: 1;
        visibility: visible;
      }
      &-item {
        margin: 0;
        padding: 0;
        padding: 15px;
        cursor: pointer;
        font-size: 15px;
        line-height: 18px;
        color: #fff;
        transition: 200ms ease;
        &_active {
          background: #1c165b;
        }
        &:hover {
          background: #f5f8fa90;
        }
      }
    }
    &__input {
      &_hidden {
        display: none;
      }
    }
  }

  .NFTButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 24px;

    &__loader {
      width: 22px;
      height: 22px;
      border: 5px solid #fff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    &__approve {
      background: #6ac9ff;
      padding: 7px 9px;

      height: 34px;
      text-align: center;
      background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
      border-radius: 24px;
      cursor: pointer;
      margin-top: 10px;
    }
    &__redeem {
      background: #6ac9ff;
      padding: 12px 18px;
      width: 180px;
      height: 44px;
      text-align: center;
      background: rgba(100, 92, 192, 0.4);
      border: 1px solid #8079cb;
      border-radius: 24px;
      cursor: pointer;
    }

    &__disabled {
      background: rgba(100, 92, 192, 0.4) !important;
      color: grey;
      cursor: auto;
    }
  }

  @media screen and (min-width: 1440px) {
    .NFTContainer {
      &__collection-name {
        width: 94%;
      }

      &__total {
        margin-top: 25px;
        width: 75%;
      }
      &__list {
        width: 100%;
      }
      &__list-cards {
        width: 100%;
        &__row {
          justify-content: center;
        }
      }
    }
  }

  @media screen and (min-width: 1677px) {
    .NFTContainer {
      &__collection-name {
        width: 96%;
      }

      &__total {
        margin-top: 25px;
        width: 70%;
      }
      &__list {
        width: 100%;
      }
      &__list-cards {
        width: 100%;
        &__row {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }

  @media screen and (min-width: 1920px) {
    .NFTContainer {
      &__collection-name {
        width: 97%;
      }
      &__total {
        margin-top: 25px;
        width: 65%;
      }
    }
  }

  @media screen and (min-width: 2560px) {
    .NFTContainer {
      &__collection-name {
        width: 98.5%;
      }
      &__total {
        margin-top: 25px;
        width: 68%;
      }
      &__list {
        width: 100%;
      }
      &__list-cards {
        width: 100%;
        &__row {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .NFTContainer {
      flex-direction: column-reverse;

      &__collection-name {
        width: 94%;
      }

      &__list {
        width: 97%;
      }

      &__list-cards {
        width: 100%;

        &__row {
          width: 100%;
        }
      }

      &__total {
        margin-top: 25px;
      }
    }
  }

  @media screen and (max-width: 425px) {
    .NFTContainer {
      flex-direction: column-reverse;
      width: 100%;
      &__total {
        width: 100%;
        margin-top: 25px;
      }
      &__list {
        width: 105%;
      }
      &__list-cards {
        width: 100%;
        &__row {
          justify-content: center;
        }
      }
    }
    .NFTButtons {
      &__approve {
        width: 150px;
      }
      &__redeem {
        width: 150px;
      }
    }

    @media screen and (max-width: 375px) {
      .NFTContainer {
        &__total {
          width: 118%;
        }
        &__list {
          width: 118%;
        }
        &__list-cards {
          &__row {
            width: 100%;
          }
        }
      }
    }
  }
`;

export default staticStyles;
