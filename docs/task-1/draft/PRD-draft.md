# PRD

## Objective

The initiative is to automate the slide generation process. Currently, the comittee of the QuanBian Championship relies on PowerPoint (PPT), that is, creating a PowerPoint template for a series of debate competition; Once the design is approved, these design will be adopted and applied consistently across more than 10 debate competitions. The pain point arises:

1. Due to the high standard of the advisors, the initial template design will experience frequent changes, making the template population be harder later as the time frame is restricted.
2. The template population is error prone. Currently, the template remains the same, yet the debaters' name, universities' name, judges' name are different, and their name are across different slides, and these processes are handled manually.

Therefore, the committe often suffer the tension due to the frequent changes and the pressure to populate the templates while ensuring the consistency, as there are quite a lot of other stuffs to handle as well. At the same time, it might suppress more creativity due to lack of technical knowledge like 3D animations, etc.

Hence, the initiative is to introduce HTML/CSS/JavaScript, the infrastructure of today's world together with the gradually more powerful AI system, to achieve several target:
1. Simplify the changes and allow for frequent changes. Due to the code used and AI, AI can verify the idea very easily, and can make changes very easily and within seconds.
2. HTML/CSS/JavaScript makes it easy to populate due to the static data type used, like CSV, JSON, YAML, etc, without changing much of the design. Hence, once a template is defined, the rest can remain flexible. If the design really require the changes, they might have two choices:
- Design configuration (adjusting the pixels, etc by the committee)
- The developer adjust the design for that specifically, allowing maximum flexibility
3. HTML/CSS/JavaScript makes it able to achieve better design, such as using three.js for 3D effect without building 3D animation from scratch using Adobe After Effect; They can use motion for animation without setting up a lot of PowerPoint design.

## High-Level Design

The idea is to support multiple designs across different seasons. For one seasons, there might be multiple templates required. Besides, there would be the need for data-local and local-first design, meaning that the solution design should remains minimal dependency, like it cannnot be deployed to cloud, and the data should remain local and easy to audit. Also, to maximize the reusability and incremental evolvement, I wish to have separation of concern, such as separting the calculation logic, the reusable parts and the parts that must deserve its own design.

## Clarifications-1

- "Make the design changes easy within seconds" is basically meant for initial draft design. Currently, when the committee has completed a first draft, the draft has to be reviewed by multiple advisors, and they will often say that "Adjust this" "Adjust that" and perhaps will say "Use another design for this font and use another design for the layout", yet the issue is that the design using powerpoint manually takes time, and not to say there's a lot of stuff to be produced. Therefore, I wish the use of HTML/CSS/JS + AI can mitigate the issue by allowing each of them to discuss the design at different level: At a coarse level, they can decide the kind of design they want; After the kind of design is decided, they can discuss on whether how each element should be designed, positioned; After everything style-related elements have been confirmed, then they only proceed to discuss the minor elements. Though this might not always the case and just a proposed workflow, but I hope this can at least make the discussion more focus on "What will be more visually appealing“ rather than stucking in the tension of unwilling to make changes or "I can't do it! The time is too packed and I have no idea on using any technology currently have (PS, AI, etc.) to produce it". I hope the technology could mitigate the interpersonal tension as well as the technical gap.

- For export, currently there are no export needed. Actually, as long as the webpage can support local-rendering without relying on cloud services or any API, can it can support both Audience and Presenter mode, then it's just totally fine. The screen size and the scaling might be the issue, and there's more reality case to be tackled. You might further study on this and warn me for the live-ready concerns to be tackled.

- Currently, the slide is also handled by the committee that knows how to use the PowerPoint well, as these design are used heavily with the shadow, font size, border, animations, position, etc. Hence, from my perspective, there's no differences betwen using PPT or HTML/CSS/jS from a non-Technical department committee. I admitted that using HTML/CSS/JS might be imposing a steeper learning curve for those non-IT background students as they might need to pick up the basics, yet I have few arguments to support this:

1. AI Assistance. If they requires any changes yet they have no idea of it, they can always call their favourite AI for assisting once the template is done. Compared to PPT, this is not even doable.
2. Better training. Previously there are training for PowerPoint, but there's too much of stuff to study as there's quite a lot of buttons, operations, etc., not to mention the resources for PPT training is lacked online. However, for text-based HTML/CSS/JS, there are so much documentations, videos and forums online, hence the training will be easier. And also, it will be easier to train with the help of keeping the prompt used and the template used, then AI with skills can study the repo and make the slide better and better, which is another assests that good to have.
3. Actually nothing much to adjust. In my design, once the template is done, they just need to update the configuration (the use of configuration will be further explained later) using YAML/TOML/JSON and CSS for color, sizing, shadowing, etc. only.
4. It enables live collaboration and assistance. Previously, the slide is only on one's computer, and no one can access, or the collaboration is much less effective. Now, with the help of AI, one can say that: I have decided the overall design for the slide, hence A should responsible for section A, B should responsible for section B, while the seniors can chip in to assist and track progress using Git for real-time collaboration. The new working mode might be introduced if needed (not neessary, but enabled for the possibility).

- The final output format should be "Something that allow for a level of dynamic changes, like to play around with 'Which judge vote for which team'?", hence the format should be dynamic, probably .pptx, HTML or browser-presented slides. In my idea, if exported to .pptx, then it will fallback to the issues I have mentioned previously, so I will go with a web page structure, perhaps in React + TailwindCSS + TypeScript. Actually, in the current committee, they are not so restricted to be what exact format to be used, they just want something that "It works well and reliably and is grand enough, and shouldn't introduce any issue". Hence, as long as the format has been verified and proved reliable, then it should be fine. That's the reason of why I'm choosing HTML as it's suitable.

- Yes, I totally agree that everything still requires a human review, but for the "frequent changes during draft" phase, this is a nature - human need some visualization for further discussion. There will be progressive evolvement and slide finalization, so no worries. Just as what you have mentioned: AI assists design iteration and code modification, while the system provides deterministic data population, preview, validation, and export.

3-"Too technical" - This question has been answered. You may refer to the previous ansewr. However, your better options are actually considered, such as limited safe settings, but the actual, pragmatic ways of doing it is still studied and reviewed. Currently, asking the technical department committee to tune themselves will be a good and practical way.

4-Yes, this is a great feature to have! I will like to add all of them:
- Missing debater names
- Duplicate teams
- Long names that overflow
- Missing university names
- Wrong judge assignment
- Round mismatch
- Broken logo/image paths
- unsupported characters or language rendering issues

Actually, in my design, the configuration should consists of two level: Season-level and match-level. For season-level, there will be an overall YAML file like the following:

```yaml
judges:
  - "Ng Zhi Yang": src/imgs/judges/ng-zhi-yang.png
  - Lee Shien hui
debaters:
    - "Ng Zhi Yang": src/imgs/debaters/ng-zhi-yang.png
```
And this serves as a gloabl one to pick up the correct image to use, as the judge/ debater for a season are usually the same, especially their photos. For a match-level, it should be something like this:

```yaml
pro:
  university: UM
  debaters:
    - Ng Zhi yang
      major: 软件工程系/学士三年级
    - Lee Shien Hui
cons:
  university: UM
  debaters:
    - Ng Zhi Yang
    - Lee Shien HUi
judges:
  - Ng Zhi Yang
  - Lee Shien Hui
```

The `/` serves as an escape for splitting between multiple lines for more granular control.

- 5. Yes, when I mention "Use AI", it's not integrate AI into the system yet anything, yet it's to use AI to facilitate the presentation generation. The main goal is to build a local, offline and reliable presentation, not a complete website or anything.

Costs Judgement:
- Template architecture: reusable components, design tokens, season-specific themes.
  - Some of these I will say is "one-time" cost. For eample, those components, and the architecture can be build and be iterated between different committee (FYI, our committee will be changed every two years, and hence how the knowledge can be transferred is important), and even seniors can chip it to help as well.
  - For season-specific themes, if the slide can have more than 5 match to use, then having a seson-specific theme might help, or even all-in the webpage-based if the final effect is impressive and amzing, plus it really helps the workflow.
- The data (YAML/TOML), examples and validation rules will be fixed for a season (at least), or at least remain unchanged for a quite long period, so these are essentially reusable.
- No export is expected. Preview in localhost.
- Long text handling: requires further analysis.

- Backstage Control:
Since this is a debate competiton that need to show the current session (like who is speaking?) and announce the final result, I wish there will be a dual view mode, that is, Audience Mode and Controller Mode. (or any better namign convention). For the controller mode, I will say it's actuall a better version of the typical presenter mode in any slide presentation. Similarly, it should provide the slide-specific preview and enable the staff to switch between different slides, yet it should provide "Slide-specific control pane" as well, which is different from others. Slide-specific control pane refers to the control, like in a typical Power point, when one click, then the animation might appear. I hope the control pane allow the users to do something like this. Beside, when annoucing the result, it should allow the staff to pick the vote for each judge (as what has been done now in App.tsx) when the MC annouce it, and a result page that sum up everything.

One of the technical idea is Separation of Concern and Headless Engine, that is, encapsulate more logic and possibly the backstage logic to mimic existing PowerPoint to some extent, while allowing committee for each season to come up with their own UI/UX.

## Clatifications-2

For now, I think you might skip those code-introduced issues first, as these can be mitigated, trained, and studied and conquered, not something that requires much effort to pay attention (at least for now). Our organization always assume one can learn everything fast and reliably otherwise they won't be picked, so this is fine. The real implementation issue will be later verified by human during real development.

Second, you can very safely assume that they will be presenetd on same machines, same profiles and single projector machine. Basically, when projected to the LED, it will use the "Audience Screen" and the local computer will show the "Controller screen", just like how Canva/ Ms PowerPoint will do. They are using LED with projector with hardware connection, so your concern should no longer be worried.

It is possible for the miss press of any key, but the issue is the same for using PPT, so I think it's still okay, just worth further key restriction to avoid stupid errors. It should be able to run on everyone machine for this prohecttor setup.

For the cost/tradeoff, actually the dynamic/live-data is not the issue, is too many set of slides requires modification. Existing design have a lot of pages (possibly more than 70+ pages for each slide) due to the heavily used animations, and they are quite a lot of images and texts, like team A has diffrent people (name, major school, images) to be changed, hence it can take up to 45mins - 60mins for one slide. But there are more than 1 slide: The whole season might need to repeat this for 30 times, meaning 30 hours lost. That's the main initiative to simplify it because the staff is still a student and still have a lot of other stuff to deal with. Previously we do it in a static ways yet a lot of slides, but now maybe another ways can be considered. 

No worries of the technical skills needed - we always hae that.

So far for now, this is just an rough idea to be tested especially for the time taken/ costs of learning after the initial architecture has been built, and evaluate the AI intereaction and its usability by human. Once everything has been approved, then only it will proceed to the low-priority match testing to see how it works, then gradually adopt it if it really helps.

Yes, my idea of headless engine should be headless componen, like for the calculation - something similar to the TanStack Query/ TanStack Table that provides convinient methods without the caller need to consider to much.

Balancing between manual/ automation is something worth validating.

Answers:
1. run on the same laptop, yet the audience will be projected to the LED.
2. Simply not preferred to avoid network dependency.
3. Technical Committee will operate the controller during the debate. However, it should be easy to modify as well. If possible, I wish that any spot issue can be fixed in real-time without audience awareness (I'm not quite sure if this is possible)
4. I'm not quite sure what you means for distinct slide types. If you mean templates, throughout a season of compeition, there will be 3, and 2 of them will be used repeatedly.
5. It depends, but based on past it is around 35 - 40.
6. No, fix it. It will be the only way. Even for PPT it's stil the same, fix it and delay it until it works properly.
7. The data like match-level debaters and judges will be provided usually 12 hours or when worse, 6/4 hourse before, but usually one day before at night, hence design all in upfront is not quite possible.
8. Support consistently on all machine, yet the font can be installed on other's machines as well, no worries on those human-involved actions, as long as make it smooth. I think you can think in this way: When using PPT, am I have to do this? Then compare both, rather than just inspect either side. Compare PPT and Web page based approach. If webpage approach has better profit/loss, then use it.
9. Sometimes, but they should be fine with either way.
10. It can be good to have, but remain as zip file and spread is also considered.

## Clarifications-3
Notes from AI

```md
Where The Case Is Strong

The web approach is now clearly better than manual PPT for the repeated match-data problem. The value is not mainly “AI can change design fast.” The value is:

One approved template can render 35-40 matches.
Names, universities, majors, judges, images, and votes come from structured data.
Validation can catch repeated manual mistakes.
Audience view and controller view can support live result reveal.
Same-machine projection removes most network synchronization risk.
This is a real product-shaped problem, not just a technology experiment.

Do not recreate 70+ PPT pages one-to-one. That would transfer the maintenance burden into React.

The better model is: one slide type with states. For example, “team intro” may have staged animation states instead of 10 duplicated slides. “Result reveal” should be one component with controller-driven reveal steps. This is where web can be much better than PPT.

I would scope MVP like this:

Same laptop only.
Browser audience view + controller view.
One repeated match template.
Data by stable IDs, not names.
Local validation command before launch.
Built app served locally, not raw dev mode.
Locked keyboard controls or confirmation for dangerous actions.
Emergency static fallback.
```

Remaining Questions:
1. For one repeated teamplet, the actual slide needed:
- General slide (with competition ID, title, pro/cons school name & logo)
- Advertisement page (all logos)
- Pro team introductions (school name, school log, debaters' name and major (4 debaters) & their 持方)
- Cons team introductions (school name, school log, debaters' photo + name and major (4 debaters) & their 持方)
- Judge Introduction (Judge photoes + name)
- Sessions (for those single debater, all are consistent- debater's photo, name, session name, and thier 持方)
    - 正方一辩 立论
    - 反方一辩 立论
    - 反方二辩 质询
    - 正方二辩 质询
    - 反方二辩 总结
    - 正方二辩 总结
    - 三辩 对辩 (Two debaters' photo name, session name, 辩题)
    - 正方三辩 总结
    - 反方三辩 总结
    - 自由辩论 (Two schools' logo, name, 辩题)
    - 反方四辩 总结
    - 正方四辩 总结
- Final Judge Votes (Like I have mentioned previously)
- Total results page
- Next competition information

- The pro/con team introduction has 5 slides each; The judge has 6 slides, final judge votes are single one yet have different votes; Total result page depends, from minimal 5 to 10 slides for different possible outcome. Animation apply to the pro/con/judge introduction and votes (slightly). For low priority one, the animation and design can kept simple as long as it works correctly and reliably.

- During live use, though edit data/votes/state/style/text while the audience window is open should be possible in case of emergency, yet it should probably don't allow it for reliability and to avoid any unexpected incidents. For the voting, the operator should work in the control panel as mentioned just now.

- No need to consider the emegrency static fallback first.

- As I have provided previously for the sequence and the content.

## Clarifications-4

```md
The strongest evidence is now clear: the repeated template workload is large, the match data arrives late, and the repeated edits are mostly structured substitutions across many animated slides. That is exactly where a web/data-driven presentation system can beat manual PPT.

The idea has real benefit if the MVP goal is:

Use one approved repeated match template to generate and operate many debate-match presentations from structured data, with same-laptop audience/controller mode and validation before use.

I would not yet approve the broader ambition of a multi-season reusable “headless presentation engine” until one real template proves the time savings.

The slide scope in docs/PRD-draft.md (line 159) to docs/PRD-draft.md (line 180) makes the use case concrete. These are not random slides; they are repeated structures:


General match slide

Sponsor/advertisement slide

Pro/cons team introductions

Judge introductions

Debate session slides

Judge votes

Result page

Next competition info


This is feasible. Most of these can be implemented as data-driven components, not manually duplicated pages.

The note in docs/PRD-draft.md (line 182) is also sensible: for a low-priority pilot, keep animation and design simple, and verify correctness/reliability first.

Feasibility

Technically feasible.

Operationally feasible if:

same laptop is guaranteed
technical committee operates it
data is validated before the event
first pilot uses a low-priority match
scope is one repeated template
styling changes during live mode are blocked
build/run instructions are simple

Manual PPT is still better for one-off highly custom design decks.

Web is better for your repeated match use case because the repeated substitution cost is high and the content structure is predictable.

A hybrid may be best long term: use PPT or design tools for early visual exploration, then implement approved repeated templates in web code for production use.
```

Answer to Critique:
- I have to clarified that the main goal is to reduce repeated match-slide population work. The third one should be a potential benefit such that allowing AI, a super executive to chip in for the delivery might speed up the whole process, yet it's not the main goal, it's a "potential benefit" that worth examining. Improve live presentation control is a way to achieve the main goal to reduce the boilerplate and allow for more flexibility if needed, yet it's not the main goal. The main goal is always one and focused: reduce repeated work, and allow the committee to focus on other tasks. As what you have mentioned: "35-40 repeated match decks, each previously requiring 45-60 minutes of manual modification, with late-arriving data."

- Yes, I will move the actual implementation into the later sections. For now you can mark it first.
- Yes, I think I will go with hybrid: For the grand final, fallback to use PPT (Unless it's proven that using webpage is reliable under all circumstances, and webpage has better productivity (like reusable prompts/ styling defined/ skills defined, etc.), worfklow smooothness and better visual appearance); Then use webpage for those repeated low-priority slide population.

Answers to questions:
- For the MVP, a template consisting of team intro, session slides, judge intro, result/vote flow should be there, yet it can be a simple one first, with consistent theme and styling applied, with mock data in used.
- Yes, the 5 pros/cons and 6 judges slides actually animations steps, because the MC will say "The first debater/ judge is ..." then the slide should have the animation to show them。
- Yes, just different outcome. Let say two judge votes for Team A and 3 judge vote for team B, then it would be 2:3, and for 5 judge there will be 6 possible outcomes.
- It should follow a fixed ordered run-of-show when each slide can be configured manually and designed specifically to avoid misuse/ mis-operation. You might critique this idea.
- The success threshold should be
  - Populating 1 match deck for a technical committee can be done within 5 minutes as long as all data are provided by different departments. (Reduce by around 83%)
  - Higher satisfaction level for the department HOD, department executive and advisro by an expected increase of 40% through a questionnaire and interview.


### Clarifications-5

```md
Critique

The fixed run-of-show should not mean “no escape hatch.” I would design:

Default mode: fixed Next/Previous flow only.
Controller mode: visible current slide, next step, and current reveal state.
Admin/advanced mode: jump to any slide/step, reset vote, correct wrong state.
Dangerous actions require confirmation.

The success threshold in docs/PRD-draft.md (line 257) is good but needs tighter wording. “Populate one match deck within 5 minutes” is only fair if all source data and images are already prepared, named correctly, and placed in expected folders. If image cropping, missing majors, typo checking, or judge changes are included, 5 minutes may be unrealistic.

The satisfaction metric in docs/PRD-draft.md (line 259) is too vague. Define the baseline and question scale. Example: “Average satisfaction score improves from 3.0/5 to 4.2/5 among technical committee and HOD respondents.”
```

- Input format: TypeScript data first, then proceed to YAML when proof of concept are valid.
- Participants photos are prepared, yet it might need to be fixed for a specific template. This should be adjustable through configuration. For MVP now, just assume everything is ready.
- 5-minute population should be including mainly the editing structuring data ONLY, as images handling should be done once the template is prepared (as they can try on different combinations already) or some minor modifications are needed, but the main time usage is spent on the editing structural data, so only the data side should be cosnidered within 5 minutes.
- MVP supports 5 judges first. In the future, it should support 4 judges well. For right now there will have either 4 or 5 judges only.
- Yes, only 4 debaters per side under all circumstances. That's how chinese debate works (at least for this comp specifically)
- No need, just vote. If tie, then just show 2:2 and present the tie honestly with no differences with other kind of results. The tie will be handled in other ways.

## Technical Stack

- Git
- React
- TailwindCSS
- TypeScript
- Vite
- Motion
- 后台控制


I have further updated the PRD-draft.md . Review and critique it. Be honest, be true, and seeks as many clarification you need when you are unclear. Keep asking me if you have any further questions until you're confident enough the design and the idea are worth implementing and can bring real benefits

Interview me relentlyessly about every aspect of this plan until a shared understanding is reached. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer. Ask as many questions as needed until you're confident enough for the plan from all aspects. Do not assume anything if not clearly permitted.