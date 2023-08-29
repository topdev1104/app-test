import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { LOGO_3 } from '../../ui-config';
import { getDefaultProvider } from 'ethers';
import staticStyles from './style';

interface FooterProps {
  inside?: boolean;
}

export default function Footer({ inside }: FooterProps) {
  const [blockNumber, setBlockNumber] = useState('Fetching...');

  useEffect(() => {
    const provider = getDefaultProvider(1);

    provider.getBlockNumber().then((number) => {
      setBlockNumber(number.toString());
    });
  }, []);

  return (
    <footer className={classNames('Footer', { Footer__inside: inside })}>
      <div>
        <img src={LOGO_3} alt="" />
      </div>
      <div className="Footer__menu">
        <div className="Footer__menu__social">
          <a href="https://uwu.link/Discord" target="_blank" rel="noreferrer">
            Discord
          </a>
          <a href="https://www.twitter.com/uwu_lend" target="_blank" rel="noreferrer">
            Twitter
          </a>
        </div>
        <div className="Footer__menu__info">
          <a href="/nft">NFT</a>
          <a href="https://docs.uwulend.fi" target="_blank" rel="noreferrer">
            Docs
          </a>
        </div>
      </div>
      <div className="Footer__block">
        <div className="Footer__block__point"></div>
        Block: {blockNumber}
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </footer>
  );
}
