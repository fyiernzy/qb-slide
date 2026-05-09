# SRS-1: MVP Match Slide Automation

Source: `docs/proposal-v1.md`

Status: Draft for interview and confirmation.

## 0. Confirmed Decisions From Interview Round 1

1. Official event title: `第二十届全国大专辩论会`.
   - Reason: the deck must use the official QuanBian Chinese title only, not an English event title.
   - Discipline: always ask for the exact official title before building a new event deck.
2. Written language: Simplified Chinese only.
   - Reason: this is the expected shared language for the event audience and operators.
   - Discipline: ask whether any translation is needed before adding English, bilingual, or Traditional Chinese text.
3. Template fidelity: use a simple web-native theme for MVP.
   - Reason: this keeps the first pilot focused on reliability, readability, and structured population instead of PowerPoint matching.
4. Side labels: use the official QuanBian labels.
   - Reason: generic labels such as Pro/Con may not match event terminology.
   - Discipline: always ask for the exact side labels before finalizing the data schema and slides.
5. 辩题 is required data.
   - Reason: 辩题 is a match-specific repeated field and must be validated/rendered directly from data.
   - Superseded detail: there is no separate motion-only slide in the latest slide inventory; 辩题 appears on the general slide and relevant session slides.
6. Debate segment/session slides are data-driven and required.
   - Reason: the repeated template needs fixed session behavior while data supplies the speaker references and display text.
7. Vote entry: use per-judge clickable controls like the current `src/App.tsx` interaction idea, but redesign the visual treatment.
   - Reason: this is already a workable operator interaction pattern, while the current visual design is not the approved MVP design.
8. Four-judge 2:2 result: display as a tie.
   - Reason: the MVP must not invent or imply a winner when judge votes are tied.
9. Advertisement content is out of MVP.
   - Reason: Round 4 removed the advertisement page for now.
10. Debater majors: required where available.
    - Reason: majors are one of the repeated fields identified as manual-edit pain points.
11. Mock assets: use free, royalty-free online resources, downloaded before live use.
    - Reason: MVP can be rehearsed with realistic placeholder assets without depending on real participant assets.
    - Candidate sources: [Pexels license](https://www.pexels.com/license/) and [Unsplash license](https://unsplash.com/license/).
    - Discipline: avoid images with visible brands/logos, sensitive context, or endorsement implications; store all selected assets locally before rehearsal.
12. Fonts: for MVP use a typical Windows Simplified Chinese font; long-term direction is bundled and locked-down font files.
    - Reason: MVP should move quickly on Windows while the production workflow should avoid unknown font fallback.
13. Controller UI language: Chinese.
    - Reason: Chinese is the shared operating language for this event context.
    - Discipline: ask explicitly if translation is needed.
14. 3D/WebGL visuals: remove from MVP.
    - Reason: it increases rendering and projector risk without being necessary for the MVP proof.

## 0.1 Confirmed Decisions From Interview Round 2

1. Official event vocabulary:
   - `正方`
   - `反方`
   - `持方`
   - `辩题`
   - `辩手`
   - `评审`
   - `决选票（Votes）`
   - Reason: these labels match the event language and should replace generic English labels in audience and controller UI.
2. Debate segment slides need further explanation before a final decision.
   - Reason: the concept is still ambiguous, so the SRS must explain the branch before asking for a final run-of-show.
3. Vote behavior:
   - Each judge's 决选票 is shown immediately when the operator clicks that judge's vote.
   - The aggregate final result, such as 2:3, stays hidden until the operator advances to the final result slide.
   - Reason: this matches the emcee flow: the emcee announces a judge, then the operator shows that judge's vote.
4. Judge vote reveal order:
   - Operator-selected order.
   - Reason: it supports the emcee's live order and recovery flexibility.
5. Unrevealed judge vote cards:
   - Show neutral visual cards without waiting text.
   - Reason: the audience should see visual structure without text hints such as `待公布`.
6. Result wording:
   - Use `胜` for the winning side and `和` for a tied result.
   - Never show `负` or any losing-side label.
   - Reason: the losing side should not be explicitly marked with a loss label in the presentation.
7. Mock person assets:
   - Use royalty-free portrait-style images for all debaters and judges.
   - Reason: realistic rehearsal visuals help validate layout and readability.
8. Team marks:
   - For MVP, use simple initials first.
   - Reason: this avoids logo sourcing/approval risk while still providing a visual team marker.
9. Debater card fields:
   - Show name and major only.
   - Show university at team level only.
   - Reason: this reduces repeated text and keeps debater cards readable.
10. Controller and slide UI text:
    - Fully Chinese by default.
    - Reason: accepted as the default operating language; translation is opt-in only.

## 0.2 Confirmed Decisions From Interview Round 3

1. Debate segment slides are required and must be data-driven.
   - Reason: the repeated template needs one consistent session format while the exact session list should come from structured data.
2. Confirmed run-of-show session list:
   - `正方一辩 立论`
   - `反方一辩 立论`
   - `反方二辩 质询`
   - `正方二辩 质询`
   - `反方二辩 总结`
   - `正方二辩 总结`
   - `三辩 对辩`
   - `正方三辩 总结`
   - `反方三辩 总结`
   - `自由辩论`
   - `反方四辩 总结`
   - `正方四辩 总结`
3. Single-debater session slides show:
   - debater photo
   - debater name
   - session name
   - 持方
4. `三辩 对辩` session slide shows:
   - two debaters' photos
   - two debaters' names
   - session name
   - 辩题
5. `自由辩论` session slide shows:
   - two school/team marks
   - two school names
   - 辩题
6. `评审介绍` appears after both team introductions.
7. `辩题` is included on the general slide instead of as a separate motion-only slide.
8. The repeated template's actual slide inventory includes:
   - general slide
   - 正方 team introduction
   - 反方 team introduction
   - judge introduction
   - session slides
   - final judge votes
   - total results page
9. `正方` stays visually left and `反方` stays visually right.
10. `反方` team slide uses the same layout as `正方`, not a mirrored layout.
11. A shown judge vote may be changed through clearly separated recovery controls.
12. Keyboard shortcuts are required for MVP:
    - `←` previous
    - `→` next
13. Scope change:
    - Advertisement page is removed from MVP for now.
    - Reason: Round 4 clarified no advertisement page is needed now.

## 0.3 Confirmed Decisions From Interview Round 4

1. Advertisement page:
   - Not needed for MVP.
   - Reason: there is no current advertisement-page requirement.
2. Competition ID examples:
   - `入选赛（一）`
   - `小组赛（十三）`
3. Session speaker mapping:
   - Automatic by debater order.
   - `一辩` = debater 1.
   - `二辩` = debater 2.
   - `三辩` = debater 3.
   - `四辩` = debater 4.
4. `三辩 对辩` uses `正方三辩` and `反方三辩`.
5. Single-debater session layout:
   - portrait left
   - text right
6. `自由辩论` uses initials/team marks for MVP, with optional real logo path later.
7. General slide includes school names and initials/team marks.
8. Dedicated closing/thank-you slide:
   - Not needed for MVP.
9. Open clarification:
   - Resolved in Round 5: next competition page is not needed for MVP.

## 0.4 Confirmed Decisions From Interview Round 5

1. Next competition information slide:
   - Not needed for MVP.
   - Reason: remove it to keep the MVP focused.
2. Competition ID:
   - Free text field.
   - Reason: values such as `入选赛（一）` and `小组赛（十三）` are display labels, not numeric IDs.
3. School/team initials:
   - Provided manually in TypeScript data.
   - Reason: automatic initials generation is unreliable for Chinese school names.

## 0.5 Confirmed Decisions From Interview Round 6

1. Visual approval target:
   - Formal clean broadcast.
   - Reason: accepted as the MVP visual direction.
2. Side color mapping:
   - `正方`: blue.
   - `反方`: red.
   - Reason: user explicitly selected this mapping.
3. Portrait shape:
   - Rounded rectangle with 8px radius.
   - Reason: accepted as the formal deck image style.
4. Long text behavior:
   - Wrap to a fixed limit first.
   - Show validation warning when text exceeds the allowed limit.
   - Do not silently shrink text too much.
5. 辩题 length:
   - Warn above 60 Chinese characters on the general slide.
6. Debater name length:
   - Warn above 8 Chinese characters.
7. Result page:
   - Show raw score and result wording together, such as `正方 胜 3:2`.
8. Vote reveal cards:
   - Show judge photo, judge name, and chosen side.

## 0.6 Confirmed Decisions From Interview Round 7

1. School name overflow:
   - Warn above 16 Chinese characters.
2. Major overflow:
   - Warn above 14 Chinese characters.
3. School name display:
   - Use full official school name only.
   - Do not maintain separate short-name display fields for MVP.
4. Judge introduction cards:
   - Show judge photo and name only.
   - Do not show affiliation/title for MVP unless added later.
5. Vote reveal neutral state:
   - Before reveal, show judge photo and judge name.
   - Do not show vote text or waiting hints.
6. Recovery controls:
   - Visible in the controller.
   - Visually separated from normal controls.
   - Reason: MVP operators need fast recovery.

## 0.7 Confirmed Decisions From Interview Round 8

Record-only decision: these success-measurement decisions are documented for planning and are not to be implemented in the system right now.

1. Satisfaction questionnaire scale:
   - 1-5 Likert scale.
2. Required respondent groups:
   - technical operator
   - advisor
   - department executive
   - HOD
3. Minimum success threshold:
   - average score >= 4.0/5 across all respondent groups
   - technical operator confirms deck population within 5 minutes
4. 5-minute population timing:
   - includes data validation
   - excludes production build
   - production build should be done before event day
5. Rehearsal:
   - full click-through rehearsal on the actual presentation laptop is mandatory before live use.

## 1. MVP Goal

Produce one local-first browser presentation template for repeated low-priority QuanBian match decks. The MVP must prove that prepared match data and prepared assets can populate a complete match deck in 5 minutes or less, excluding asset collection, cropping, renaming, and fixing.

The MVP is not a grand final replacement. It is a controlled pilot for repeated match decks.

## 2. MVP Scope

### 2.1 In Scope

1. Same-laptop browser presentation with:
   - launcher view
   - audience view
   - controller view
2. TypeScript match data input.
3. One mock match data set.
4. One fixed ordered run-of-show.
5. Advanced jump controls visible to operators.
6. General slide with competition ID, official title, 辩题, and both schools/team marks.
7. Team intro slides for `正方` and `反方`.
8. Four debaters per side.
9. Judge intro slide for five judges.
10. Data-driven session slides.
11. Per-judge clickable vote entry controlled from controller view.
12. Result slide supporting four or five judges.
13. Tie display that does not falsely declare a winner.
14. Local validation before presentation.
15. Simple consistent visual theme.
16. Build, lint, and browser rehearsal checks.
17. Chinese audience and controller copy.
18. Keyboard shortcuts for previous and next.

### 2.2 Out of Scope

1. Grand final replacement.
2. Advertisement page.
3. Next competition information slide.
4. Committee-editable YAML data.
5. Live text, style, or source data editing during audience presentation.
6. Generic multi-season presentation engine.
7. Automated photo cropping or logo preparation.
8. Cloud deployment.
9. Internet dependency during live use.
10. Speaker timer, unless confirmed later.
11. Speaker score calculation, unless confirmed later.
12. 3D/WebGL decorative visuals.

## 3. Target User Workflow

1. Technical committee prepares all photos, initials/team marks, and data before the event.
2. Technical committee edits one TypeScript match data file using Simplified Chinese display text.
3. Validation is run before rehearsal.
4. Operator opens launcher.
5. Launcher opens audience and controller windows.
6. Audience window is moved to LED/projector.
7. Controller window stays visible to the technical committee.
8. Operator uses Next/Previous for normal flow.
9. Operator uses advanced jump controls for recovery.
10. Operator clicks each judge's 决选票 in the emcee's announced order.
11. Audience sees each clicked judge vote immediately.
12. Operator advances to reveal the final aggregate result only after all required judge votes have been shown.

## 4. MVP Artifacts To Produce

| Item | Artifact | Required Content | Acceptance Standard |
| --- | --- | --- | --- |
| Application shell | React/Vite app | launcher, audience, controller modes | Runs locally without internet after dependencies are installed |
| Data model | TypeScript types | event, match, teams, debaters, judges, 辩题, session slides, result votes | Uses stable IDs, not display names, for references |
| Mock data | TypeScript mock data file | one complete low-priority match | Validation passes with 4 debaters per side and 5 judges |
| Validation | local validation function or script | missing names, duplicate IDs, invalid votes, missing 4 debaters, unsupported judge count, asset path presence | Blocks rehearsal when critical data is missing |
| Run-of-show | ordered slide/state list | fixed normal path with named states and data-driven sessions | Controller can go next, previous, and jump by state |
| Audience view | projected slide canvas | 16:9 presentation output | No visible controller-only controls |
| Controller view | Chinese operator interface | preview, next/previous, jump, clickable per-judge vote controls, result reveal controls | Can operate full MVP without editing data live |
| Styling system | CSS tokens and layout rules | color, font, spacing, safe zones, slide components | All slides share one visual language |
| Result logic | vote total and winner function | 4 or 5 judge support | 2:2 is displayed as tie, not a winner |
| Documentation | SRS and operator notes | MVP assumptions, unresolved decisions, rehearsal checklist | A new operator can understand intended flow |

## 5. Screen Modes

### 5.1 Launcher View

Purpose: Start and reset the presentation.

Position and layout:

1. Full browser viewport.
2. Left side: event title, match summary, Present button, Reset button.
3. Right side: 16:9 preview of current audience slide.
4. Present opens:
   - `?view=audience`
   - `?view=controller`

Controls:

1. Present.
2. Reset state.
3. Optional validation status summary in Chinese.

### 5.2 Audience View

Purpose: Projected output for LED/projector.

Position and layout:

1. Full viewport, dark outer background.
2. 16:9 slide stage centered.
3. Stage should use the maximum size that fits the viewport.
4. No operator controls.
5. No browser-dependent remote resources.

### 5.3 Controller View

Purpose: Technical committee control surface.

Position and layout:

1. Two-column desktop layout.
2. Left column: live 16:9 audience preview.
3. Right column: fixed-width control panel, recommended 420-480px.
4. Control panel order:
   - match status
   - validation warnings
   - Previous / Next
   - slide jump list
   - slide-specific controls
   - visibly separated recovery controls

Controls:

1. Previous.
2. Next.
3. Jump to any run-of-show state.
4. Reset votes.
5. Enter judge vote through per-judge clickable team buttons.
6. Clear judge vote.
7. Click a judge vote and reveal it immediately to the audience.
8. Clear or change a judge vote through visibly separated recovery controls.
9. Advance to reveal final aggregate result.
10. Keyboard shortcuts:
    - `←`: previous state
    - `→`: next state

## 6. Run-Of-Show

The MVP must model animation-heavy PowerPoint pages as slide states or reveal steps. It should not duplicate whole pages when state changes are enough.

Recommended initial run-of-show:

| Order | State ID | Audience Item | Controller Item | Notes |
| --- | --- | --- | --- | --- |
| 1 | `general` | General slide | Next only | Competition ID, title, 辩题, `正方`/`反方` school names and team marks |
| 2 | `team-zheng` | `正方` team intro | Next/Previous | school name, team mark, 4 debaters, 持方 |
| 3 | `team-fan` | `反方` team intro | Next/Previous | school name, team mark, 4 debaters, 持方 |
| 4 | `judges` | `评审` introduction | Next/Previous | 5 judges in MVP data |
| 5 | `session-zheng-1-case` | `正方一辩 立论` | Next/Previous | single-debater session |
| 6 | `session-fan-1-case` | `反方一辩 立论` | Next/Previous | single-debater session |
| 7 | `session-fan-2-question` | `反方二辩 质询` | Next/Previous | single-debater session |
| 8 | `session-zheng-2-question` | `正方二辩 质询` | Next/Previous | single-debater session |
| 9 | `session-fan-2-summary` | `反方二辩 总结` | Next/Previous | single-debater session |
| 10 | `session-zheng-2-summary` | `正方二辩 总结` | Next/Previous | single-debater session |
| 11 | `session-third-debate` | `三辩 对辩` | Next/Previous | two debaters plus 辩题 |
| 12 | `session-zheng-3-summary` | `正方三辩 总结` | Next/Previous | single-debater session |
| 13 | `session-fan-3-summary` | `反方三辩 总结` | Next/Previous | single-debater session |
| 14 | `session-free-debate` | `自由辩论` | Next/Previous | two school/team marks, school names, 辩题 |
| 15 | `session-fan-4-summary` | `反方四辩 总结` | Next/Previous | single-debater session |
| 16 | `session-zheng-4-summary` | `正方四辩 总结` | Next/Previous | single-debater session |
| 17 | `vote-reveal` | Final judge votes | clickable judge vote controls | Each clicked judge vote appears immediately; totals stay hidden |
| 18 | `result` | Total results page | Next/Previous and recovery controls | Shows `胜` or `和`, with no `负` label |

Confirmed direction: session slides are required and data-driven. The order above is confirmed from interview Round 3.

### 6.1 Debate Segment Slide Explanation

Debate segment/session slides are not score or vote slides. They are transition/title slides used between parts of the debate so the audience, emcee, and technical team know which part is happening next.

Confirmed session slides:

1. `正方一辩 立论`
2. `反方一辩 立论`
3. `反方二辩 质询`
4. `正方二辩 质询`
5. `反方二辩 总结`
6. `正方二辩 总结`
7. `三辩 对辩`
8. `正方三辩 总结`
9. `反方三辩 总结`
10. `自由辩论`
11. `反方四辩 总结`
12. `正方四辩 总结`

For MVP, these slides should not include timers unless a later decision explicitly adds timer behavior.

Layout dependency:

1. Single-debater sessions show debater photo, name, session name, and 持方.
2. `三辩 对辩` shows two debaters' photos, names, session name, and 辩题.
3. `自由辩论` shows both school/team marks, school names, and 辩题.

## 7. Slide Design System

### 7.1 Visual Direction

Confirmed direction: formal debate broadcast, not grand-final spectacle.

Rationale:

1. The MVP is for low-priority repeated decks.
2. Visuals must be reliable and readable on projector/LED.
3. The design should be polished enough for pilot use without creating bespoke art debt.
4. The MVP should not copy the current `src/App.tsx` visual design.
5. Round 6 confirmed the target style as formal clean broadcast.

### 7.2 Canvas

1. Design size: 1920 x 1080 reference canvas.
2. Aspect ratio: 16:9.
3. Safe margin: 80px from all edges.
4. Minimum live-text margin from edge: 64px.
5. No critical text below the bottom 80px.
6. Text must not overlap with photos, initials/team marks, vote chips, or controller overlays.

### 7.3 Color Tokens

Recommended palette:

| Token | Hex | Usage |
| --- | --- | --- |
| `ink` | `#111414` | main text |
| `paper` | `#f7f2e7` | slide background |
| `paper-muted` | `#e6dcc8` | subtle panels |
| `charcoal` | `#12181d` | audience outer background |
| `gold` | `#c9a24d` | event accent and focus states |
| `side-zheng` | `#245c9a` | `正方` accent |
| `side-fan` | `#c73e35` | `反方` accent |
| `teal` | `#196f62` | secondary information accent |
| `line` | `rgba(17, 20, 20, 0.16)` | borders |

Rules:

1. Avoid a one-note single-hue theme.
2. Do not depend on color alone; labels must also state `正方`/`反方` or team names.
3. Use high contrast for projector readability.
4. No decorative gradient orbs.

### 7.4 Fonts

Recommended MVP font policy:

1. MVP primary font: `Microsoft YaHei`.
2. MVP fallback stack: `"Microsoft YaHei", "SimHei", "Noto Sans SC", "Segoe UI", Arial, sans-serif`.
3. Numeric/result font: same family, heavier weight.
4. Font weights:
   - regular: 400
   - body emphasis: 600
   - headings: 800
   - result numbers: 900
5. Letter spacing: `0`.
6. No negative letter spacing.

Long-term font direction: bundle and lock down a Simplified Chinese font such as `Noto Sans SC` after MVP. For MVP, use typical Windows Simplified Chinese fonts to keep implementation fast.

### 7.5 Common Slide Header

Position:

1. Top-left x: 80px.
2. Top-left y: 64px.
3. Eyebrow line: 28-34px.
4. Main title: 74-110px depending on content.
5. Optional event label: top-right, x aligned to 1840px right edge.

Rules:

1. Header must fit long team names through max width and wrapping.
2. The title container must not resize the whole slide.
3. If text exceeds two lines, validation should warn.

### 7.6 Motion and Animation

1. Use restrained entrance transitions.
2. Recommended duration: 180-420ms for normal UI and 500-800ms for slide reveal moments.
3. Do not animate layout in ways that alter final readable positions.
4. Vote reveal may use a short emphasis animation.
5. Do not use 3D/WebGL visuals in MVP.

## 8. Slide Inventory

### 8.1 General Slide

Item:

1. Event title: `第二十届全国大专辩论会`.
2. Competition ID.
3. 辩题.
4. `正方` school name and team mark.
5. `反方` school name and team mark.
6. Date/session label if available.

Design and position:

1. Background: `charcoal` with subtle paper/gold stage line, no sponsor strip or sponsor logo.
2. Center: 辩题 block or side-versus-side label, y around 360-460px.
3. Left side block: `正方` school, x 110px, y 330px, width 600px.
4. Right side block: `反方` school, x 1210px, y 330px, width 600px.
5. Event title: top-left.
6. Competition ID/round label: top-right.
7. Team initials mark: 120-160px square inside each team block.

### 8.2 Motion/Round Context

Decision: no separate 辩题-only slide in the current MVP inventory. 辩题 appears on the general slide, `三辩 对辩`, and `自由辩论`.

Historical item retained for context:

Item:

1. Motion label.
2. Full motion text.
3. Round/session label.

Design and position:

1. Background: paper.
2. Motion text centered in a max-width 1360px block.
3. Motion text size: 56-78px depending on length.
4. Supporting label above at 32px.
5. No photos.

### 8.3 `正方` Team Intro Slide

Item:

1. Team side label: `正方`.
2. Team display name.
3. University/school name.
4. Team initials mark.
5. Four debater cards.
6. Each debater card: portrait photo, name, major.
7. 持方.

Design and position:

1. Background: paper with `正方` accent.
2. Header at top-left.
3. Team initials mark at top-right, 144px square.
4. Debater grid: 2 x 2, x 80px, y 380px, width 1760px, height 560px.
5. Each card:
   - photo left or top, fixed 180px square
   - photo radius 8px
   - name 34-44px
   - major 22-26px
   - no role/order field unless confirmed later
6. All four cards must remain same size.

### 8.4 `反方` Team Intro Slide

Same structure as `正方` Team Intro Slide, using `反方` accent.

Confirmed decision: `反方` uses the same layout as `正方` for readability and faster implementation.

### 8.5 Judges Intro Slide

Item:

1. Slide title: `评审`.
2. Five judge cards.
3. Each judge card: portrait photo and name only.

Design and position:

1. Background: paper with gold accent.
2. Header at top-left.
3. Judge grid:
   - first row: 3 cards
   - second row: 2 cards centered
4. Card size target: 500px x 260px for first row, matched second row width.
5. Judge portrait uses 8px radius.
6. MVP mock data should use royalty-free portrait-style images for all judges.

### 8.6 Session Slides

Item:

1. Segment name.
2. Segment order number.
3. Optional speaking side.
4. Optional speaker name.
5. Optional second speaker for paired sessions.
6. 辩题 for `三辩 对辩` and `自由辩论`.

Design and position:

1. Background: charcoal or paper depending on confirmed style.
2. Session name centered or upper-left depending on session type, 72-112px.
3. Single-debater session:
   - debater portrait
   - portrait radius 8px
   - debater name
   - session name
   - 持方
4. `三辩 对辩`:
   - two debater portraits
   - portrait radius 8px
   - two debater names
   - session name
   - 辩题
5. `自由辩论`:
   - two school/team marks
   - two school names
   - 辩题
6. `正方` remains visually left and `反方` remains visually right.
7. No timer behavior in MVP.

Confirmed session list is defined in Section 6.

### 8.7 Vote Reveal Slide

Item:

1. Judge names.
2. Judge photos.
3. Revealed vote per judge.
4. Neutral unrevealed visual state with no waiting text.
5. Team totals hidden until final result.
6. Controller vote entry uses per-judge clickable team buttons; this follows the current `src/App.tsx` interaction idea, not its visual design.
7. Each clicked vote appears immediately on the audience view.

Design and position:

1. Background: paper.
2. Five judge chips/cards.
3. Layout:
   - 5 judges: 3 top, 2 bottom centered
   - 4 judges: 2 x 2
4. Unrevealed cards are neutral, show judge photo/name, and should not show `待公布`, `waiting`, vote text, or equivalent hints.
5. Revealed `正方` votes use `正方` accent plus text label.
6. Revealed `反方` votes use `反方` accent plus text label.
7. Each card includes judge photo, judge name, and chosen side after reveal.
8. Judge portrait radius is 8px.

### 8.8 Result Slide

Item:

1. `胜` or `和` result title.
2. Raw score such as `3:2`.
3. `正方` team vote count.
4. `反方` team vote count.
5. Final caption.
6. Optional majority label.

Design and position:

1. Background: charcoal for finality.
2. `胜`/`和` title centered top third.
3. Two result panels side by side:
   - `正方` panel x 160px, y 430px, width 720px
   - `反方` panel x 1040px, y 430px, width 720px
4. Vote numbers 140-190px.
5. Tie state must display `和` and avoid winner styling.
6. Losing side must never show `负`, `lose`, or any loss label.
7. Winning result should combine side, result word, and score, for example `正方 胜 3:2`.

## 9. Data Shape

Recommended TypeScript structure:

```ts
type MatchData = {
  event: EventInfo
  match: MatchInfo
  teams: [TeamData, TeamData]
  judges: JudgeData[]
  segments: DebateSegment[]
  votes?: JudgeVote[]
}

type EventInfo = {
  id: string
  title: '第二十届全国大专辩论会'
  subtitle?: string
  season?: string
}

type MatchInfo = {
  id: string
  competitionId: string
  round: string
  room?: string
  date?: string
  motion: string
}

type TeamData = {
  id: string
  side: 'zheng' | 'fan'
  sideLabel: '正方' | '反方'
  displayName: string
  universityName: string
  initials: string
  logoPath?: string
  debaters: [DebaterData, DebaterData, DebaterData, DebaterData]
}

type DebaterData = {
  id: string
  displayName: string
  major: string
  photoPath: string
}

type JudgeData = {
  id: string
  displayName: string
  photoPath: string
}

type DebateSegment = {
  id: string
  label: string
  kind: 'single' | 'paired' | 'free'
  side?: 'zheng' | 'fan' | 'both' | 'neutral'
  speakerDebaterIds?: string[]
  showMotion?: boolean
  durationSeconds?: number
}

type JudgeVote = {
  judgeId: string
  teamId: string
}
```

Rules:

1. IDs must be stable ASCII slugs.
2. Display names must use Simplified Chinese unless translation is explicitly requested.
3. Vote `teamId` must reference an existing team ID.
4. `judges.length` must be 4 or 5.
5. MVP mock data must use 5 judges.
6. Each team must have exactly 4 debaters.
7. Team side labels must be `正方` and `反方` for this MVP.
8. Debater cards show only name and major; full official university/school name is team-level only.
9. Team marks use initials for MVP.
10. Single-debater session `speakerDebaterIds` must contain exactly one debater ID.
11. Paired session `speakerDebaterIds` must contain exactly two debater IDs.
12. `competitionId` is a free text display field, with examples such as `入选赛（一）` and `小组赛（十三）`.
13. Team initials/team marks are manually provided in data and must not be generated automatically from Chinese school names.

## 10. Validation Requirements

Validation must run before live use and report clear errors.

Critical errors:

1. Missing event title.
2. Missing match ID.
3. Missing motion.
4. Team count not equal to 2.
5. Missing `正方` or `反方` side.
6. Duplicate IDs.
7. Team with fewer or more than 4 debaters.
8. Judge count not 4 or 5.
9. Vote references missing judge or team.
10. Asset path declared but not found.
11. Single-debater session missing speaker debater ID.
12. Paired session missing one of the two speaker debater IDs.
13. Missing competition ID.
14. Missing team initials/team mark.

Warnings:

1. Team display name too long.
2. University/school name longer than 16 Chinese characters.
3. Debater name longer than 8 Chinese characters.
4. 辩题 longer than 60 Chinese characters on the general slide.
5. Major longer than 14 Chinese characters.
6. Missing optional photo.
7. Missing team initials.
8. Unsupported or untested characters.
9. Chinese font fallback may be active.
10. Mock asset source/license not recorded.
11. Long school name, major, or 辩题 wraps beyond the fixed line limit for its slide.

## 11. Result Logic

1. Count votes per team.
2. For 5 judges:
   - 5:0, 4:1, 3:2 produce a winner.
3. For 4 judges:
   - 4:0 and 3:1 produce a winner.
   - 2:2 produces a tie.
4. Missing votes:
   - Controller must show incomplete vote state.
   - Audience vote board may show clicked individual 决选票 immediately.
   - Audience result must not reveal aggregate totals until operator advances to the result slide.
5. Do not invent tie-breaker logic in MVP.
6. Winner wording must use `胜`.
7. Tie wording must use `和`.
8. Do not display `负` for the non-winning side.
9. Final result must display the raw score together with the result wording.

## 12. Coding Discipline

### 12.1 Architecture

1. Keep MVP specific to one template.
2. Do not build a generic headless slide engine yet.
3. Separate concerns:
   - domain types
   - mock match data
   - validation
   - presentation state
   - slide state registry
   - audience components
   - controller components
   - CSS tokens and slide layouts
4. Avoid hardcoding display names inside components.
5. Keep slide IDs stable and typed.
6. Model reveal steps as state, not duplicated slide pages.

### 12.2 React and TypeScript

1. Use TypeScript types for all data and state.
2. Prefer pure functions for validation, result logic, and slide-state construction.
3. Keep React components presentational where possible.
4. Avoid hidden global state except local storage/BroadcastChannel synchronization.
5. Normalize persisted state at load.
6. Do not trust local storage data without validation.
7. Use explicit prop types.
8. Keep file and function names direct and domain-specific.

### 12.3 Styling

1. Use CSS custom properties for tokens.
2. Use fixed 16:9 stage constraints.
3. Use stable grid dimensions for cards and chips.
4. No negative letter spacing.
5. Do not scale font size directly with viewport width for normal UI.
6. Use responsive constraints and overflow warnings.
7. Keep cards at 8px radius or less in controller UI unless presentation styling specifically needs larger stage panels.
8. Do not place cards inside cards.
9. Do not use decorative gradient orbs.

### 12.4 Testing and Verification

Required before MVP acceptance:

1. `npm run build`
2. `npm run lint`
3. Data validation passes.
4. Manual rehearsal in audience and controller windows.
5. Vote flow tested for:
   - all `正方` wins
   - all `反方` wins
   - 3:2 result
   - 2:2 tie with 4 judges
6. Browser visual check at:
   - 1920 x 1080
   - 1366 x 768
   - actual presentation laptop/projector resolution

## 13. Current Prototype Gaps Against This SRS

Observed from current repo:

1. Current mock data uses 3 debaters per team; MVP requires 4.
2. Current mock data uses 3 judges; MVP requires 5 initially and 4/5 support.
3. Current cover includes sponsor-like strip; advertisement content is out of MVP for now.
4. Current result logic handles two teams but must be verified for 4 and 5 judges.
5. Current vote button interaction is usable as an operator pattern, but the audience reveal behavior must show individual votes immediately while hiding aggregate totals until the result slide.
6. Current data shape is too small for motion, majors, judge photos, round, and assets.
7. Current styling uses negative letter spacing in places; SRS requires letter spacing `0`.
8. Current Chinese text appears mojibake in source/output and needs Simplified Chinese encoding/font verification.
9. Current 3D/WebGL decorative backdrop should be removed for MVP stability.
10. Current controller/audience copy is English; MVP copy should be Chinese unless translation is requested.

## 14. Acceptance Criteria

The MVP is accepted when:

1. A prepared match can be populated by editing TypeScript data in 5 minutes or less.
2. Population timing excludes asset preparation.
3. Audience and controller views run locally on the same laptop.
4. Normal operation works through Next/Previous.
5. Advanced jump controls are visible and usable.
6. Four debaters per side render correctly.
7. Five judges render correctly.
8. Four-judge result logic supports a 2:2 tie.
9. Missing required data is caught before live use.
10. No audience slide exposes controller-only state.
11. Session slides render according to the confirmed session list.
12. A low-priority match rehearsal is completed before higher-stakes adoption.
13. Satisfaction measurement uses a 1-5 Likert scale across technical operator, advisor, department executive, and HOD.
14. Satisfaction success threshold is average score >= 4.0/5 across all respondent groups.
15. Technical operator confirms deck population within 5 minutes, including validation but excluding production build.
16. Full click-through rehearsal is completed on the actual presentation laptop before live use.

## 15. Interview Decision Tree

Answer these before this SRS should be treated as final.

### 15.1 Event Identity

1. What is the exact event title to display?
   - Recommended answer: use the official QuanBian Chinese title as primary and an English subtitle only if the committee already uses one.
   - Confirmed answer: `第二十届全国大专辩论会` only.
   - Reason: official Chinese title must be the single source of truth for event identity.
2. Should the MVP be Chinese-only, English-only, or bilingual?
   - Recommended answer: Chinese primary, English only for operator UI if the technical team prefers it.
   - Confirmed answer: Chinese only by default.
   - Reason: Chinese is the shared event language; translation should be opt-in.
3. Traditional Chinese or Simplified Chinese?
   - Recommended answer: use the exact script used in official event materials.
   - Confirmed answer: Simplified Chinese.

### 15.2 Template Fidelity

1. Should the MVP copy an existing approved PowerPoint design or use a new simple web-native theme?
   - Recommended answer: use a new simple web-native theme for MVP unless an approved low-priority template already exists.
   - Confirmed answer: use a simple web-native theme.
   - Reason: reliability and readability matter more than matching a bespoke PowerPoint design for the first pilot.
2. What is the minimum visual quality acceptable for a low-priority pilot?
   - Recommended answer: clean, readable, official-looking, but not grand-final cinematic.
3. Are sponsor logos forbidden in MVP, or only sponsor slides?
   - Recommended answer: omit sponsor logos entirely for MVP to reduce asset and approval risk.
   - Confirmed answer: omit sponsor logos entirely.
   - Confirmed Round 4 answer: no advertisement page for now.

### 15.3 Slide Inventory

1. Is a separate motion-only slide required?
   - Recommended answer: no, now that 辩题 is included on the general slide and relevant session slides.
   - Confirmed answer: no separate motion-only slide; 辩题 remains required match data.
2. What exact debate segments must appear, in order?
   - Recommended answer: make segment cards data-driven and confirm the event's real run-of-show before implementation.
   - Confirmed answer: data-driven session slides using the 12 confirmed sessions in Section 6.
3. Do segment slides need timers?
   - Recommended answer: no for MVP; title cards only.
   - Confirmed answer: no timers for MVP.
4. Are judge intro slides shown before or after team intro slides?
   - Recommended answer: after both team intros.
   - Confirmed answer: after both team intros.

### 15.4 Team Data

1. What are the exact side labels: Pro/Con, Government/Opposition, Affirmative/Negative, or Chinese equivalents?
   - Recommended answer: use the labels already used by QuanBian slides.
   - Confirmed answer: `正方` and `反方`.
   - Discipline: always ask for the exact labels.
2. Do debater cards need role labels?
   - Recommended answer: yes, but optional in data so the MVP does not block if roles are unavailable.
   - Confirmed answer: no role/order field for MVP.
3. Do debater cards need majors?
   - Recommended answer: yes, because majors are named in the proposal pain points.
   - Confirmed answer: yes.
4. Are university names shared per team or individual per debater?
   - Recommended answer: team-level university plus optional debater-level override only if needed.
   - Confirmed answer: team-level only.
5. Should school names use full official names or short names?
   - Recommended answer: full official names only for MVP.
   - Confirmed answer: full official names only.

### 15.5 Assets

1. Will the MVP use real person photos and team logos in the first pilot?
   - Recommended answer: yes, if prepared assets are available; otherwise use initials placeholders only for mock rehearsal.
   - Confirmed answer: use free, royalty-free portrait-style images for all debaters and judges, downloaded before use.
   - Reason: realistic rehearsal assets are useful, but live use must remain local-first.
2. What naming convention should assets use?
   - Recommended answer: `public/matches/{matchId}/{teamId}/{personId}.jpg`; team marks are generated from initials in data for MVP.
3. Should missing photos block validation?
   - Recommended answer: warn, not block, for MVP.
4. Should missing team logos block validation?
   - Recommended answer: no; MVP uses initials instead of team logos.
   - Confirmed answer: use simple initials first for MVP team marks.

### 15.6 Voting and Result Flow

1. Should judge votes be entered privately before any reveal?
   - Recommended answer: yes.
   - Confirmed answer: no separate private state for individual judge votes; each clicked judge vote appears immediately.
2. Should judge votes reveal one-by-one or all at once?
   - Recommended answer: one-by-one, because it supports presentation tension and recovery.
   - Confirmed answer: one-by-one in operator-selected order, using clickable judge controls.
3. Should team totals stay hidden until final result?
   - Recommended answer: yes.
   - Confirmed answer: yes; totals such as 2:3 appear only after advancing to result.
4. Does a 2:2 result remain a public tie, or is there an external tie-breaker?
   - Recommended answer: public tie unless official rules specify a tie-breaker.
   - Confirmed answer: public tie.
5. Should the controller allow vote changes after reveal?
   - Recommended answer: yes, but only as an advanced recovery action with clear visual state.
   - Confirmed answer: yes, visible in the controller and visually separated from normal controls.

### 15.7 Controller Operations

1. Should advanced jump controls be visible by default?
   - Recommended answer: yes for MVP operators.
2. Should keyboard shortcuts exist?
   - Recommended answer: yes for Next/Previous only after button flow works.
   - Confirmed answer: yes, `←` Previous and `→` Next for MVP.
3. Should the controller show validation warnings during live mode?
   - Recommended answer: yes, compactly, but errors should be resolved before live use.
4. Should the launcher reset votes automatically when starting?
   - Recommended answer: no; require explicit reset to prevent accidental data loss.

### 15.8 Font and Rendering

1. Can the repo bundle a Chinese font file?
   - Recommended answer: yes if license and file size are acceptable; otherwise lock the presentation laptop to a known installed font.
   - Confirmed answer: long-term bundle and lock down the font; MVP may use typical Windows Simplified Chinese fonts.
2. Which font is approved by the committee?
   - Recommended answer: `Noto Sans SC` or the same font used in existing approved slides.
   - MVP answer: `Microsoft YaHei` with `SimHei` fallback.
3. Does the event require exact Chinese typography matching PowerPoint?
   - Recommended answer: no for MVP, unless visual approval depends on it.

### 15.9 Technical Boundaries

1. Should the MVP remain TypeScript-only for data?
   - Recommended answer: yes until one real pilot validates schema.
2. When should YAML enter scope?
   - Recommended answer: after the first successful low-priority pilot.
3. Should we add new dependencies for validation?
   - Recommended answer: avoid unless needed; if using a library, add it explicitly to `package.json`.
4. Should 3D/WebGL stay in the MVP?
   - Recommended answer: no, unless it is already approved and stable on the presentation laptop.
   - Confirmed answer: no.

### 15.10 Success Measurement

1. Who measures the 5-minute population target?
   - Recommended answer: a technical committee member who did not build the app.
   - Confirmed answer: technical operator confirmation is required.
2. What baseline should the satisfaction questionnaire use?
   - Recommended answer: compare against the existing PowerPoint workflow using a 1-5 Likert scale.
   - Confirmed answer: 1-5 Likert scale; success threshold is average >= 4.0/5 across respondent groups.
3. Who must be interviewed after the pilot?
   - Recommended answer: department HOD, department executive, advisor, and technical committee operator.
   - Confirmed answer: technical operator, advisor, department executive, and HOD.
4. Does the 5-minute population timing include validation/build?
   - Confirmed answer: includes validation, excludes production build.
5. Is rehearsal mandatory before live use?
   - Confirmed answer: yes, full click-through rehearsal on the actual presentation laptop.

## 16. Decisions Needed Before Implementation

Critical:

1. Exact questionnaire questions.

Important:

1. Real asset naming convention.
