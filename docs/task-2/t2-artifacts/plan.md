# Task 2 MVP Plan: Match Configuration Pane

## Goal

Add a launcher-side configuration pane that lets the operator configure teams and judges before starting the presentation.

The MVP focuses only on:

- Debater setup for `正方` and `反方`
- University selection for each side
- Debater order selection for each side
- Judge selection
- Predefined mocked lookup data

Match metadata such as motion, round, room, date, and competition ID remains out of scope for this MVP.

## Agreed Decisions

1. The configuration pane edits the active runtime `MatchData`.
2. The configured `MatchData` replaces the current static `mockMatch` as the data rendered by launcher, controller, and audience views.
3. Configured match data must survive refreshes and reopened windows.
4. Configured match data should be stored in `localStorage`.
5. Configured match data should sync across windows with `BroadcastChannel`, following the existing presentation-state pattern.
6. The configuration pane belongs on the launcher screen before `Start Presentation`.
7. The controller remains focused on presentation operation, slide navigation, and voting.
8. For the first version, team and judge configuration is locked after the presentation starts.
9. Any configuration change should reset presentation state, including current slide and votes.
10. Lookup data should be hardcoded TypeScript data for now.
11. Chinese labels should be represented as correct Unicode text, for example `正方`, `反方`, and `评审`.

## Mock Lookup Data

Prepare enough mocked data for realistic MVP testing:

- 4 universities
- 5 debaters per university
- 7 judges

Each university lookup entry should provide enough information to build a `TeamData` value:

- University ID
- University display name
- University initials
- Optional logo path
- 5 predefined debaters

Each debater lookup entry should provide:

- Debater ID
- Display name
- Major
- Photo path or generated placeholder path

Each judge lookup entry should provide:

- Judge ID
- Display name
- Photo path or generated placeholder path

## Configuration Flow

For each side, `正方` and `反方`:

1. User selects a university from a predefined dropdown.
2. Once a university is selected, debater selectors become available for that side.
3. User assigns debaters to speaking order slots.
4. The side must have 4 assigned debaters to satisfy the current match model.
5. Since each university has 5 debaters, one debater remains unused.

For judges:

1. User selects judges from the predefined judge source.
2. MVP data source contains 7 mocked judges.
3. The current validation allows only 4 or 5 judges, so the UI must either limit active judges to 4 or 5, or validation must be intentionally changed.

Recommended MVP decision: allow selecting exactly 5 active judges from the 7 predefined judges, because the current mock match already uses 5 judges and the existing validation supports that.

## Duplicate Clearing Rule

Original idea requirement:

> Clear old value when duplicated values detected.

Known example:

- If `UM` is selected for `正方`
- Then `UM` is selected again for `反方`
- The previous `UM` university and related debater information should be removed

Planned interpretation for MVP:

- A university can only be assigned to one side at a time.
- If a university selected on one side is selected on the other side, clear the previous side's university and debater selections.
- A debater can only be assigned to one speaking order slot at a time.
- If a debater selected in one slot is selected in another slot on the same side, clear the previous slot.

Open clarification before implementation:

- Should duplicate judge selection also clear the previous judge slot, or should selected judges simply disappear from the remaining judge dropdown options?

Recommended answer: selected judges should disappear from remaining judge dropdown options. This prevents duplicates without surprising clears.

## State Design

Introduce a persisted match configuration store separate from presentation progress state.

Recommended structure:

- `src/state/matchConfigStore.ts`
- `src/state/matchConfigReducer.ts`
- `src/domain/configLookups.ts`
- `src/domain/matchConfig.ts`

The match configuration store should:

- Read from `localStorage` on initialization
- Fall back to a default configuration derived from lookup data
- Normalize stored data before use
- Persist every valid update
- Broadcast updates to other windows
- Reset presentation state whenever configuration changes

The app should derive:

- `match` from the configured match data
- `slides` from `buildRunOfShow(match)`
- `validation` from `validateMatchData(match)`

## UI Placement

Add the configuration pane to the launcher view.

Recommended layout:

- Keep the existing launcher preview visible.
- Add a configuration section before the launch actions.
- Use two grouped sections for `正方` and `反方`.
- Use a separate judge section.
- Disable `Start Presentation` when validation errors exist.

## Selected Preview Design

Use Concept A from `t2-preview.html` as the MVP UI direction.

Concept A is a split launcher layout:

- Left column: current match summary, validation status, launch actions, and audience preview.
- Right column: configuration pane.
- Configuration pane top area: two side-by-side sections for `正方` and `反方`.
- Configuration pane bottom area: judge selection section.

This design is preferred because it keeps the operator's main launcher context visible while adding configuration controls in the same first-screen workflow.

### Concept A Structure Sample

```html
<main class="launcher-shell">
  <aside class="launcher-summary">
    <section class="match-summary">
      <p class="ui-eyebrow">当前场次</p>
      <h1>第二十届全国大专辩论会</h1>
      <p>人工智能的发展对大学生而言利大于弊</p>

      <div class="launcher-status">
        <strong>资料可彩排</strong>
        <span>0 项错误 · 2 项提醒 · 当前 1/18</span>
      </div>

      <div class="launcher-actions">
        <button type="button">开始演示</button>
        <button type="button" aria-label="重置状态">重置</button>
      </div>
    </section>

    <section class="launcher-preview" aria-label="当前观众画面预览">
      <!-- Existing SlideStage compact preview remains here. -->
    </section>
  </aside>

  <section class="match-config-pane" aria-label="赛前资料配置">
    <div class="team-config-grid">
      <section class="side-config" aria-label="正方配置">
        <header>
          <p>正方</p>
          <h2>大学与辩手顺序</h2>
          <span>4/4 已选</span>
        </header>

        <label>
          <span>大学</span>
          <select>
            <option>马来亚大学 UM</option>
            <option>国民大学 UKM</option>
            <option>博特拉大学 UPM</option>
            <option>理科大学 USM</option>
          </select>
        </label>

        <div class="debater-order-grid">
          <label>
            <span>一辩</span>
            <select>
              <option>陈子涵 - 法律学</option>
            </select>
          </label>
          <label>
            <span>二辩</span>
            <select>
              <option>林嘉怡 - 心理学</option>
            </select>
          </label>
          <label>
            <span>三辩</span>
            <select>
              <option>黄俊杰 - 经济学</option>
            </select>
          </label>
          <label>
            <span>四辩</span>
            <select>
              <option>吴诗敏 - 传播学</option>
            </select>
          </label>
        </div>
      </section>

      <section class="side-config" aria-label="反方配置">
        <!-- Same structure as 正方, with fan-side data and status. -->
      </section>
    </div>

    <section class="judge-config" aria-label="评审配置">
      <header>
        <p>评审</p>
        <h2>从 7 位名单中启用 5 位</h2>
      </header>

      <div class="judge-select-grid">
        <select><option>王老师</option></select>
        <select><option>刘老师</option></select>
        <select><option>郑老师</option></select>
        <select><option>蔡老师</option></select>
        <select><option>杨老师</option></select>
      </div>
    </section>
  </section>
</main>
```

## Validation Impact

Existing validation already checks:

- Two teams
- One `正方` and one `反方`
- Four debaters per team
- Four or five judges
- Valid segment speaker references
- Duplicate IDs

Implementation must ensure generated IDs remain stable and compatible with existing segment references.

Recommended approach:

- Keep side-specific debater IDs stable after assignment, for example `zheng-1`, `zheng-2`, `fan-1`, `fan-2`.
- Store lookup source IDs separately if needed.
- Build `TeamData.debaters` in speaking-order slots so existing segment references continue to work.

## Implementation Sequence

1. Add predefined lookup data for 4 universities, 5 debaters per university, and 7 judges.
2. Define a serializable match configuration state shape.
3. Add reducer actions for selecting universities, assigning debaters, selecting judges, and resetting configuration.
4. Implement duplicate-clearing behavior for university and debater selections.
5. Add `localStorage` and `BroadcastChannel` support for match configuration.
6. Derive `MatchData` from configuration state.
7. Refactor `App.tsx` and presentation store usage so all views consume configured match data.
8. Add launcher configuration UI.
9. Ensure configuration changes reset presentation state.
10. Update or add focused tests for derivation, normalization, and duplicate-clearing rules.

## Out Of Scope

- Editing match motion
- Editing round, room, date, or competition ID
- Remote API-backed data
- Import/export of configuration files
- Editing lookup data from the UI
- Changing team or judge configuration after presentation start

## Remaining Questions

1. Should active judges be exactly 5 for MVP, or should the user choose either 4 or 5 from the 7 mocked judges?
2. Should judge duplicate prevention use clearing behavior or filtered dropdown options?
3. Should the launcher show a manual `Unlock configuration` action after starting, or is refresh/reset the only way to reconfigure?
