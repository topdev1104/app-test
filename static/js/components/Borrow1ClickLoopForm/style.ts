import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .AmountField {
    &__wrapper {
      // border-radius: 8px;
      // border: 1px solid #493fb5;
    }
    width: 100%;
  }
  .Value__value {
    z-index: 0;
  }
  .SelectTokenField .DropdownWrapper__content {
    margin-top: 54.5px;
    margin-bottom: 54.5px;
    background: transparent;
  }

  .SelectTokenField__items {
    background: #0d093f;
    border: 1px solid #493fb5;
    border-radius: 16px;
  }

  .SelectTokenField__select {
    background: #0d093f;
    border: 1px solid #493fb5;
    border-radius: 16px;
  }

  .Row__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
  }

  .Borrow1ClickLoopForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
    gap: 24px;
    width: 680px;
    height: 100%;
    filter: drop-shadow(0px 4px 4px rgba(4, 2, 27, 0.2));
    backdrop-filter: blur(15px);
    border-radius: 24px;
    margin-bottom: 50px;

    @include respond-to(xs) {
      width: 100%;
    }

    &__title {
      margin-bottom: 20px;
      color: white;
      font-weight: 600;
      font-size: 23px;
    }

    &__description {
      width: 100%;
      max-width: 660px;
      text-align: center;
      color: #8d8f99;
      margin-bottom: 20px;
    }

    &__inner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;
      width: 100%;

      p {
        font-size: 12px;
        text-align: center;
      }
    }

    &__select {
      margin-top: 20px;

      p {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }

    &__select-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      padding: 10px;
      cursor: pointer;

      &__icons {
        display: felx;
        flex-direction: row;
        align-items: center;
      }
      span {
        color: white;
        cursor: pointer;
      }
    }

    &__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__content-information {
      background: rgba(57, 48, 159, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
    }

    &__status-label {
      b {
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
      }
    }
  }
`;

export default staticStyles;
