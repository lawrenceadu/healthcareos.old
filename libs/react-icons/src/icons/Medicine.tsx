import { Template, IconProps } from './Template';

function Medice({ variant = 'line', ...props }: IconProps) {
  return (
    <Template {...props}>
      {variant === 'line' && (
        <path
          d="M19 2V4H17V7C18.657 7 20 8.343 20 10V21C20 21.552 19.552 22 19 22H5C4.448 22 4 21.552 4 21V10C4 8.343 5.343 7 7 7V4H5V2H19ZM17 9H7C6.448 9 6 9.448 6 10V20H18V10C18 9.448 17.552 9 17 9ZM13 11V13H15V15H12.999L13 17H11L10.999 15H9V13H11V11H13ZM15 4H9V7H15V4Z"
          fill="currentColor"
        />
      )}

      {variant === 'solid' && (
        <path
          d="M17 5V7C18.657 7 20 8.343 20 10V21C20 21.552 19.552 22 19 22H5C4.448 22 4 21.552 4 21V10C4 8.343 5.343 7 7 7V5H17ZM13 11H11V13H9V15H10.999L11 17H13L12.999 15H15V13H13V11ZM19 2V4H5V2H19Z"
          fill="currentColor"
        />
      )}
    </Template>
  );
}

export default Medice;
