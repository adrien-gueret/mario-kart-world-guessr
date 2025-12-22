import ReactCalendar, { type CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useTranslations } from "@/i18n";

import Icon from "../Icon";

import "./Calendar.css";

type Props = Pick<
  CalendarProps,
  "onClickDay" | "defaultValue" | "tileClassName"
>;

export default function Calendar({
  onClickDay,
  defaultValue,
  tileClassName,
}: Props) {
  const { currentLocale } = useTranslations();

  return (
    <ReactCalendar
      locale={currentLocale}
      onClickDay={onClickDay}
      defaultValue={defaultValue}
      tileClassName={tileClassName}
      minDate={new Date("2025-07-10")}
      maxDate={new Date()}
      prevLabel={
        <Icon>
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </Icon>
      }
      nextLabel={
        <Icon>
          <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </Icon>
      }
      view="month"
      prev2Label={null}
      next2Label={null}

      /*tileContent={({ activeStartDate, date, view }) =>
                  view === "month" && date.getDay() === 0 ? (
                    <p>It's Sunday!</p>
                  ) : null
                }*/
    />
  );
}
