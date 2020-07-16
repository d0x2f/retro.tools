export const filterDataKeys = (props) =>
  Object.fromEntries(
    Object.entries(props).filter(([key]) => key.startsWith('data-'))
  );
