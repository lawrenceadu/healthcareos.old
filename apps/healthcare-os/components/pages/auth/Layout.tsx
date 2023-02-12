import { HtmlHTMLAttributes } from 'react';

export default function Layout({
  children,
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="h-screen w-screen flex justify-center overflow-y-auto">
      <div className="w-full max-w-[442px] px-6 my-auto py-6">{children}</div>
    </div>
  );
}
