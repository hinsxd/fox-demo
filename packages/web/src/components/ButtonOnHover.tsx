import React, { useState } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';

const ButtonOnHover: React.FC<
  { primary?: string; secondary?: string } & ButtonProps
> = ({ primary, secondary, ...props }) => {
  const [hovered, setHovered] = useState(false);
  const text = hovered ? secondary : primary;
  return (
    <Button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {text}
    </Button>
  );
};
export default ButtonOnHover;
