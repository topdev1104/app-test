import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableButtonsWrapper {
    display: flex;
    gap: 12px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    //max-width: 200px;
    margin-left: auto;
    @include respond-to(xl) {
      flex-wrap: wrap;
      //max-width: 160px;
    }
    @include respond-to(lg) {
      flex-wrap: nowrap;
      //max-width: 180px;
    }
    @include respond-to(md) {
      //max-width: 160px;
    }
  }
`;

export default staticStyles;
