# Proposal V1: Match Slide Automation

## Current Scenario

The QuanBian Championship committee currently prepares match presentation slides in PowerPoint. Once a design is approved, the same slide structure is reused across many debate matches, but each match still requires manual replacement of team names, university names, debater names, majors, judge names, photos, logos, motions, and result content.

For repeated low-priority match decks, the season may require around 35-40 generated decks. Existing PowerPoint-based preparation can take about 45-60 minutes per match deck because the same information appears across many pages and animation steps. Match-level data may arrive late, commonly 12 hours before use and sometimes only 4-6 hours before use.

The grand final and other high-stakes, highly bespoke decks should remain in PowerPoint until the web-based workflow proves reliability, productivity, and visual quality.

## Pain Points

- Manual population is repetitive and slow when the same approved template is reused across many matches.
- Repeated manual edits are error-prone, especially for names, universities, majors, photos, judge assignments, motions, and result pages.
- Late-arriving match data creates time pressure for student committee members who also handle other responsibilities.
- PowerPoint animation-heavy decks often duplicate content across many pages, increasing the number of places that must be edited.
- Design iteration can create interpersonal and scheduling tension when advisors request changes under a tight timeline.

## Objectives

- Reduce repeated match-slide population work for low-priority repeated match decks.
- Target structured data population within 5 minutes per match deck when all required source data and assets are already prepared.
- Keep the workflow local-first and usable without cloud deployment or network dependency.
- Separate reusable presentation structure from match-specific data.
- Provide a same-laptop audience/controller presentation flow for debate-specific live needs.
- Treat AI as a secondary potential benefit for design iteration and future maintenance, not as the core justification.

## Constraints

- The MVP runs on one laptop using the same browser profile.
- The audience screen is projected to the LED/projector while the controller screen remains visible to the technical committee.
- Internet access should not be required during live use.
- MVP uses Simplified Chinese copy by default.
- MVP official event title is `第二十届全国大专辩论会`; future decks should always confirm the exact official title before implementation.
- MVP assumes participant photos, logos, and other production assets are already prepared and placed correctly for real match use.
- MVP mock/rehearsal assets may be sourced from free, royalty-free online resources, then downloaded and stored locally before live use. Candidate sources include [Pexels](https://www.pexels.com/license/) and [Unsplash](https://unsplash.com/license/), with care to avoid brand, endorsement, and sensitive-context issues.
- MVP population timing excludes collecting, cropping, renaming, or fixing source images.
- MVP assumes 4 debaters per side.
- MVP uses 5 judges first, while result logic should be designed to support 4 or 5 judges.
- Live editing of style, text, or source data during the audience presentation is out of MVP scope, except vote/state control through the controller.
- MVP official vocabulary includes `正方`, `反方`, `持方`, `辩题`, `辩手`, `评审`, and `决选票（Votes）`.

## Operating Disciplines

- Use web-based slides first for repeated low-priority match decks, not for the grand final.
- Keep PowerPoint for one-off, highly custom, or high-stakes decks until the web workflow is proven.
- Build a simple and reliable MVP before investing in reusable multi-season infrastructure.
- Model repeated animation pages as slide states or reveal steps instead of duplicating pages one-to-one.
- Use stable IDs for data references instead of display names.
- Always confirm official side labels before finalizing the schema or slide text.
- Validate data before live use rather than relying only on visual checking.
- Keep normal operation fixed and predictable, while providing advanced recovery controls for technical operators.

## Proposed Solution

### MVP

The MVP is a browser-based presentation prototype for one repeated match template. It should use mock data first and prioritize correctness, reliability, and preparation-time measurement over complex visuals.

MVP capabilities:

- Same-laptop audience view and controller view.
- Audience view projected to the LED/projector.
- Controller view visible to the technical committee.
- TypeScript data input first.
- Migration to YAML only after the proof of concept validates the schema and workflow.
- Formal clean broadcast web-native visual theme rather than copying the current prototype design.
- Fixed ordered run-of-show for normal operation.
- Advanced jump panel visible by default for MVP operators.
- General slide with competition ID, title, 辩题, `正方`/`反方` school names, and team marks.
- Team intro slides for `正方` and `反方`.
- Data-driven session slides:
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
- Judge intro slides.
- Per-judge clickable 决选票 flow controlled from the controller view, following the current prototype interaction idea but not its visual design.
- Individual judge votes appear immediately when clicked with judge photo, judge name, and chosen side; aggregate totals remain hidden until the result slide.
- Result flow that presents normal scores and ties honestly using `胜` and `和`, never `负`; final result shows raw score with wording, such as `正方 胜 3:2`.
- Result logic designed for 4 or 5 judges, even if MVP data starts with 5 judges.
- Keyboard shortcuts for MVP: `←` previous and `→` next.
- 辩题 appears on the general slide and relevant session slides, not as a separate motion-only slide.
- Chinese controller and audience copy by default, with translation added only after asking.
- Typical Windows Simplified Chinese font for MVP; later versions should bundle and lock down a known Chinese font.
- Debater cards show name and major only; university appears at team level.
- MVP person assets use royalty-free portrait-style images for debaters and judges; team marks use simple initials first.
- Color mapping: `正方` blue and `反方` red.
- Portraits use rounded rectangles with 8px radius.
- Full official school names are used only; no short-name display field in MVP.
- Judge introduction cards show judge photo and name only.
- Vote reveal cards show judge photo/name before reveal, then judge photo/name/chosen side after reveal.
- Recovery controls stay visible in the controller but are visually separated from normal controls.
- Text wraps to fixed limits and then warns; school names warn above 16 Chinese characters, majors above 14 Chinese characters, 辩题 above 60 Chinese characters, and debater names above 8 Chinese characters.

Out of scope for first MVP:

- Grand final replacement.
- Advertisement page.
- Next competition information slide.
- Committee-editable YAML workflow.
- Live style/text/source-data editing during presentation.
- Generic multi-season headless presentation engine.
- 3D/WebGL decorative visuals.

### Full Proposed Direction

The full proposal extends the MVP into a reusable local-first slide generation and presentation workflow for repeated competition decks.

Full proposed capabilities:

- Reusable sponsor/advertisement and next-competition sections across future templates.
- Season-level and match-level data model.
- YAML-based committee-editable data after the schema stabilizes.
- Local validation for:
  - missing debater names
  - duplicate teams
  - long text and overflow risk
  - missing university names
  - wrong judge assignment
  - round mismatch
  - broken logo or image paths
  - unsupported characters
  - Chinese font and rendering issues
- Audience/controller mode with slide-specific control panes.
- Fixed ordered run-of-show with advanced recovery controls.
- Optional emergency static fallback once the workflow is used in higher-risk settings.
- Future reusable headless presentation components after one real template proves time savings.
- Optional AI-assisted design iteration, prompt reuse, and repo-aware maintenance.

## Manual PowerPoint vs Web-Based Approach

Manual PowerPoint remains better for:

- Grand final decks before web reliability is proven.
- Highly bespoke one-off designs.
- Advisor-heavy last-minute visual editing.
- Cases where direct visual editing matters more than repeated data reuse.

The web-based approach is better for:

- Repeated low-priority match decks.
- Late-arriving structured match data.
- Reusing one approved template across many matches.
- Reducing repeated name, university, judge, photo, and result edits.
- Debate-specific controller behavior such as judge vote reveal and result flow.

The recommended adoption path is hybrid: keep PowerPoint for high-stakes custom decks while piloting web-based slides for repeated low-priority decks.

## Risks, Costs, and Tradeoffs

- Upfront architecture cost is real: schema design, slide-state modeling, controller state, validation, and documentation must be built before time savings are proven.
- A web workflow introduces build, browser, font, asset-path, and runtime risks that PowerPoint users may not expect.
- Training can reduce human skill gaps, but it does not replace validation, rehearsal, and clear operating instructions.
- The 5-minute population target is realistic only when structured match data and prepared assets are already available.
- Hardcoding too much for the MVP may create future rework, especially around judge count and result display.
- Building a generic engine too early may waste effort before one real template proves the workflow.
- AI can help with design iteration, but generated changes still require human review and testing.

## Success Criteria

- A technical committee member can populate one MVP match deck within 5 minutes when all required structured data and prepared assets are available.
- The 5-minute timing excludes collecting, cropping, renaming, or fixing source images.
- MVP output correctly renders:
  - 4 debaters per side
  - 5 judges for the first test
  - result display that can also support 4 judges
  - tie result display such as 2:2 without falsely declaring a winner
- Audience and controller views run on the same laptop without cloud or network dependency.
- Normal presentation flow can be operated through fixed Next/Previous controls.
- Advanced jump controls are available to the technical committee for recovery.
- Session and result slides render from local data/assets.
- The MVP is tested on at least one low-priority match before any higher-stakes adoption.
- Department HOD, department executive, advisor, and technical operator satisfaction is measured using a 1-5 Likert scale.
- Satisfaction success threshold is average score >= 4.0/5 across all respondent groups.
- Technical operator confirms deck population within 5 minutes, including validation but excluding production build.
- Production build is completed before event day.
- A full click-through rehearsal is completed on the actual presentation laptop before live use.

## Open Follow-Up Items

- Define the exact TypeScript match data shape for MVP.
- Define the first mock match data set, including downloaded local mock assets where real participant assets are unavailable.
- Define exact questionnaire questions.
- Decide when to migrate from TypeScript data to YAML.
- Decide what emergency fallback is required before using the web workflow for higher-risk matches.
