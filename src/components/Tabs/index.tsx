import type { ComponentPropsWithoutRef, ElementType } from "react";
import "./Tabs.css";

type TabItem<V extends string, T extends ElementType> = {
  value: V;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "onClick" | "tabIndex">;

export type TabsProps<V extends string, T extends ElementType = "button"> = {
  activeTab: V;
  tabs: Array<TabItem<V, T>>;
  onTabChange?: (tab: V) => void;
  tabComponent?: T;
  variant?: "table" | "chips";
};

export default function Tabs<
  V extends string,
  T extends ElementType = "button"
>({
  activeTab,
  tabs,
  onTabChange,
  tabComponent,
  variant = "chips",
}: TabsProps<V, T>) {
  const TabComponent = (tabComponent ?? "button") as ElementType;

  return (
    <nav className={`tabs tabs--${variant}`}>
      {tabs.map(({ value, ...otherProps }) => (
        <TabComponent
          key={value}
          className={`tab ${activeTab === value ? "is-active" : ""}`}
          tabIndex={activeTab === value ? -1 : 0}
          onClick={onTabChange ? () => onTabChange(value) : undefined}
          {...otherProps}
        />
      ))}
    </nav>
  );
}
