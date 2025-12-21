import { useEffect, useState, type ReactNode } from "react";
import { liteClient } from "algoliasearch/lite";
import { InstantSearch, Configure, PoweredBy } from "react-instantsearch";

const searchClient = liteClient(
  "B11OT59J0Z",
  "f6b7b7c5a7058b85589ad5d2120f61de"
);

type Props = {
  children: ReactNode;
  authorId?: number;
};

const getFiveMinutesAgo = () => Math.floor(Date.now() / 1000) - 5 * 60;

export default function SearchProvider({ children, authorId }: Props) {
  const [fiveMinutesAgo, setFiveMinutesAgo] = useState(getFiveMinutesAgo());

  useEffect(() => {
    const interval = setInterval(() => {
      setFiveMinutesAgo(getFiveMinutesAgo());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const filters = [`validatedAt <= ${fiveMinutesAgo}`];

  if (authorId !== undefined) {
    filters.push(`author.id:${authorId}`);
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="photos">
      <Configure filters={filters.join(" AND ")} />
      {children}

      <div style={{ width: 125, marginLeft: "auto" }}>
        <PoweredBy />
      </div>
    </InstantSearch>
  );
}
