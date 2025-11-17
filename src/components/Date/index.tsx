import { useTranslations } from "@/i18n";

import "./Date.css";

type Props = {
  date: Date;
};

export default function Date({ date }: Props) {
  const { currentLocale } = useTranslations();
  return (
    <time className="date" dateTime={date.toISOString()}>
      {new Intl.DateTimeFormat(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)}
    </time>
  );
}
