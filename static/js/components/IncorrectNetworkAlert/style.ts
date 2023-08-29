import css from 'styled-jsx/css';
import wrongNetworkBg from '../../images/wrong-network.svg';
import tokenEthIcon from '../../images/token-eth.svg';

/*language=SCSS*/
const staticStyles = css.global`
  .IncorrectNetworkAlert {
    background-color: #120d48;
    //background-image: url(${wrongNetworkBg});
    background-repeat: no-repeat;
    height: 78px;
    background-size: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    &__content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      &__titles {
        &__title {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          color: #ff8071;
        }

        &__sub-title {
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4px;
        }
      }

      &__button {
        margin-left: 67px;
      }
      &__button button {
        width: 189px;
        height: 36px;
        left: 772px;
        top: 12px;
        background: rgba(100, 92, 192, 0.4);
        border: 1px solid #8079cb;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 16px;
        &:before {
          content: ' ';
          background-image: url('${tokenEthIcon}');
          background-repeat: no-repeat;
          height: 16px;
          width: 16px;
          display: flex;
        }
      }
    }

    @media (max-width: 540px) {
      background-image: none;
      height: 85px;
      &__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        &__titles,
        &__sub-title {
          text-align: center;
        }
        &__button {
          margin-left: 0;
          margin-top: 5px;
        }

        &__button button {
          height: 30px;
        }
      }
    }
  }
`;

export default staticStyles;
