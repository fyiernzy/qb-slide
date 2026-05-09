# Idea

## Prompt

Interview me relentlessly about every aspect of this plan until a shared understanding is reached. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer. Ask as many questions as needed until you're confident enough for the plan from all aspects. Do not assume anything if not clearly permitted.

## Round 1

I want to add a configuration pane for setting up the debaters's name, major, university and the judges. For debaters, it should have two sections: 正方 and 反方. For either side, there should be a dropdown list to choose the university first. Once university is selected, it should allow the users to select debaters for different order.

Both university and debaters dropdown sources must be predefined. They follow a principle: Clear old value when duplicated values detected. Meaning to say, when I choose UM for 正方, then when I choose UM for 反方 again, the university/ debaters infomation will be removed.