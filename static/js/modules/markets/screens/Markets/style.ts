import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .Markets {
    display: flex;
    flex-direction: column;
    color: #ffffff;
    &__table {
      padding: 32px;
      background: linear-gradient(180deg, rgba(28, 22, 91, 0.3) 0%, rgba(28, 22, 91, 0.1) 103.62%);
      border-radius: 24px;
      margin-top: 20px;
      &__title {
        font-weight: 600;
        font-size: 39px;

        @include respond-to(sm) {
          text-align: center;
        }
      }
      &__marketSize {
        margin-bottom: 25px;
      }
    }
    &__mobile--cards {
      display: none;
      @include respond-to(sm) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }

  .TotalFeesLock {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(28, 22, 91, 0.3) 0%, rgba(28, 22, 91, 0.1) 103.62%);
    z-index: 1000;
    padding-bootm: 32px;
    backdrop-filter: blur(15px);
    background-repeat: no-repeat;
    background-size: cover;
    @include respond-to(xs) {
      flex-direction: column;
    }
    @include respond-to(sm) {
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 740px) {
    .TotalFeesLock {
      /* display: none; */
    }
    .PlatformFeesPaidToLocked {
      margin-bottom: 16px;
    }
  }
`;

export default staticStyles;
