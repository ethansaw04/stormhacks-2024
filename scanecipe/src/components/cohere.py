import cohere 

co = cohere.Client(
    api_key="",
) 

stream = co.chat_stream( 
    model='command-r-08-2024',
    message='egg, carrot, rice',
    temperature=0.3,
    chat_history=[{"role": "User", "message": "egg, tomato, noodle"}, {"role": "Chatbot", "message": "Here\'s a simple recipe you can try with the given ingredients: \n\n# Tomato and Egg Noodle Stir-Fry \n\n## Ingredients: \n- 200g of your favorite noodles (egg noodles, udon, or rice noodles work well)\n- 2 large eggs\n- 2 medium-sized tomatoes, diced\n- 1 tablespoon of soy sauce\n- 1 teaspoon of sesame oil\n- 1 clove of garlic, minced\n- A pinch of red pepper flakes (optional, for spice)\n- Salt and pepper to taste\n- Chopped green onions for garnish (optional)\n\n## Instructions: \n\n1. Cook the noodles according to the package instructions. Drain and set aside. \n\n2. In a large pan or wok, heat the sesame oil over medium-high heat. Add the minced garlic and cook for about 30 seconds, stirring frequently, until fragrant. \n\n3. Crack the eggs into the pan and scramble them quickly. Once the eggs are almost cooked through, add the diced tomatoes and stir to combine. \n\n4. Pour in the soy sauce and add a pinch of red pepper flakes (if using). Stir well and cook for about 2-3 minutes, allowing the tomatoes to soften and release their juices. \n\n5. Add the cooked noodles to the pan and toss everything together. Season with salt and pepper to taste. \n\n6. Cook for an additional 2-3 minutes, allowing the flavors to blend and the noodles to absorb the sauce. \n\n7. Serve the noodle stir-fry garnished with chopped green onions, if desired. \n\nThis dish is a quick and easy way to enjoy a flavorful meal with minimal ingredients. Feel free to adjust the spices and seasonings to your taste preferences!"}],
    prompt_truncation='AUTO',
    connectors=[{"id":"web-search"}]
) 

for event in stream:
    if event.event_type == "text-generation":
        print(event.text, end='')