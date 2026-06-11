interface Props {
  textColor: string;
  backgroundColor: string;
  name: string;
}

export const CategoryPill = ({ textColor, backgroundColor, name }: Props) => {
  return (
    <div
      className={`${textColor} ${backgroundColor} rounded-3xl px-3 py-1 inline font-medium`}
    >
      {name}
    </div>
  );
};