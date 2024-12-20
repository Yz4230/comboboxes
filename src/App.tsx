import {
  Combobox,
  ComboboxItem,
  ComboboxItemCheck,
  ComboboxLabel,
  ComboboxPopover,
  ComboboxProvider,
  useComboboxStore,
  useStoreState,
} from "@ariakit/react";
import { invariant } from "es-toolkit";
import { XIcon } from "lucide-react";
import { matchSorter } from "match-sorter";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useMemo,
  useRef,
} from "react";

const OPTIONS = [
  { value: "Apple", label: "🍎 Apple", keywords: ["りんご", "林檎"] },
  { value: "Grape", label: "🍇 Grape", keywords: ["ぶどう", "葡萄"] },
  { value: "Orange", label: "🍊 Orange", keywords: ["おれんじ", "オレンジ"] },
  { value: "Strawberry", label: "🍓 Strawberry", keywords: ["いちご", "苺"] },
  { value: "Watermelon", label: "🍉 Watermelon", keywords: ["すいか", "西瓜"] },
];

const valueToLabel = Object.fromEntries(
  OPTIONS.map((option) => [option.value, option.label]),
);

export default function App() {
  const store = useComboboxStore({ defaultSelectedValue: [] });
  const state = useStoreState(store);
  const ref = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => matchSorter(OPTIONS, state.value, { keys: ["label", "keywords"] }),
    [state.value],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && state.value === "") {
        store.setSelectedValue((prev) => prev.slice(0, -1));
      }
    },
    [state.value, store.setSelectedValue],
  );

  const handleRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.dataset.value;
      invariant(value != null, "value is required");
      store.setSelectedValue((prev) => prev.filter((v) => v !== value));
    },
    [store.setSelectedValue],
  );

  const getAnchorRect = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    return rect
      ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      : null;
  }, []);

  return (
    <main className="p-4">
      <h1 className="font-bold text-xl">Hello, world!</h1>
      <ComboboxProvider store={store}>
        <div className="flex flex-col">
          <ComboboxLabel className="pl-3">Your favorite fruit</ComboboxLabel>
          <Combobox
            autoSelect
            placeholder="e.g., Apple"
            onKeyDown={handleKeyDown}
            render={(props) => (
              <div
                ref={ref}
                className="flex w-80 flex-wrap gap-2 rounded border p-2 has-focus:ring"
              >
                {state.selectedValue.map((value) => (
                  <div
                    key={value}
                    className="flex shrink-0 items-center gap-1 rounded bg-gray-200 px-2 py-1 text-xs"
                  >
                    <span>{valueToLabel[value]}</span>
                    <button
                      type="button"
                      className="cursor-pointer"
                      data-value={value}
                      onClick={handleRemove}
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ))}
                <input {...props} className="outline-none" />
              </div>
            )}
          />
        </div>
        <ComboboxPopover
          gutter={4}
          sameWidth
          className="mt-1 rounded border p-1 shadow"
          getAnchorRect={getAnchorRect}
        >
          {options.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100 data-[active-item]:bg-gray-200"
            >
              <ComboboxItemCheck />
              {option.label}
            </ComboboxItem>
          ))}
          {options.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">No results found</div>
          )}
        </ComboboxPopover>
      </ComboboxProvider>
    </main>
  );
}
