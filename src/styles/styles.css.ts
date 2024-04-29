import { createTheme, style } from "@vanilla-extract/css";

export const [_, vars] = createTheme({
  color: {
    white: "#f8f4f8",
  },
});

export const headerStyle = style({
  display: 'flex',
  height: 200,
  border: '1px solid red',
});