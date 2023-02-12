import React from 'react';
import { IconProps, Template } from './Template';

export default function XMark(props: IconProps) {
  return (
    <Template {...props}>
      <rect y="0.5" width="24" height="24" rx="12" fill="white" />
      <path
        d="M17 7.5L7 17.5M7 7.5L17 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
