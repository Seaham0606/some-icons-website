# Category → icon mapping

**Source of truth:** [`category-icons.ts`](./category-icons.ts) (`CATEGORY_ICONS`). The app imports this at runtime; it is not generated from the CDN.

**When to update:** After the icon index exposes a new `icon.category` slug (new folder on the CDN), add a row to `CATEGORY_ICONS`: key = slug string, value = any valid Some Icons **icon name** (same ids used elsewhere with `SomeIcon`).

**Fallback:** Slugs missing from the map use `symbol-information-circle` via `getCategoryIcon`.

**Synthetic key:** `all` is only used for the filter store’s “every category” option, not from the index.
