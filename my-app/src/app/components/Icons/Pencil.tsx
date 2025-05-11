import * as React from "react";
import { SVGProps } from "react";

const Pencil = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="m15.167 6.417 6.416 6.416-1.667 1.667-6.416-6.417 1.667-1.666Zm-2.334 2.333L4.083 17.5v6.417H10.5l8.75-8.75-6.417-6.417Zm-3.5 13.416H5.833v-3.5l.875-.875 3.5 3.5-.875.875Z" />
  </svg>
);

export default Pencil;