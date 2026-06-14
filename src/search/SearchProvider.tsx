import { type ReactNode } from "react";
import { liteClient } from "algoliasearch/lite";
import { InstantSearch, Configure, PoweredBy } from "react-instantsearch";

const searchClient = liteClient(
  "B11OT59J0Z",
  "f6b7b7c5a7058b85589ad5d2120f61de",
);

type Props = {
  children: ReactNode;
  authorId?: number;
  hitsPerPage?: number;
};

export default function SearchProvider({
  children,
  authorId,
  hitsPerPage = 1000,
}: Props) {
  const filters = [];

  if (authorId !== undefined) {
    filters.push(`author.id:${authorId}`);
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="photos" insights>
      <Configure filters={filters.join(" AND ")} hitsPerPage={hitsPerPage} />
      {children}

      <div style={{ width: 125, marginLeft: "auto" }}>
        <PoweredBy />
      </div>
    </InstantSearch>
  );
}
