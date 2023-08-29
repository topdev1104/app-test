import staticStyles from './style';

interface PageHeaderProps {
  text: string;
}
export default function PageHeader({ text }: PageHeaderProps) {
  return (
    <>
      <h1 className="PageHeader">{text}</h1>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
