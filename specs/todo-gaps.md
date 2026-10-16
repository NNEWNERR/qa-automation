# TodoMVC Gap Coverage Plan

## Application Overview

Gap plan for https://demo.playwright.dev/todomvc/ (React build), limited to: edit by double-click, toggle-all and clear completed, Completed filter and #/completed route, persistence, whitespace trimming. Out of scope because already covered: tests/todo.spec.ts (add, complete, delete, Active filter, multi-add count), tests/a11y.spec.ts (axe scans, Tab focus, keyboard add, input accessible name) and tests/visual.spec.ts (empty-state screenshot baselines). Behaviours below were verified against the live app on 2026-10-16. Selectors: input = placeholder "What needs to be done?"; title = data-testid=todo-title; edit box = `li.editing .edit` (aria-label "Edit"); toggle-all = text "Mark all as complete"; counter = `.todo-count`; filters = links All/Active/Completed; button "Clear completed". Persistence: the `todoPage` fixture clears localStorage once per test (guarded by a sessionStorage flag), so `page.reload()` keeps the app's own data and section 4 uses the stock fixture. Hash-only navigation (goto base URL + '#/completed') is a same-document change.

## Test Scenarios

### 1. Edit todo by double-click

**Seed:** `tests/seed.spec.ts`

#### 1.1. Enter saves edited text

**File:** `tests/generated/edit/edit-enter-saves.spec.ts`

**Steps:**
  1. Add todo 'Buy milk'.
    - expect: List has 1 item with text 'Buy milk'.
  2. Double-click the 'Buy milk' title.
    - expect: Item gets class 'editing'; an edit textbox is visible with value 'Buy milk'.
  3. Fill the edit textbox with 'Buy oat milk' and press Enter.
    - expect: Edit textbox is hidden; the single item's title reads 'Buy oat milk'; 'Buy milk' is no longer in the list; item count remains 1.

#### 1.2. Escape cancels edit and keeps original text

**File:** `tests/generated/edit/edit-escape-cancels.spec.ts`

**Steps:**
  1. Add todo 'Original'. Double-click it, fill edit box with 'Changed', press Escape.
    - expect: Edit textbox is hidden; the title reads 'Original'; text 'Changed' is not present on the page; item count is 1.

#### 1.3. Editing to empty text deletes the item

**File:** `tests/generated/edit/edit-empty-deletes.spec.ts`

**Steps:**
  1. Add todos 'Keep me' and 'Remove me'.
    - expect: 2 items listed.
  2. Double-click 'Remove me', clear the edit box, press Enter.
    - expect: List has exactly 1 item, 'Keep me'; 'Remove me' is not in the DOM; counter reads '1 item left'.

#### 1.4. Editing the only item to empty removes the footer

**File:** `tests/generated/edit/edit-empty-last-item.spec.ts`

**Steps:**
  1. Add todo 'Solo'. Double-click it, clear the edit box, press Enter.
    - expect: Item count is 0; the '.todo-count' counter and 'Clear completed'/filter links are not visible.

#### 1.5. Edit box with only spaces is treated as empty and deletes the item

**File:** `tests/generated/edit/edit-whitespace-only-deletes.spec.ts`

**Steps:**
  1. Add todo 'Spacey'. Double-click it, fill edit box with '   ' (3 spaces), press Enter.
    - expect: Item count is 0.

#### 1.6. Clicking outside while editing saves (blur)

**File:** `tests/generated/edit/edit-blur-saves.spec.ts`

**Steps:**
  1. Add todo 'Before'. Double-click it, fill 'After', then click the new-todo input.
    - expect: Edit textbox is hidden; title reads 'After'; item count is 1.

#### 1.7. Editing a completed item keeps it completed

**File:** `tests/generated/edit/edit-completed-item.spec.ts`

**Steps:**
  1. Add 'Done task', mark complete, double-click title, fill 'Done task v2', press Enter.
    - expect: Title reads 'Done task v2'; the item still has class 'completed'; counter reads '0 items left'.

### 2. Toggle-all and Clear completed

**Seed:** `tests/seed.spec.ts`

#### 2.1. Toggle-all completes every item

**File:** `tests/generated/toggle-clear/toggle-all-completes.spec.ts`

**Steps:**
  1. Add 'One', 'Two', 'Three'.
    - expect: 3 items; counter '3 items left'.
  2. Click 'Mark all as complete'.
    - expect: 3 items have class 'completed'; counter reads '0 items left'; the 'Clear completed' button is visible.

#### 2.2. Toggle-all with mixed state completes the remaining items

**File:** `tests/generated/toggle-clear/toggle-all-mixed.spec.ts`

**Steps:**
  1. Add 'A','B','C'; complete 'A'. Click 'Mark all as complete'.
    - expect: All 3 items have class 'completed'; counter reads '0 items left'.

#### 2.3. Toggle-all a second time reactivates all items

**File:** `tests/generated/toggle-clear/toggle-all-twice.spec.ts`

**Steps:**
  1. Add 'A','B'. Click toggle-all twice.
    - expect: 0 items have class 'completed'; counter reads '2 items left'; 'Clear completed' button is not visible.

#### 2.4. Completing every item individually checks toggle-all

**File:** `tests/generated/toggle-clear/toggle-all-state-sync.spec.ts`

**Steps:**
  1. Add 'A','B'; check each item's checkbox.
    - expect: The toggle-all checkbox is checked.
  2. Uncheck 'A'.
    - expect: The toggle-all checkbox is unchecked; counter reads '1 item left'.

#### 2.5. Clear completed removes only completed items

**File:** `tests/generated/toggle-clear/clear-completed-partial.spec.ts`

**Steps:**
  1. Add 'Keep','Drop1','Drop2'; complete the two 'Drop' items.
    - expect: 'Clear completed' button visible; counter '1 item left'.
  2. Click 'Clear completed'.
    - expect: List has exactly 1 item, 'Keep', not completed; 'Clear completed' button is no longer visible; counter '1 item left'.

#### 2.6. Clear completed after toggle-all empties list and hides footer

**File:** `tests/generated/toggle-clear/clear-completed-all.spec.ts`

**Steps:**
  1. Add 'A','B'; click toggle-all; click 'Clear completed'.
    - expect: Item count is 0; '.todo-count' and filter links are not visible; the new-todo input is still visible and empty.

#### 2.7. Clear completed button is absent when nothing is completed

**File:** `tests/generated/toggle-clear/clear-completed-hidden.spec.ts`

**Steps:**
  1. Add 'A'.
    - expect: Footer counter visible; 'Clear completed' button count is 0.

### 3. Completed filter and #/completed route

**Seed:** `tests/seed.spec.ts`

#### 3.1. Completed filter shows only completed items and updates URL

**File:** `tests/generated/filter-completed/filter-completed-click.spec.ts`

**Steps:**
  1. Add 'Active task' and 'Done task'; complete 'Done task'.
    - expect: 2 items under All.
  2. Click the 'Completed' link.
    - expect: URL ends with '#/completed'; only 'Done task' is visible; 'Active task' is hidden; the 'Completed' link has class 'selected'; counter still reads '1 item left'.

#### 3.2. Completed filter with no completed items shows an empty list

**File:** `tests/generated/filter-completed/filter-completed-empty.spec.ts`

**Steps:**
  1. Add 'A'. Click 'Completed'.
    - expect: URL ends with '#/completed'; item count is 0; 'Completed' link has class 'selected'.

#### 3.3. Direct navigation to #/completed applies the filter

**File:** `tests/generated/filter-completed/route-completed-direct.spec.ts`

**Steps:**
  1. Add 'Active task' and 'Done task'; complete 'Done task'. Navigate with page.goto(baseURL + '#/completed') (hash-only, no reload).
    - expect: URL ends with '#/completed'; only 'Done task' is visible; 'Completed' link has class 'selected'.

#### 3.4. Switching All → Completed → All restores the full list

**File:** `tests/generated/filter-completed/filter-completed-roundtrip.spec.ts`

**Steps:**
  1. Add 'A','B'; complete 'A'. Click 'Completed', then 'All'.
    - expect: After Completed: 1 item ('A'). After All: URL ends with '#/' and 2 items are visible; 'All' link has class 'selected'.

#### 3.5. Completing an item in the Completed view keeps list consistent; un-completing removes it from view

**File:** `tests/generated/filter-completed/filter-completed-uncomplete.spec.ts`

**Steps:**
  1. Add 'A'; complete it; click 'Completed'; uncheck 'A'.
    - expect: Item count in the view is 0; counter reads '1 item left'.

#### 3.6. Clear completed while on Completed filter

**File:** `tests/generated/filter-completed/filter-completed-clear.spec.ts`

**Steps:**
  1. Add 'A','B'; complete 'A'; click 'Completed'; click 'Clear completed'.
    - expect: Item count in the view is 0; URL still ends with '#/completed'; clicking 'All' shows 1 item, 'B'.

#### 3.7. Browser Back returns to previous filter

**File:** `tests/generated/filter-completed/filter-history-back.spec.ts`

**Steps:**
  1. Add 'A'; complete it. Click 'Completed', then go back (page.goBack()).
    - expect: URL ends with '#/' ; 'All' link has class 'selected'; 'A' is visible.

### 4. Persistence across reload

**Seed:** `tests/seed.spec.ts`

#### 4.1. Todos and completed state survive reload

**File:** `tests/generated/persistence/persist-reload.spec.ts`

**Steps:**
  1. Add 'Persist A' and 'Persist B'; complete 'Persist A'.
    - expect: 2 items; counter '1 item left'; localStorage key 'react-todos' holds 2 entries.
  2. Call page.reload().
    - expect: 2 items still listed with titles 'Persist A' and 'Persist B'; 'Persist A' has class 'completed'; counter '1 item left'.

#### 4.2. Edits and deletions persist across reload

**File:** `tests/generated/persistence/persist-edit-delete.spec.ts`

**Steps:**
  1. Add 'X','Y'; edit 'X' to 'X edited'; delete 'Y'. Reload.
    - expect: Exactly 1 item 'X edited' remains; 'Y' is absent.

#### 4.3. Clear completed persists across reload

**File:** `tests/generated/persistence/persist-clear-completed.spec.ts`

**Steps:**
  1. Add 'A','B'; complete 'A'; click 'Clear completed'; reload.
    - expect: 1 item 'B' listed; 'A' absent.

#### 4.4. Reload on #/completed keeps filter and data

**File:** `tests/generated/persistence/persist-completed-route.spec.ts`

**Steps:**
  1. Add 'A','B'; complete 'A'; click 'Completed'; reload.
    - expect: URL ends with '#/completed'; only 'A' visible; 'Completed' link has class 'selected'.

### 5. Whitespace trimming on add and edit

**Seed:** `tests/seed.spec.ts`

#### 5.1. Leading and trailing spaces are trimmed on add

**File:** `tests/generated/trim/trim-add.spec.ts`

**Steps:**
  1. Fill input with '   Padded title   ' and press Enter.
    - expect: One item whose title text content is exactly 'Padded title'; input is cleared (empty value).

#### 5.2. Whitespace-only input is not added

**File:** `tests/generated/trim/trim-add-blank.spec.ts`

**Steps:**
  1. Fill input with '     ' and press Enter.
    - expect: Item count is 0; footer counter not visible.

#### 5.3. Empty input is not added

**File:** `tests/generated/trim/trim-add-empty.spec.ts`

**Steps:**
  1. Focus the input and press Enter with no text.
    - expect: Item count is 0.

#### 5.4. Inner spaces are preserved on add

**File:** `tests/generated/trim/trim-add-inner.spec.ts`

**Steps:**
  1. Fill input with '  a  b  ' and press Enter.
    - expect: Item title text content is 'a  b' (inner double space intact, outer spaces gone).

#### 5.5. Leading and trailing spaces are trimmed on edit

**File:** `tests/generated/trim/trim-edit.spec.ts`

**Steps:**
  1. Add 'Plain'. Double-click it, fill '   Trimmed edit   ', press Enter.
    - expect: Title text content is exactly 'Trimmed edit'; item count is 1.

#### 5.6. Edit box preloads the trimmed value

**File:** `tests/generated/trim/trim-edit-preload.spec.ts`

**Steps:**
  1. Add '  Spaced  '. Double-click the item.
    - expect: Edit textbox value is exactly 'Spaced'.
