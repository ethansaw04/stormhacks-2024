import cohere 

co = cohere.Client(
    api_key=""
) 

stream = co.chat_stream( 
    model='command-r-08-2024',
    message='egg, rice, tomato',
    temperature=0.3,
    chat_history=[],
    prompt_truncation='AUTO',
    connectors=[{"id":"web-search"}]
) 

for event in stream:
    if event.event_type == "text-generation":
        print(event.text, end='')