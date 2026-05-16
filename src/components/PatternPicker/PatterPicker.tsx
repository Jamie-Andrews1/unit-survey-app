import patternData from "../../data/patterns.json";
import { GlassPattern } from "~/lib/Types";
import { For } from "solid-js";

export function PatternPicker(props: any) {
  // patternsData is already a JS array thanks to Vite
  const patterns = patternData as GlassPattern[];

  return (
    <div class="grid grid-cols-1 gap-2">
      <For each={patterns}>
        {(pattern) => (
          <button
            type="button"
            onClick={() => props.onSelect(pattern.id)}
            class="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 active:scale-95 transition-all"
          >
            <div class="text-left">
              <span class="block font-semibold">{pattern.name}</span>
              <span class="text-xs text-gray-500">{pattern.description}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-blue-600">Lvl</span>
              <span class="text-lg font-black">{pattern.level}</span>
            </div>
          </button>
        )}
      </For>
    </div>
  );
}
